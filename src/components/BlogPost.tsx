import {Link} from 'react-router-dom';

const BlogPost = ({post}) => {
    return(
    <div> 
    <Link to={`/blog/${post.id}`}>
        <h1 className="font-bold text-2xl"> {post.title} </h1>
        <p> {post.shortDescription} </p>
    </Link>
    </div> 
    );
}

export default BlogPost;