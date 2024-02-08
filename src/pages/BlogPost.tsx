import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { marked } from 'marked';
import * as ablobs from '../assets/images/blog-posts/a';
import * as bblobs from '../assets/images/blog-posts/b';
import * as cblobs from '../assets/images/blog-posts/c';


// Template component to render the blog posts as needed.
// TO DO: Add blobs for each page type. Make it responsive.
const BlogPost = () => {
    const { blogId } = useParams();
    const [post, setPost] = useState(null);
    const [postExists, setPostExists] = useState(true);

    const [blob1, setBlob1] = useState(ablobs.blob1a);
    const [blob2, setBlob2] = useState(ablobs.blob2a);
    const [blob3, setBlob3] = useState(ablobs.blob3a);
    const [blob1Style, setBlob1Style] = useState(ablobs.blob1aStyle);
    const [blob2Style, setBlob2Style] = useState(ablobs.blob2aStyle);
    const [blob3Style, setBlob3Style] = useState(ablobs.blob3aStyle);
    


    // define animation for the blobs
    const blob1Controls = useAnimation();
    const blob2Controls = useAnimation();
    const blob3Controls = useAnimation();

    // initialize random animations on component mount
    useEffect(() => {
        blob1Controls.start(getRandomAnimation());
        blob2Controls.start(getRandomAnimation());
        blob3Controls.start(getRandomAnimation());
    }, [blob1Controls, blob2Controls, blob3Controls]);

    // Configure the marked renderer if you have custom markdown syntax
    const renderer = new marked.Renderer();
    renderer.paragraph = (text) => {
        // Example: Customize how paragraphs are rendered
        // You can also handle custom syntax here if needed
        return `<p class="my-4 font-gentona md:text-2xl text-xl">${text}</p>`;
    };

    // Set options
    marked.setOptions({
        renderer: renderer,
        // Add other options as needed
    });
    

    useEffect(() => {
        const fetchPost = async () => {
            const db = getFirestore();
            const docRef = doc(db, `posts/${blogId}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPost(docSnap.data());
                switch(post.templateType){
                    case 'A':
                        setBlob1(ablobs.blob1a);
                        setBlob2(ablobs.blob2a);
                        setBlob3(ablobs.blob3a);
                        setBlob1Style(ablobs.blob1aStyle);
                        setBlob2Style(ablobs.blob2aStyle);
                        setBlob3Style(ablobs.blob3aStyle);
                        break;
                    case 'B':
                        setBlob1(bblobs.blob1b);
                        setBlob2(bblobs.blob2b);
                        setBlob3(bblobs.blob3b);
                        setBlob1Style(bblobs.blob1bStyle);
                        setBlob2Style(bblobs.blob2bStyle);
                        setBlob3Style(bblobs.blob3bStyle);
                        break;
                    case 'C':
                        setBlob1(cblobs.blob1c);
                        setBlob2(cblobs.blob2c);
                        setBlob3(cblobs.blob3c);
                        setBlob1Style(cblobs.blob1cStyle);
                        setBlob2Style(cblobs.blob2cStyle);
                        setBlob3Style(cblobs.blob3cStyle);
                        break;
                    default:
                        break;
        
                }
            } else {
                setPostExists(false);
            }
            
        };

        fetchPost();
    }, [blogId, post]);

    if (!postExists) {
        return <div className="h-screen">Sorry, this blog does not exist.</div>;
    }

    if (!post) {
        return <div className="h-screen">Loading...</div>;
    }



    
    

    

    

    const renderSection = (section, index) => {
        const processText = (text) => {
            // Replace custom markers with Markdown or HTML syntax
            let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold with Markdown
            processedText = processedText.replace(/##(.*?)##/g, '<span style="color: red;">$1</span>'); // Red text with HTML
            return processedText;
        };
        

        switch (section.type) {
            case 'paragraph':
            case 'title':
                // Process text to replace custom syntax, then parse and render the Markdown content safely
                const processedContent = processText(section.content);
                const contentHTML = marked(processedContent);
                const Component = section.type === 'paragraph' ? 'p' : 'h1';
                return (
                    <Component key={index} className="my-4 text-lg" dangerouslySetInnerHTML={{ __html: contentHTML }} />
                );
            case 'image':
                return (
                    <img key={index} src={section.content} alt={`Section ${index}`} className="my-4 w-full h-auto" />
                );
            case 'paragraphWithImage':
                // Process text part of the content as Markdown
                const processedParagraphContent = processText(section.content.text);
                const paragraphWithImageContentHTML = marked(processedParagraphContent);
                return (
                    <div key={index} className={`flex ${section.content.layout === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center gap-2 my-4`}>
                        <div className="flex-1 text-lg w-2/4" dangerouslySetInnerHTML={{ __html: paragraphWithImageContentHTML }} />
                        <div className="flex justify-center items-center w-2/4">
                        <div className="flex justify-center w-2/4">
                        <img className="" src={section.content.imageUrl} alt={`Section ${index}`} />
                        </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    

    return (
        <div className="blog-post flex justify-center p-6 relative">
            <div className='absolute overflow-hidden inset-0 blob-container top-[-1rem]'>
            {/* Blob Elements */}
            <motion.img 
            src={blob1}
            alt="Blob Top Left"
            className={blob1Style}
            animate={blob1Controls}
            onHoverStart={() => onHoverStart(blob1Controls)}
            onHoverEnd={() => onHoverEnd(blob1Controls)}
            draggable="false"
            />
            <motion.img 
            src={blob2}
            alt="Blob Top Right"
            className={blob2Style}
            animate={blob2Controls}
            onHoverStart={() => onHoverStart(blob2Controls)}
            onHoverEnd={() => onHoverEnd(blob2Controls)}
            draggable="false"
            />
            <motion.img 
            src={blob3}
            alt="Blob Lower Right"
            className={blob3Style}
            animate={blob3Controls}
            onHoverStart={() => onHoverStart(blob3Controls)}
            onHoverEnd={() => onHoverEnd(blob3Controls)}
            draggable="false"
            />
            </div>
            <div className="md:w-3/4">
            <div className="flex flex-col justify-center text-center p-10 mb-[3rem]"> 
            <h1 className="md:text-7xl text-6xl font-bold font-magistral my-4 uppercase">{post.title}</h1>
            <p className="font-normal font-magistral md:text-5xl text-3xl my-2">{post.shortDescription}</p>
            </div>
            <div className="post-content">
                {post.sections.map((section, index) => renderSection(section, index))}
            </div>
            </div>
        </div>
    );
};

export default BlogPost;
