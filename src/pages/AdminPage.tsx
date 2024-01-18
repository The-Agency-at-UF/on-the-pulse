// AdminPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import SignIn from '../components/SignIn/SignIn';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    const userContext = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Blog States
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [templateType, setTemplateType] = useState('A');
    const [sections, setSections] = useState<Section[]>([]);
    const [blogId, setBlogId] = useState('');

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
        const newSection: Section = {
            type,
            content: type === 'paragraph' ? '' : { text: '', imageUrl: '', layout: 'left' } // default layout for 'paragraphWithImage'
        };
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
        const storageRef = ref(storage, 'images/' + file.name);
    
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
            <textarea placeholder="Short Description" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className={textareaClass} />
            <select value={templateType} onChange={e => setTemplateType(e.target.value)} className={inputClass}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>
            <input type="text" placeholder="Blog ID" value={blogId} onChange={e => setBlogId(e.target.value)} className={inputClass} />

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
            </div>
            <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-20">Submit Post</button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                Logout
            </button>
        </div>
    );
};

export default AdminPage;
