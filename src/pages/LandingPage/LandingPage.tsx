import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { blob1, blob2, blob3, blob4, logo } from '../../assets/images';

function LandingPage() {

  // randomize blob animations
  function getRandomAnimation() {
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
  
  // define animation for the blobs
  const blob1Controls = useAnimation();
  const blob2Controls = useAnimation();
  const blob3Controls = useAnimation();
  const blob4Controls = useAnimation();

  // initialize random animations on component mount
  useEffect(() => {
    blob1Controls.start(getRandomAnimation());
    blob2Controls.start(getRandomAnimation());
    blob3Controls.start(getRandomAnimation());
    blob4Controls.start(getRandomAnimation());
  }, [blob1Controls, blob2Controls, blob3Controls, blob4Controls]);

  const onHoverStart = (controls) => {
    controls.start({
      scale: [1.05, 1.1, 1.05, 1.15, 1.05, 1.1, 1.05], // keyframes for pulsing effect
      transition: {
        duration: 0.7,
        ease: "easeInOut",
        loop: Infinity, // loop the animation indefinitely
      }
    });
  };
  
  const onHoverEnd = (controls) => {
    controls.start({ 
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" } 
    });
  };
  

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

  // smooth handling of hover end
  const handleLogoHoverEnd = () => {
    logoAnimation.start({
      scale: 1, // Reset scale to normal
      transition: { duration: 0.3, ease: "easeInOut" }
    }).then(startPulseAnimation); // Then restart the pulse animation
  };
  

  return (
    <div className="relative h-screen flex justify-center items-center">
      {/* Logo in the center */}
      <div className="absolute z-10 scale-75 sm:w-3/4 md:w-3/5 lg:w-1/2">
      <motion.img 
        src={logo}
        alt="Landing Page Logo"
        initial={{ y: -50, opacity: 0 }}
        animate={logoAnimation}
        whileHover={logoHoverAnimation}
        onHoverEnd={handleLogoHoverEnd}
        className="max-w-full h-auto"
      />
      </div>

      {/* Blobs in corners */}
      <motion.img 
          src={blob1}
          alt="Blob 1"
          className="absolute top-[8rem] left-[1rem] w-1/3 
                    sm:left-[2rem] sm:w-[12rem] 
                    md:left-[5rem] md:w-[14rem] 
                    lg:left-[8rem] lg:w-[18rem]"
          animate={blob1Controls}
          onHoverStart={() => onHoverStart(blob1Controls)}
          onHoverEnd={() => onHoverEnd(blob1Controls)}
      />
      <motion.img 
          src={blob2}
          alt="Blob 2"
          className="absolute bottom-10 left-[-5rem] w-[24rem] 
                    sm:left-[-6rem] sm:w-[30rem]
                    md:left-[-7rem] md:w-[34rem] 
                    lg:left-[-8rem] lg:w-[38rem]"
          animate={blob2Controls}
          onHoverStart={() => onHoverStart(blob2Controls)}
          onHoverEnd={() => onHoverEnd(blob2Controls)}
      />
      <motion.img 
          src={blob3}
          alt="Blob 3"
          className="absolute bottom-[14rem] right-[1rem] w-2/5 
                    sm:right-[-11rem] sm:w-[16rem] bottom-[12rem] 
                    md:right-0 md:w-[20rem] 
                    lg:right-[9rem] lg:w-[24rem]"
          animate={blob3Controls}
          onHoverStart={() => onHoverStart(blob3Controls)}
          onHoverEnd={() => onHoverEnd(blob3Controls)}
/>
      <motion.img 
          src={blob4}
          alt="Blob 4"
          className="absolute top-4 right-0 -mr-20 w-[17rem] 
                      sm:right-0 sm:bottom-0 sm:w-[16rem] 
                      md:right-[0] md:w-[18rem] 
                      lg:right-[-1rem] lg:w-[22rem]"
          animate={blob4Controls}
          onHoverStart={() => onHoverStart(blob4Controls)}
          onHoverEnd={() => onHoverEnd(blob4Controls)}
      />
    </div>
  )
}

export default LandingPage
