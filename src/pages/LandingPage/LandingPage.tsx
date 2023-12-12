import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import blob1 from '../../../public/images/blob1.png';
import blob2 from '../../../public/images/blob2.png';
import blob3 from '../../../public/images/blob3.png';
import blob4 from '../../../public/images/blob4.png';
import logo from '../../../public/images/landing-page-logo.png';
import './LandingPage.css';

function LandingPage() {
  const logoAnimation = useAnimation();

  // define animation for the blobs
  const blobAnimation = {
    x: [0, 10, -10, 10, 0],
    y: [0, 10, -10, 10, 0],
    scale: [1, 1.05, 0.95, 1.05, 1],
    rotate: [0, 10, -10, 10, 0],
    transition: {
      x: { repeat: Infinity, repeatType: "reverse", duration: 12 },
      y: { repeat: Infinity, repeatType: "reverse", duration: 14 },
      scale: { repeat: Infinity, repeatType: "reverse", duration: 16 },
      rotate: { repeat: Infinity, repeatType: "reverse", duration: 18 },
      ease: "linear"
    }
  }; // todo: make this animation more interesting

  // logo animation
  useEffect(() => {
    // first float in the logo
    logoAnimation.start({
      y: 0,
      opacity: 1,
      transition: { duration: 2, ease: "easeOut" },
    })
    .then(() => {
      // after float in, start the pulse
      logoAnimation.start({
        scale: [1, 1.03, 1],
        transition: {
          scale: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }
      });
    });
  }, [logoAnimation]);

  return (
    <div className="relative h-screen flex justify-center items-center">
      {/* Logo in the center */}
      <div className="absolute z-10">
      <motion.img 
          src={logo}
          alt="Landing Page Logo"
          initial={{ y: -100, opacity: 0 }}
          animate={logoAnimation}
      />
      </div>

      {/* Blobs in corners */}
      <motion.img 
          src={blob1}
          alt="Blob 1"
          className="absolute top-12 left-20"
          animate={blobAnimation}
      />
      <motion.img 
          src={blob2}
          alt="Blob 2"
          className="absolute bottom-0 left-0"
          animate={blobAnimation}
      />
      <motion.img 
          src={blob3}
          alt="Blob 3"
          className="absolute bottom-0 right-0"
          animate={blobAnimation}
      />
      <motion.img 
          src={blob4}
          alt="Blob 4"
          className="absolute top-0 right-0"
          animate={blobAnimation}
      />
    </div>
  )
}

export default LandingPage
