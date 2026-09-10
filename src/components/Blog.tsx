import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';
import { marked } from 'marked';
import * as ablobs from '../assets/images/blog-posts/a';
import * as bblobs from '../assets/images/blog-posts/b';
import * as cblobs from '../assets/images/blog-posts/c';

const formatArticleHtml = (text: string): string => {
    const html = marked.parseInline(text, { async: false }) as string;
    return html.replace(
        /<a href="([^"]*)"(?: title="([^"]*)")?>/g,
        (_, href, title) => {
            const titleAttribute = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttribute} target="_blank" rel="noreferrer" class="article-link">`;
        }
    );
};

const getBlobPool = (templateType) => {
    switch (templateType) {
        case 'A':
            return [ablobs.blob1a, ablobs.blob2a, ablobs.blob3a];
        case 'B':
            return [bblobs.blob1b, bblobs.blob2b, bblobs.blob3b];
        case 'C':
            return [cblobs.blob1c, cblobs.blob2c, cblobs.blob3c];
        default:
            return [ablobs.blob1a, ablobs.blob2a, ablobs.blob3a];
    }
};

const ScatteredBlob = ({ src, side, top, widthDesktopRem }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start(getRandomAnimation());
    }, [controls]);

    return (
        <motion.img 
            src={src}
            style={{
                position: 'absolute',
                top: top,
                [side === 'left' ? 'left' : 'right']: side === 'left' ? '-10rem' : '-10rem',
                width: `${widthDesktopRem}rem`,
                zIndex: -10,
            }}
            className="blob max-w-none select-none pointer-events-auto"
            animate={controls}
            onHoverStart={() => onHoverStart(controls)}
            onHoverEnd={() => onHoverEnd(controls)}
            draggable="false"
        />
    );
};

const Blog = ({post}) => {
    const renderSection = (section, index) => {
        const processText = (text) => {
            let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            processedText = processedText.replace(/##(.*?)##/g, '<span style="color: red;">$1</span>');
            return processedText;
        };

        switch (section.type) {
            case 'paragraph':
            case 'title':
                // Process text to replace custom syntax, then parse and render the Markdown content safely
                const processedContent = processText(section.content);
                const contentHTML = formatArticleHtml(processedContent);
                const Component = section.type === 'paragraph' ? 'p' : 'h1';
                return (
                    <Component key={index} className="my-4 font-gentona md:text-2xl text-xl" dangerouslySetInnerHTML={{ __html: contentHTML }} />
                );
            case 'image':
                return (
                    <img key={index} src={section.content} alt={`Section ${index}`} className="my-4 w-full h-auto" />
                );
            case 'paragraphWithImage':
                // Process text part of the content as Markdown
                const processedParagraphContent = processText(section.content.text);
                const paragraphWithImageContentHTML = formatArticleHtml(processedParagraphContent);
                return (
                    <div key={index} className={`flex ${section.content.layout === 'left' ? 'lg:flex-row flex-col' : 'lg:flex-row-reverse flex-col-reverse'} justify-around items-center md:gap-8 my-4`}>
                        <div className="flex-1 my-4 font-gentona md:text-2xl text-xl" dangerouslySetInnerHTML={{ __html: paragraphWithImageContentHTML }} />
                        <div className="flex-1 justify-center items-center md:max-w-lg">
                        <div className="flex-1 justify-center">
                        <img className="" src={section.content.imageUrl} alt={`Section ${index}`} />
                        </div>
                        </div>
                    </div>
                );
            case 'poll':
                return (
                    <> <p className="my-4 font-gentona md:text-2xl text-xl"> <span className="font-semibold"> Please take this related poll here: </span> <a className="text-blue-300 hover:text-blue-300 visited:text-blue-300 active:text-blue-300" href={section.content}> {section.content} </a> </p> </>
                )

            default:
                return null;
        }
    };

    if (!post || !post.sections) {
        // Handle the loading or non-existence state
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl md:text-2xl font-semibold">Loading...</p>
            </div>
        );
    }

    const blobPool = getBlobPool(post.templateType);
    const numSections = post.sections.length;
    const totalBlobs = Math.max(8, numSections * 2 + 4);

    return (
        <div className="min-h-screen blog-post flex justify-center p-6 relative">
            <div className='hidden xl:block absolute overflow-hidden inset-0 blob-container top-[-1rem] z-10 pointer-events-none'>
                {Array.from({ length: totalBlobs }).map((_, i) => {
                    const side = i % 2 === 0 ? 'left' : 'right';
                    const offset = (i * 5) % 7;
                    const top = `${3 + i * 18 + offset}rem`;
                    const widthDesktopRem = 20 + ((i * 3) % 7);
                    const src = blobPool[i % blobPool.length];

                    return (
                        <ScatteredBlob 
                            key={i}
                            src={src}
                            side={side}
                            top={top}
                            widthDesktopRem={widthDesktopRem}
                        />
                    );
                })}
            </div>
            <div className="w-full md:w-3/4 z-30">
                <div className="flex flex-col justify-center text-center p-10 md:mb-[3rem]"> 
                    <h1 className="md:text-7xl w-full text-4xl font-bold font-magistral my-4 uppercase">{post.title}</h1>
                    {post.author ? (<div className='flex flex-row justify-center'>
                        <h3 className="md:text-2xl mr-2 w-auto text-2xl font-bold font-magistral my-4 uppercase">Author:</h3>
                        <h3 className="md:text-2xl w-auto text-2xl font-bold font-magistral my-4">{post.author}</h3>
                    </div>):
                    null}
                    <p className="font-normal font-magistral md:text-5xl text-xl my-2">{post.shortDescription}</p>
                </div>
                <div className="post-content">
                    {post.sections.map((section, index) => renderSection(section, index))}
                </div>
            </div>
        </div>
    )
}

export default Blog;
