import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

interface Blog {
    id: string;
    title: string;
    shortDescription: string,
}

const OtherBlogsPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    // Fetch posts from firestore
    useEffect(() => {
        const fetchPosts = async () => {
            const db = getFirestore();
            const postsRef = collection(db, 'posts');
            const querySnapshot = await getDocs(postsRef);
            const blogsArray: Blog[] = [];
            querySnapshot.forEach((doc) => {
                blogsArray.push({
                    id: doc.id,
                    title: doc.data().title,
                    shortDescription: doc.data().shortDescription,
                });
            });
            setBlogs(blogsArray);
        }

        fetchPosts();
    }, [])

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen">
            <div className="text-center">
                <h2 className="text-4xl font-bold  mb-4">Other Blogs</h2>
                <div className="mx-auto h-1 w-24 bg-blue-500 rounded-full mb-8"></div>
            </div>

            {blogs.map(blog => (
                <div key={blog.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                <div>
                    <h3 className="font-bold">{blog.title}</h3>
                    <p>{blog.shortDescription}</p>
                </div>
                <Link to={`/blog/${blog.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Visit
                </Link>
                </div>
            ))}
        </div>
    );
};

export default OtherBlogsPage;