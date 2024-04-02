import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import Blog from '../components/Blog';


// Template component to render the blog posts as needed.
// TO DO: Add blobs for each page type. Make it responsive.
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
                setPostExists(true);
            } else {
                setPostExists(false);
            }
        };

        fetchPost();
    }, [blogId]);

    if (!postExists) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl md:text-2xl font-semibold">Sorry, this blog does not exist.</p>
            </div>
        );
    }
    
    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl md:text-2xl font-semibold">Loading...</p>
            </div>
        );
    }
    
    return (
        <Blog post={post}/>
    );
};

export default BlogPost;
