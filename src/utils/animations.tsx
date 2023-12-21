import { useAnimation } from 'framer-motion';

// randomize blob animations
export function getRandomAnimation() {
    const randomX = [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0];
    const randomY = [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0];
    const randomScale = [1, 1 + Math.random() * 0.15, 1 - Math.random() * 0.15, 1];
    const randomRotate = [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0];

    const duration = 12 + Math.random() * 8;
    const delay = Math.random() * 3;

    return {
        x: randomX,
        y: randomY,
        scale: randomScale,
        rotate: randomRotate,
        transition: {
        x: { repeat: Infinity, repeatType: "reverse", duration, delay },
        y: { repeat: Infinity, repeatType: "reverse", duration, delay },
        scale: { repeat: Infinity, repeatType: "reverse", duration, delay },
        rotate: { repeat: Infinity, repeatType: "reverse", duration, delay },
        ease: "easeInOut"
        }
    };
}  

export function onHoverStart(controls) {
    controls.start({
        scale: [1.05, 1.1, 1.05, 1.15, 1.05, 1.1, 1.05], // keyframes for pulsing effect
        transition: {
        duration: 0.7,
        ease: "easeInOut",
        loop: Infinity, // loop the animation indefinitely
        }
    });
}

export function onHoverEnd(controls) {
    controls.start({ 
        scale: 1,
        transition: { duration: 0.3, ease: "easeInOut" } 
    });
}