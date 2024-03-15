import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";

const Gallery = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');
                const sortByDate = query(blogsCollection, orderBy("creation", "desc"));
                const snapshot = await getDocs(sortByDate);
                

                const blogNames = snapshot.docs.map(doc => {
                    const id = doc.id;
                    const data = {id, ...doc.data()};
                    return data;
                });
                setBlogs(blogNames);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="blog-gallery">
            <h3 className="flex justify-center text-5xl">Previous Articles</h3>
            <div className="flex flex-col md:text-center md:grid md:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <BlogPost post={blog}/>
                ))}
            </div>
        </div>
    );
};

export default Gallery;

