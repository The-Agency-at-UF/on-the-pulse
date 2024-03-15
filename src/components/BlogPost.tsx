import {Link} from 'react-router-dom';


const BlogPost = ({post}) => {
    return(
    <div className="flex justify-center h-96"> 
    <Link to={`/blog/${post.id}`}>
        <img className="h-2/3 object-cover" src={post.thumbnailId}/>
        <div> 
        <h1 className="h-1/6 font-bold text-2xl"> {post.title} </h1>
        <p className="h-1/6"> {post.shortDescription} </p>
        </div>
    </Link>
    </div> 
    );
}

export default BlogPost;