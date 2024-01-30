import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { marked } from 'marked';
import { blob1a, blob2a, blob3a } from '../assets/images/blog-posts/a';
import { blob1b, blob2b, blob3b } from '../assets/images/blog-posts/b';

// Template component to render the blog posts as needed.
// TO DO: Add blobs for each page type. Make it responsive.
const BlogPost = () => {
    const { blogId } = useParams();
    const [post, setPost] = useState(null);
    const [postExists, setPostExists] = useState(true);

    const [blob1, setBlob1] = useState(blob1a);
    const [blob2, setBlob2] = useState(blob2a);
    const [blob3, setBlob3] = useState(blob3a);


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
                            setBlob1(blob1a);
                            setBlob2(blob2a);
                            setBlob3(blob3a);
                            break;
                        case 'B':
                            setBlob1(blob1b);
                            setBlob2(blob2b);
                            setBlob3(blob3b);
                            break;
                    }
            } else {
                setPostExists(false);
            }
        };

        fetchPost();
    }, [blogId]);

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
        <div className="blog-post flex justify-center p-6">
            <div className='blob-container'>
            {/* Blob Elements */}
            <motion.img 
            src={blob1}
            alt="Blob Top Left"
            className="blob absolute top-[6rem] left-[-9rem] w-1/2
            md:top-[8rem] md:left-[-6rem] md:w-[20rem] z-[-10]"
            animate={blob1Controls}
            onHoverStart={() => onHoverStart(blob1Controls)}
            onHoverEnd={() => onHoverEnd(blob1Controls)}
            draggable="false"
            />
            <motion.img 
            src={blob2}
            alt="Blob Top Right"
            className="absolute top-[6rem] right-[-10em] w-1/2 z-[-10]
            md:top-[4rem] md:right-[-7rem] md:w-[21rem]"
            animate={blob2Controls}
            onHoverStart={() => onHoverStart(blob2Controls)}
            onHoverEnd={() => onHoverEnd(blob2Controls)}
            draggable="false"
            />
            <motion.img 
            src={blob3}
            alt="Blob Lower Right"
            className="absolute top-[24em] right-[-9rem] w-1/2
            md:right-[-13rem] md:w-[26rem] sm:left-[rem]"
            animate={blob3Controls}
            onHoverStart={() => onHoverStart(blob3Controls)}
            onHoverEnd={() => onHoverEnd(blob3Controls)}
            draggable="false"
            />
            </div>
            <div className="md:w-3/4 w-4/5">
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
