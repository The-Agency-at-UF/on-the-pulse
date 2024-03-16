import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit, startAt, getCountFromServer, startAfter} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";
import { useLocation, Link} from 'react-router-dom';

const Gallery = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const [blogs, setBlogs] = useState([]);
    const postsPerPage = 5;
    const [pages, setPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');

                const sizeCount = await getCountFromServer(blogsCollection);
                const index = (page-1) * postsPerPage; 
                setPages(Math.ceil(sizeCount.data().count/postsPerPage));
                const sortByDate = query(blogsCollection, orderBy("index", "desc"), limit(postsPerPage), startAt((sizeCount.data().count-1)-index));
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

    const generatedPaginationLinks = () => {
        const paginationLinks = [];
        const window = 2; 
        let startPage = Math.max(1, page-1);
        let endPage = Math.min(page+window, pages);
        console.log(pages);

        if(startPage >= 1){
            if(startPage > 2){
                paginationLinks.push(<p className="font-gentona"> ... </p>);
            }
            for(let i = startPage; i <= endPage; i++){
                if(i != 1){
                paginationLinks.push(<Link className="text-xl font-gentona" to={`/gallery?page=${i}`}> {i} </Link>);
                }
            }
        }
        if(endPage < pages){
            paginationLinks.push(<p className="font-gentona"> ... </p>);
        }
        console.log(paginationLinks);
        return paginationLinks;

    }
    

    return (
        <div className="">
            <h3 className="flex justify-center text-5xl">Previous Articles</h3>
            <div className="mt-12 grid text-center grid-cols-none lg:text-center lg:grid lg:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <BlogPost post={blog}/>
                ))}
            </div>
            <div className="flex flex-row"> 
                <Link className="font-gentona text-xl" to="/gallery?page=1"> 1 </Link>
                {generatedPaginationLinks()}
                

            </div> 
        </div>
    );
};

export default Gallery;

