import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import blob1 from '../../assets/images/blob1.png';
import blob2 from '../../assets/images/blob2.png';
import blob3 from '../../assets/images/blob3.png';
import blob4 from '../../assets/images/blob4.png';
import logo from '../../assets/images/landing-page-logo.png';

function LandingPage() {

  function getRandomAnimation() {
    // random values for x, y, scale, and rotate
    const randomX = [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0];
    const randomY = [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0];
    const randomScale = [1, 1 + Math.random() * 0.1, 1 - Math.random() * 0.1, 1];
    const randomRotate = [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0];
  
    // random duration and delay
    const duration = 10 + Math.random() * 10;
    const delay = Math.random() * 5;
  
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
        ease: "linear"
      }
    };
  }
  
  // define animation for the blobs
  const blob1Animation = getRandomAnimation();
  const blob2Animation = getRandomAnimation();
  const blob3Animation = getRandomAnimation();
  const blob4Animation = getRandomAnimation();


  // logo animation
  const logoAnimation = useAnimation();

  const startPulseAnimation = () => {
    logoAnimation.start({
      scale: [1, 1.035, 1],
      transition: {
        scale: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    });
  };

  // useEffect to start the animation initially
  useEffect(() => {
    logoAnimation.start({
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    })
    .then(startPulseAnimation);
  }, [logoAnimation]);

  // hover animation
  const logoHoverAnimation = {
    scale: 1.1, // slightly larger on hover
    rotateY: [0, 10, -10, 10, 0], // rocking motion degrees
    transition: {
      scale: { duration: 0.3, ease: "easeInOut" },
      rotateY: {
        duration: 0.6, // duration of one complete rock back and forth
        ease: "easeInOut",
        yoyo: Infinity // repeat the animation indefinitely
      }
    }
  };  

  return (
    <div className="relative h-screen flex justify-center items-center">
      {/* Logo in the center */}
      <div className="absolute z-10 w-2/3 sm:w-1/2 md:w-3/5 lg:w-1/2">
        <motion.img 
          src={logo}
          alt="Landing Page Logo"
          initial={{ y: -50, opacity: 0 }}
          animate={logoAnimation}
          whileHover={logoHoverAnimation}
          onHoverEnd={startPulseAnimation} // Restart pulse animation after hover
          className="max-w-full h-auto"
        />
      </div>


      {/* Blobs in corners */}
      <motion.img 
          src={blob1}
          alt="Blob 1"
          className="absolute top-12 left-20 w-1/4 sm:w-1/3 md:w-1/3 lg:w-[24rem]"
          animate={blob1Animation}
      />
      <motion.img 
          src={blob2}
          alt="Blob 2"
          className="absolute bottom-0 left-0 -ml-4 sm:w-1/2 md:-ml-8 lg:-ml-24 w-1/4 md:w-1/2 lg:w-1/3"
          animate={blob2Animation}
      />
      <motion.img 
          src={blob3}
          alt="Blob 3"
          className="absolute bottom-[12rem] right-[6rem] w-1/4 sm:w-2/5 md:w-1/3 lg:w-[24rem]"
          animate={blob3Animation}
      />
      <motion.img 
          src={blob4}
          alt="Blob 4"
          className="absolute top-0 right-0 -mr-32 w-1/4 sm:w-1/3 md:w-1/3 lg:w-1/5"
          animate={blob4Animation}
      />
    </div>
  )
}

export default LandingPage
