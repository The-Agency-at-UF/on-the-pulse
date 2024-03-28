import React, {useState, useEffect} from 'react';
import { getFirestore, collection, getDocs, query, orderBy, where, limit, getCountFromServer, startAfter, doc, getDoc} from 'firebase/firestore';
import BlogPost from "../components/BlogPost.tsx";
import { useLocation, Link} from 'react-router-dom';

const Gallery = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const [blogs, setBlogs] = useState([]);
    const postsPerPage = 2;
    const [pages, setPages] = useState(0);
    const [checked, setChecked] = useState([false, false, false, false]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const blogsCollection = collection(db, 'posts');
                if(categories.length == 0){
                    const sizeCount = await getCountFromServer(blogsCollection);
                    setPages(Math.ceil(sizeCount.data().count/postsPerPage));
                }
                else{
                    const categoryCountRef = doc(db, 'article_counts', 'counts');
                    const snapDoc = await getDoc(categoryCountRef);
                    let count = 0;
                    if(snapDoc.exists()){
                        for(let i = 0; i < categories.length; i++){
                            const articleCount = snapDoc.data()[categories[i]];
                            count += articleCount;
                        }
                    }
                    console.log(count);
                    setPages(Math.ceil(pages/postsPerPage));
                    
                }
                
                let sortByDate = null;
                if(page == 1){
                    if(categories.length == 0){
                        sortByDate = query(blogsCollection, orderBy("creation", "desc"), limit(postsPerPage));
                    }
                    else{
                        sortByDate = query(blogsCollection, where("category", "in", categories), orderBy("creation", "desc"), limit(postsPerPage));
                    }
                }
                else{
                    const getCompleteCollection = query(blogsCollection, orderBy("creation", "desc"), limit(postsPerPage * (page-1)));
                    const startingSnapshot = await getDocs(getCompleteCollection);
                    if(categories.length == 0){
                        sortByDate = query(blogsCollection, orderBy("creation", "desc"), limit(postsPerPage),startAfter(startingSnapshot.docs[startingSnapshot.docs.length-1]));
                    }
                    else{
                        sortByDate = query(blogsCollection, where("category", "in", categories), orderBy("creation", "desc"), limit(postsPerPage),startAfter(startingSnapshot.docs[startingSnapshot.docs.length-1]));
                    }
                    
                }
                if(sortByDate){
                    const snapshot = await getDocs(sortByDate);
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
    }, [page, categories]);

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

    useEffect(()=>{
        console.log(categories);
    }, [categories]);

    const generatedPaginationLinks = () => {
        const paginationLinks = [];
        const window = 2; 
        let startPage = Math.max(1, page-1);
        let endPage = Math.min(page+window, pages);
        console.log(pages);

        if(startPage >= 2){
            paginationLinks.push(<Link className="text-xl mr-3 font-gentona" to={`/gallery?page=1`}> 1 </Link>);
            if(startPage != 2){
                paginationLinks.push(<p className="font-gentona text-xl mr-3"> ... </p>);
            }
        }
        for(let i = startPage; i <= endPage; i++){
            if(page != i){
                paginationLinks.push(<Link className="text-xl mr-3 font-gentona" to={`/gallery?page=${i}`}> {i} </Link>);
            }
            else{
                paginationLinks.push(<Link style={{color: 'black'}} className="text-xl bg-white mr-3 pl-[9px] pr-[9px] flex justify-center rounded-full font-gentona" to={`/gallery?page=${i}`}> {i} </Link>);
            }  
        }
    
        if(endPage < pages){
            paginationLinks.push(<p className="text-xl font-gentona mr-3"> ... </p>);
        }
        console.log(paginationLinks);
        return paginationLinks;

    }
    

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
            <div className="flex flex-row justify-end mr-5 mb-5"> 
                {generatedPaginationLinks()}
            </div> 
        </div>
    );
};

export default Gallery;

