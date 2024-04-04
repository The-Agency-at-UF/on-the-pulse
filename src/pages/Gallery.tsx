import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy, where, limit, getCountFromServer, startAfter, doc, getDoc} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";
import { useLocation, Link} from 'react-router-dom';

const Gallery = () => {
    
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const postsPerPage = 6;
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
        <>
            <h3 className="flex justify-center text-5xl">Previous Articles</h3>
            <div className="flex md:flex-row flex-col justify-center md:m-5 mt-3">
            <label className="font-gentona font-medium md:text-xl md:mr-3 mb-3 md:mb-0 text-center">
            <input className="mr-3 scale-150" type = "checkbox" checked={checked[0]} onChange={()=> handleCheckboxChange(0, "AI & Technology")}/>
                AI & Technology
            </label>
            <label className="font-gentona font-medium md:text-xl md:mr-3 mb-3 md:mb-0 text-center">
            <input className="mr-3 scale-150" type = "checkbox" checked={checked[1]} onChange={()=> handleCheckboxChange(1, "Gen Z")}/>
                Gen Z
            </label>
            <label className="font-gentona font-medium md:text-xl md:mr-3 mb-3 md:mb-0 text-center">
            <input className="mr-3 scale-150" type = "checkbox" checked={checked[2]} onChange={()=> handleCheckboxChange(2, "Current Events")}/>
                Current Events
            </label>
            <label className="font-gentona font-medium md:text-xl md:mr-3 mb-3 md:mb-0 text-center">
            <input className="mr-3 scale-150" type = "checkbox" checked={checked[3]} onChange={()=> handleCheckboxChange(3, "Industry")}/>
                Industry
            </label>
            </div>
            <div className="mt-12 grid text-center grid-cols-none lg:text-center lg:grid lg:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <BlogPost post={blog}/>
                ))}
            </div>
            <div className="flex justify-center md:mt-4 md:mb-7 mb-[5rem]">
            <button className="bg-violet-500 font-medium rounded-md p-5 lg:text-2xl text-xl font-gentona" onClick={fetchMoreBlogs}> Load More Articles </button>
            </div>
        </>
    );
};

export default Gallery;

