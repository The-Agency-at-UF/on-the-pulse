import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blob1, blob2, blob3, blob4, logo } from '../assets/images/landing-page';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';
import {useLocation} from 'react-router-dom'

//Firebase imports
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';


function LandingPage() {
  // states for blog rendering
  const location = useLocation();
  const [starredPosts, setStarredPosts] = useState([]);

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

  // useEffect for fetching starred posts
  useEffect(() => {
    const db = getDatabase();
    const starredRef = databaseRef(db, 'starredPosts');

    onValue(starredRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStarredPosts(Object.values(data));
      } else {
        setStarredPosts([]);
      }
    })
  }, []);
  
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

  useEffect(() => {
    // Check if the URL contains a fragment identifier
    if (location.pathname === '/about-us') {
      // Scroll to the About Us section
      const aboutUsSection = document.getElementById('about-us');
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname]);
  

  return (
    <div>
      <div className="relative h-screen flex justify-center items-center">
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
            draggable="false"
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
            draggable="false"
        />
        <motion.img 
            src={blob3}
            alt="Blob 3"
            className="absolute bottom-[14rem] right-[1rem] w-2/5 
                      sm:right-[0rem] sm:w-[16rem] sm:bottom-[12rem] 
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
            draggable="false"
        />
        {/* Logo in the center */}
        <div className="absolute scale-75">
        <motion.img 
          src={logo}
          alt="Landing Page Logo"
          initial={{ y: -50, opacity: 0 }}
          animate={logoAnimation}
          whileHover={logoHoverAnimation}
          onHoverEnd={handleLogoHoverEnd}
          className="max-w-full h-auto"
          draggable="false"
        />
        </div>
      </div>
      
      {/* Render starred posts */}
      <div className="starred-posts mt-50 flex flex-col">
        {starredPosts.map(blogId => (
          <Link key={blogId} to={`/blog/${blogId}`} className="starred-post-link">
            Go to Post: {blogId}
          </Link>
        ))}
      </div>
      <div id="about-us" className="flex text-center justify-center">
        <div className="w-3/4 font-magistral font-bold">
        <p className="text-lg md:text-4xl">  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus commodo viverra maecenas accumsan lacus vel. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
