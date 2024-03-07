// AdminPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import SignIn from '../components/SignIn/SignIn';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
// Importing from Realtime Database with aliasing
import { ref as databaseRef, onValue, getDatabase, set } from 'firebase/database';


interface SectionContent {
    text?: string;
    imageUrl?: string;
    layout?: 'left' | 'right';
}
  
interface Section {
    type: string;
    content: string | SectionContent;
}

const AdminPage: React.FC = () => {
    const navigate = useNavigate();

    // Tab State
    const [activeTab, setActiveTab] = useState('manageBlogs');

    // User states for checking admin rights
    const userContext = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Blog States
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [templateType, setTemplateType] = useState('A');
    const [sections, setSections] = useState<Section[]>([]);
    const [blogId, setBlogId] = useState('');

    // Post states for rendering manage blog page
    const [posts, setPosts] = useState([]);
    const [starredPosts, setStarredPosts] = useState([]);

    useEffect(() => {
        if (userContext?.currentUser) {
          const db = getFirestore();
          const userRef = doc(db, "users", userContext.currentUser.uid);
          getDoc(userRef).then((docSnap) => {
            if (docSnap.exists() && docSnap.data().isAdmin) {
              setIsAdmin(true); // Used only to control UI elements
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
    }, [userContext?.currentUser]);

    // Fetch posts from Firestore
    useEffect(() => {
        const fetchPosts = async () => {
            const db = getFirestore();
            const postsRef = collection(db, 'posts'); // Reference to your 'posts' collection
            const querySnapshot = await getDocs(postsRef); // Fetch posts from Firestore
            const postsData = querySnapshot.docs.map(doc => ({ 
                blogId: doc.id, // Get document id (blogId)
                ...doc.data()   // Get document data
            }));
            setPosts(postsData); // Set state with fetched posts
        };

        fetchPosts();
    }, []);

    // Fetch starred posts from firestore
    useEffect(() => {
        const dbRealtime = getDatabase();
        const starredRef = databaseRef(dbRealtime, 'starredPosts');

        const unsubscribe = onValue(starredRef, (snapshot) => {
            const data = snapshot.val();
            setStarredPosts(data ? Object.values(data) : []);
        });

        // Return a cleanup function to unsubscribe from the the listener
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          // Update context or state as needed
          if (userContext?.setCurrentUser) {
            userContext.setCurrentUser(null);
          }
        }).catch((error) => {
          // An error happened.
          console.error('Logout Error:', error);
        });
      };

    if (!userContext?.currentUser) {
        return <div className="h-screen flex items-center justify-center"><SignIn /></div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    // TO DO: Implement Admin Functionality
    if (!isAdmin) {
        return (
            <div className="h-screen flex flex-col items-center justify-center mt-10">
                <p>You need an admin account to access this page.</p>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Logout
                </button>
            </div>
        );
    }

    // Blog Submission Functions
    const handleAddSection = (type: string) => {
        let newSection: Section;
        switch (type) {
            case 'paragraph':
            case 'title':  // Handle title similarly to paragraph
                newSection = { type, content: '' };
                break;
            case 'image':
            case 'paragraphWithImage': // Handle paragraphWithImage and image
                newSection = { type, content: { text: '', imageUrl: '', layout: 'left' } }; // default layout for 'paragraphWithImage'
                break;
            default:
                newSection = { type, content: '' };
                break;
        }
        setSections([...sections, newSection]);
    };
    
    
    
    const handleSectionContentChange = (content: string | Partial<SectionContent>, index: number) => {
        const updatedSections = sections.map((section, idx) => {
            if (idx === index) {
                if (typeof content === 'string') {
                    return { ...section, content };
                } else if (typeof section.content === 'object') {
                    return { ...section, content: { ...section.content, ...content } };
                }
            }
            return section;
        });
        setSections(updatedSections);
    };
      
    
    
    const handleFileUpload = async (file: File, index: number) => {
        const storage = getStorage();

        // Generate a unique filename: OriginalName_YYYYMMDDHHMMSS.ext
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").substring(0,14); // YYYYMMDDHHMMSS format
        const fileExtension = file.name.split('.').pop(); // Extract file extension
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        const uniqueFileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
        
        const storageRef = ref(storage, `images/${uniqueFileName}`);
    
        try {
            const snapshot = await uploadBytes(storageRef, file);
            // Retrieving the image URL from Firebase after uploading the image
            const downloadURL = await getDownloadURL(snapshot.ref);
    
            const updatedSections = sections.map((section, idx) => {
                if (idx === index) {
                    if (section.type === 'image') {
                        return { ...section, content: downloadURL };
                    } else if (section.type === 'paragraphWithImage' && typeof section.content === 'object') {
                        // Ensuring that content is an object before spreading
                        return { ...section, content: { ...section.content, imageUrl: downloadURL } };
                    }
                }
                return section;
            });
    
            setSections(updatedSections);
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };
    
    // Debug version of handleSubmit. Everything is Client side right now.
    const handleSubmit = async () => {
        const db = getFirestore();

        // Ensure blogId is defined
        if (!blogId) {
            alert("Blog ID is required.");
            return;
        }

        try {
            const docRef = doc(db, `posts/${blogId}`);
            await setDoc(docRef, {
                title,
                shortDescription,
                templateType,
                sections,
            });
            
            // Alert the user
            alert("Post uploaded successfully!");

            // Reset form state
            setTitle('');
            setShortDescription('');
            setTemplateType('A'); // or your default value
            setSections([]);
            setBlogId('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to upload post. Please try again.");
        }
    };

    const handlePreview = () => {
        localStorage.setItem('previewPost', JSON.stringify({ title, shortDescription, templateType, sections, blogId }));
        window.open('/blog/dev', '_blank');
    }
    /*
    // Firebase Function code TBA whether to use.
    const handleSubmit = async () => {
        const functions = getFunctions();
        const submitBlogPost = httpsCallable(functions, 'submitBlogPost');

        submitBlogPost({
            blogId,
            title,
            shortDescription,
            templateType,
            sections
        }).then((result) => {
            // Handle success
            console.log(result.data.message);
            // Optionally reset form state here
        }).catch((error) => {
            // Handle errors
            console.error('Error submitting blog post:', error);
        });
    };
    */


    // Code for deleting sections
    const handleDeleteSection = (index: number) => {
        setSections(sections.filter((_, idx) => idx !== index));
    };
    
    const handleLayoutChange = (layout: 'left' | 'right', index: number) => {
        const updatedSections = sections.map((section, idx) => {
            if (idx === index && section.type === 'paragraphWithImage') {
                return { ...section, content: { ...(section.content as SectionContent), layout } };
            }
            return section;
        });
        setSections(updatedSections);
    };


    // Admin page content goes here...
    // Tailwind CSS classes
    const inputClass = "mb-4 px-3 py-2 border rounded";
    const textareaClass = "mb-4 px-3 py-2 border rounded w-full";
    const buttonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-4";
    const fileInputClass = "mb-4";
    const deleteButtonClass = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded";

    const renderAddBlogContent = () => {
        return (
            <div className="max-w-4xl mx-auto p-6 min-h-screen">
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
                <textarea placeholder="Short Description" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className={textareaClass} />
                <select value={templateType} onChange={e => setTemplateType(e.target.value)} className={inputClass}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
                <input type="text" placeholder="Blog ID" value={blogId} onChange={e => setBlogId(e.target.value)} className={inputClass} />

                <p>HINT: Add stars to **Make Text Bold** and hashtags to ##Make Text Red##</p>
                <p>Example: Add stars to <strong>Make Text Bold</strong> and hashtags to <span className="text-red-500">Make Text Red</span></p>
                {sections.map((section, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex flex-row justify-between my-4">
                            <label className="block font-bold mb-2">Section {index + 1} - {section.type}</label>
                            <button onClick={() => handleDeleteSection(index)} className={deleteButtonClass}>
                                X
                            </button>
                        </div>
                        {section.type === 'paragraph' && (
                            <textarea 
                                value={section.content as string} 
                                onChange={e => handleSectionContentChange(e.target.value, index)} 
                                className={textareaClass} 
                            />
                        )}
                        {section.type === 'title' && (
                            <input type="text" value={section.content as string} onChange={e => handleSectionContentChange(e.target.value, index)} className={inputClass} />
                        )}
                        {section.type === 'image' && (
                            <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], index)} className={fileInputClass} />
                        )}
                        {section.type === 'paragraphWithImage' && (
                            <>
                                {/* Textarea for text */}
                                <textarea 
                                    value={(section.content as SectionContent).text || ''} 
                                    onChange={e => handleSectionContentChange({ text: e.target.value }, index)} 
                                    className={textareaClass} 
                                />
                                {/* File input for image */}
                                <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], index)} className={fileInputClass} />
                                {/* Layout selector */}
                                <select onChange={e => handleLayoutChange(e.target.value as 'left' | 'right', index)} className={inputClass}>
                                <option value="left">Image on Left</option>
                                <option value="right">Image on Right</option>
                                </select>
                            </>
                        )}
                    </div>
                ))}

                <div>
                    <button onClick={() => handleAddSection('paragraph')} className={buttonClass}>Add Paragraph</button>
                    <button onClick={() => handleAddSection('image')} className={buttonClass}>Add Image</button>
                    <button onClick={() => handleAddSection('paragraphWithImage')} className={buttonClass}>Add Paragraph with Image</button>
                    <button onClick={() => handleAddSection('title')} className={buttonClass}>Add Title</button>
                </div>
                <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-20">
                    Submit Post
                </button>
                <button onClick={handlePreview} className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-20">
                    Preview
                </button>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Logout
                </button>
            </div>
        );
    };

    // CODE FOR ADD BLOG ENDS HERE
    // Below is code written for managing blog post content
    //
    //

    // Handle star/unstar logic
    const handleStarPost = async (blogId) => {
        let newStarredPosts = [...starredPosts];
        const isCurrentlyStarred = newStarredPosts.includes(blogId);

        if (isCurrentlyStarred) {
            // Remove the post if it's already starred
            newStarredPosts = newStarredPosts.filter(id => id !== blogId);
        } else {
            // Add the post if there are less than 3 starred
            if (newStarredPosts.length < 3) {
                newStarredPosts.push(blogId);
            } else {
                alert('You can only star up to 3 posts.');
                return;
            }
        }

        //Updating the real time database
        const db = getDatabase();
        const starredRef = databaseRef(db, 'starredPosts');
        set(starredRef, newStarredPosts)
            .then(() => {
                console.log('Starred posts updated successfully');
                setStarredPosts(newStarredPosts); // update the local variable
            })
            .catch(error => console.error('Error updating starred posts:', error));
    };

    const handleDeletePost = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            // Fetch the post
            const db = getFirestore();
            const postRef = doc(db, `posts/${blogId}`);
            const postDoc = await getDoc(postRef);

            if (postDoc.exists()) {
                const postData = postDoc.data();
                const sections = postData.sections || [];
                const storage = getStorage();

                // Filter sections to find the ones with images
                const imageSections = sections.filter(section => section.type === 'image' || section.type === 'paragraphWithImage');

                // Take all the imageURLS and delete them from storage
                for (const section of imageSections) {
                    if ((section.type === 'image' || section.type === 'paragraphWithImage') && section.content.imageUrl) {
                        const imageUrl = section.content.imageUrl;
                        try {
                            // Decode the URL and extract the path
                            const decodedUrl = decodeURIComponent(imageUrl);
                            const imagePath = decodedUrl.split('/o/')[1].split('?')[0].replace('images%2F', 'images/');
            
                            const imageRef = ref(storage, imagePath);
                            await deleteObject(imageRef);
                            console.log("Image deleted successfully");
                        } catch (error) {
                            console.error("Error deleting the image: ", error.message);
                        }
                    }
                }

                await deleteDoc(postRef);
                console.log("Post and associated images have been deleted");

                setPosts(prevPosts => prevPosts.filter(post => post.blogId !== blogId));
            } else {
                console.error("Post document does not exists.")
            }
        } catch (error) {
            console.error("Error deleting post and images: ", error);
        }
    };

  
    
    // Render posts
    const renderPosts = () => {
        return posts.map((post) => (
        <div key={post.blogId} className="flex justify-between items-center">
            <div>{post.title}</div>
            <div>
                {/* Edit Button : TO BE IMPLEMENTED */}
                <button className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">Edit</button>
                
                {/* Star/Unstar Button */}
                <button 
                    onClick={() => handleStarPost(post.blogId)}
                    className={`px-4 py-2 rounded transition duration-300 ease-in-out ml-2 ${
                        starredPosts.includes(post.blogId)
                        ? 'bg-yellow-300 text-black' // Style for starred
                        : 'bg-transparent border border-gray-300 text-gray-400 hover:bg-gray-100' // Style for not starred
                    }`}
                >
                    {starredPosts.includes(post.blogId) ? 'Unstar' : 'Star'}
                </button>

                {/* Delete Button */}
                <button 
                    onClick={() => handleDeletePost(post.blogId)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                    Delete
                </button>

            </div>
        </div>
        ));
    };

    // Content rendering for the manage blog tab
    const renderManageBlogsContent = () => {
        // Content for managing blogs: Stars, delete, edit
        return (
            <div>
                {renderPosts()}
            </div>
        );
    };




    // Code for switching between tabs 
    const renderTabContent = () => {
        switch (activeTab) {
            case 'manageBlogs':
                return renderManageBlogsContent();
            case 'addBlog':
                return renderAddBlogContent();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            {/* Tab Buttons */}
            <div className="flex justify-center mb-4 border-b border-gray-300">
                <button
                    className={`px-4 py-2 text-sm font-medium leading-5 text-center transition duration-150 ease-in-out ${
                        activeTab === 'manageBlogs'
                            ? 'border-b-2 border-blue-500 text-blue-600 focus:outline-none'
                            : 'text-gray-600 hover:text-gray-700 hover:border-gray-300 focus:outline-none'
                    }`}
                    onClick={() => setActiveTab('manageBlogs')}
                >
                    Manage Blogs
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium leading-5 text-center transition duration-150 ease-in-out ${
                        activeTab === 'addBlog'
                            ? 'border-b-2 border-blue-500 text-blue-600 focus:outline-none'
                            : 'text-gray-600 hover:text-gray-700 hover:border-gray-300 focus:outline-none'
                    }`}
                    onClick={() => setActiveTab('addBlog')}
                >
                    Add Blog
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>

    );
};

export default AdminPage;
