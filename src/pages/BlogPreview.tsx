import { useEffect, useState } from 'react';
import Blog from '../components/Blog';

const BlogPreview = () => {
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Retrieve the post data from localStorage
        const storedPost = localStorage.getItem('previewPost');
        if (storedPost) {
            setPost(JSON.parse(storedPost));

            // Clear local storage after moving pages.
            localStorage.removeItem('previewPost');
        }
    }, [post]);
    
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

export default BlogPreview;