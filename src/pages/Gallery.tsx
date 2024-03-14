import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy} from 'firebase/firestore';

const Gallery = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');
                const sortByDate = query(blogsCollection, orderBy("creation", "desc"));
                const snapshot = await getDocs(sortByDate);
                

                const blogNames = snapshot.docs.map(doc => doc.data());
                setBlogs(blogNames);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="blog-gallery">
            <h3>Existing Blogs</h3>
            <div className="gallery">
                {blogs.map((blog, index) => (
                    <div key={index}>
                        <p>{blog.title}</p>
                        <p>{blog.shortDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;

