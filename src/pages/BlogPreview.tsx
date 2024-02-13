import { useEffect, useState } from 'react';
import { marked } from 'marked';

const BlogPreview = () => {
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Retrieve the post data from localStorage
        const storedPost = localStorage.getItem('previewPost');
        if (storedPost) {
            setPost(JSON.parse(storedPost));

            // Clear local storage after moving pages.
            localStorage.removeItem('previewPost');
        }
    }, []);

    // Configure the marked renderer if you have custom markdown syntax
    const renderer = new marked.Renderer();
    renderer.paragraph = (text) => {
        // Example: Customize how paragraphs are rendered
        // You can also handle custom syntax here if needed
        return `<p class="my-4 text-lg">${text}</p>`;
    };

    // Set options
    marked.setOptions({
        renderer: renderer,
        // Add other options as needed
    });

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
                    <div key={index} className={`flex ${section.content.layout === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center gap-4 my-4`}>
                        <div className="flex-1 text-lg" dangerouslySetInnerHTML={{ __html: paragraphWithImageContentHTML }} />
                        <img className="flex-1 w-1/2 h-auto" src={section.content.imageUrl} alt={`Section ${index}`} />
                    </div>
                );
            default:
                return null;
        }
    };

    if (!post) {
        return <div>Loading Preview...</div>;
    }

    return (
        <div className="blog-post p-6">
            <h1 className="text-3xl font-bold my-4">{post.title}</h1>
            <p className="text-md my-2">{post.shortDescription}</p>
            <div className="post-content">
                {post.sections.map((section, index) => renderSection(section, index))}
            </div>
        </div>
    );
};

export default BlogPreview;