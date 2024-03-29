import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy, where, limit, getCountFromServer, startAfter, doc, getDoc} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";
import { useLocation, Link} from 'react-router-dom';

const Gallery = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [blogs, setBlogs] = useState([]);
    const postsPerPage = 4;
    const [checked, setChecked] = useState([false, false, false, false]);
    const [categories, setCategories] = useState([]);
    const [lastDocument, setLastDocument] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');
                
                let sortByDate = null;
                if(categories.length == 0){
                    sortByDate = query(blogsCollection, orderBy("creation", "desc"), limit(postsPerPage));
                }
                else{
                    sortByDate = query(blogsCollection, where("category", "in", categories), orderBy("creation", "desc"), limit(postsPerPage));
                }


                if(sortByDate){
                    const snapshot = await getDocs(sortByDate);
                    setLastDocument(snapshot.docs[snapshot.docs.length-1]);
                    const blogNames = snapshot.docs.map(doc => {
                        const id = doc.id;
                        const data = {id, ...doc.data()};
                        return data;
                    });

                    setBlogs(blogNames);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchData();
    }, [categories]);



    const handleCheckboxChange = (index, category) => {
        const newCheckedItems = [...checked];
        newCheckedItems[index] = !newCheckedItems[index];
        setChecked(newCheckedItems);
        console.log(newCheckedItems[index]);
        if (newCheckedItems[index] === true){
            setCategories(prevCategories => [...prevCategories, category]);
        }
        else {
            setCategories(prevCategories => prevCategories.filter(item=> item !== category));
        }
    }

    const fetchMoreBlogs = async () => {
        const db = getFirestore();
        const blogsCollection = collection(db, 'posts');
        let additionalArticles = null;
        if(categories.length == 0){
            additionalArticles= query(blogsCollection, orderBy("creation", "desc"), limit(postsPerPage),startAfter(lastDocument));
        }
        else{
            additionalArticles = query(blogsCollection, where("category", "in", categories), orderBy("creation", "desc"), limit(postsPerPage),startAfter(lastDocument));
        }

        const additionalArticlesSnapshot = await getDocs(additionalArticles);
        setLastDocument(additionalArticlesSnapshot.docs[additionalArticlesSnapshot.docs.length-1]);
        const newArticles = additionalArticlesSnapshot.docs.map(doc => doc.data());
        setBlogs(prevBlogs=> [...prevBlogs, ...newArticles]);
    };

    useEffect(()=>{
        console.log(categories);
        console.log(blogs);
    }, [blogs, categories]);
    
    useEffect(() => {
        const handleScroll = () => {
           if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            console.log("called");
            fetchMoreBlogs();
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, [fetchMoreBlogs]);

    return (
        <div className="">
            <h3 className="flex justify-center text-5xl">Previous Articles</h3>
            <label>
            <input type = "checkbox" checked={checked[0]} onChange={()=> handleCheckboxChange(0, "AI & Technology")}/>
                AI & Technology
            </label>
            <label>
            <input type = "checkbox" checked={checked[1]} onChange={()=> handleCheckboxChange(1, "Gen Z")}/>
                Gen Z
            </label>
            <label>
            <input type = "checkbox" checked={checked[2]} onChange={()=> handleCheckboxChange(2, "Current Events")}/>
                Current Events
            </label>
            <label>
            <input type = "checkbox" checked={checked[3]} onChange={()=> handleCheckboxChange(3, "Industry")}/>
                Industry
            </label>
            <div className="mt-12 grid text-center grid-cols-none lg:text-center lg:grid lg:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <BlogPost post={blog}/>
                ))}
            </div>
            <button onClick={fetchMoreBlogs}> Load More Articles </button>
        </div>
    );
};

export default Gallery;

