import {Link} from 'react-router-dom';

const randomPercentage = () => Math.floor(Math.random() * (100 - 30 +1)) + 100;

const randomBorderRadius = () => {
    const values = [];
    for(let i = 0; i < 4; i++){
        values.push(`${randomPercentage()}%`)
    }
    values.push("/");
    for(let j = 0; j < 4; j++){
        values.push(`${randomPercentage()}%`)
    }
    return values.join(' ');
}
const BlogPost = ({post}) => {
    const brvalues = randomBorderRadius();
    console.log(brvalues);
    return(
    <div className="flex justify-center h-96"> 
    <Link to={`/blog/${post.id}`}>
        <img style={{ borderRadius: brvalues }} className="h-2/3 object-cover" src={post.thumbnailId}/>
        <div className=""> 
        <h1 className="font-magistral h-1/6 font-bold text-2xl"> {post.title} </h1>
        <p className="font-magistral h-1/6"> {post.shortDescription} </p>
        </div>
    </Link>
    </div> 
    );
}

export default BlogPost;