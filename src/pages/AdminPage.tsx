// AdminPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import SignIn from '../components/SignIn/SignIn';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
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

    // TO DO: Implement Admin Functionality
    useEffect(() => {
        if (userContext?.currentUser) {
            const db = getFirestore();
            const userRef = doc(db, "users", userContext.currentUser.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists() && docSnap.data().role === 'admin') {
                    setIsAdmin(true);
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
    /*
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
    */


    // Blog Submission Functions
    const handleAddSection = (type: string) => {
        const newSection: Section = { type, content: type === 'paragraph' ? '' : { text: '', imageUrl: '' } };
        setSections([...sections, newSection]);
    };
    
    const handleSectionContentChange = (content: any, index: number) => {
        const updatedSections = sections.map((section, idx) => 
            idx === index ? { ...section, content } : section
        );
        setSections(updatedSections);
    };
    
    const handleFileUpload = async (file: File, index: number) => {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const updatedSections = sections.map((section, idx) => {
                if (idx === index && section.type === 'image') {
                    return { ...section, content: downloadURL };
                } else if (idx === index && section.type === 'paragraphWithImage') {
                    return { ...section, content: { ...section.content, imageUrl: downloadURL } };
                }
                return section;
            });

            setSections(updatedSections);
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };
    
    const handleSubmit = async () => {
        const db = getFirestore();
        try {
            await addDoc(collection(db, 'posts'), {
                blogId,
                title,
                shortDescription,
                templateType,
                sections,
            });
            // Reset form or show success message
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // Code for deleting sections
    const handleDeleteSection = (index: number) => {
        setSections(sections.filter((_, idx) => idx !== index));
    };
    
    const handleLayoutChange = (layout: 'left' | 'right', index: number) => {
        const updatedSections = sections.map((section, idx) =>
            idx === index ? { ...section, content: { ...section.content as SectionContent, layout } } : section
        );
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
                    <textarea value={section.content as string} onChange={e => handleSectionContentChange(e.target.value, index)} className={textareaClass} />
                )}
                {section.type === 'image' && (
                    <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], index)} className={fileInputClass} />
                )}
                {section.type === 'paragraphWithImage' && (
                    <>
                        {/* Textarea for text */}
                        <textarea value={(section.content as SectionContent).text || ''} onChange={e => handleSectionContentChange({ ...section.content, text: e.target.value }, index)} className={textareaClass} />
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
            <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit Post</button>
        </div>
    );
};

export default AdminPage;
