import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { blob1, blob2, blob3, blob4, logo } from '../../assets/images';

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
      <div className="absolute z-10 w-2/3 sm:w-3/4 md:w-3/5 lg:w-1/2">
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
          className="absolute top-12 left-[10rem] w-1/4 sm:left-20 sm:w-[12rem] 
                    md:left-[6rem] md:w-[12rem] lg:w-[14rem]"
          animate={blob1Animation}
      />
      <motion.img 
          src={blob2}
          alt="Blob 2"
          className="absolute bottom-0 left-0 lg:-ml-26 w-1/3 sm:w-[24rem] sm:-ml-24
                     md:-ml-28 md:w-[28rem] lg:w-[30rem]"
          animate={blob2Animation}
      />
      <motion.img 
          src={blob3}
          alt="Blob 3"
          className="absolute bottom-[4rem] right-[6rem] w-1/5 sm:right-0 sm:w-1/3 
                      md:right-0 md:w-[16rem] lg:right-[5rem] lg:w-[18rem]"
          animate={blob3Animation}
      />
      <motion.img 
          src={blob4}
          alt="Blob 4"
          className="absolute top-0 right-0 -mr-32 w-1/4 sm:right-0 sm:bottom-0 sm:w-1/3 
                      md:right-10 md:w-[16rem] lg:right-5 lg:w-1/5"
          animate={blob4Animation}
      />
    </div>
  )
}

export default LandingPage
