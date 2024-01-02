import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Template component to render the blog posts as needed.
// TO DO: Add CSS styling to full page to match figma
const BlogPost = () => {
    const { blogId } = useParams();
    const [post, setPost] = useState(null);
    const [postExists, setPostExists] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const db = getFirestore();
            const docRef = doc(db, `posts/${blogId}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPost(docSnap.data());
            } else {
                setPostExists(false);
            }
        };

        fetchPost();
    }, [blogId]);

    if (!postExists) {
        return <div className="h-screen">Sorry, this blog does not exist.</div>;
    }

    if (!post) {
        return <div className="h-screen">Loading...</div>;
    }

    const renderSection = (section, index) => {
        switch (section.type) {
            case 'paragraph':
                return <p key={index} className="my-4 text-lg">{section.content}</p>;
            case 'image':
                return <img key={index} src={section.content} alt={`Section ${index}`} className="my-4 w-full h-auto" />;
            case 'paragraphWithImage':
                return (
                    <div key={index} className={`flex ${section.content.layout === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center gap-4 my-4`}>
                    <p className="flex-1 text-lg">{section.content.text}</p>
                    <img className="flex-1 w-1/2 h-auto" src={section.content.imageUrl} alt={`Section ${index}`} />
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="blog-post p-6">
            <h1 className="text-3xl font-bold my-4">{post.title}</h1>
            <p className="text-md my-2">{post.shortDescription}</p>
            <div className="post-content">
                {post.sections.map((section, index) => renderSection(section, index))}
            </div>
        </div>
    );
};

export default BlogPost;
