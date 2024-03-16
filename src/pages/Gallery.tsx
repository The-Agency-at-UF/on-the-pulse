import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit, startAt, getCountFromServer} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";
import { useLocation } from 'react-router-dom';

const Gallery = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const [blogs, setBlogs] = useState([]);
    const postsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');

                const sizeCount = await getCountFromServer(blogsCollection);
                const index = (page-1) * postsPerPage; 
                const sortByDate = query(blogsCollection, orderBy("index", "desc"), limit(postsPerPage), startAt(sizeCount.data().count-index));
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
    }, [page]);

    return (
        <div className="">
            <h3 className="flex justify-center text-5xl">Previous Articles</h3>
            <div className="mt-12 grid text-center grid-cols-none lg:text-center lg:grid lg:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <BlogPost post={blog}/>
                ))}
            </div>
        </div>
    );
};

export default Gallery;

