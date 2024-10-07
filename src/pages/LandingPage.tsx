import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { blob1, blob2, blob3, blob4, logo, LandingTextSVG, favblog1, favblog2, favblog3 } from '../assets/images/landing-page';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';
import {useLocation, useNavigate} from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

//Firebase imports
import { getFirestore, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

function LandingPage() {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  // states for blog rendering
  const location = useLocation();
  const [starredPosts, setStarredPosts] = useState([]);
  const sliderRef = useRef(null);

  // define animation for the blobs
  const blob1Controls = useAnimation();
  const blob2Controls = useAnimation();
  const blob3Controls = useAnimation();
  const blob4Controls = useAnimation();

  // images for carousel that will be randomly selected
  const carouselImages = [favblog1, favblog2, favblog3];
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  // initialize random animations on component mount
  useEffect(() => {
    blob1Controls.start(getRandomAnimation());
    blob2Controls.start(getRandomAnimation());
    blob3Controls.start(getRandomAnimation());
    blob4Controls.start(getRandomAnimation());
  }, [blob1Controls, blob2Controls, blob3Controls, blob4Controls]);

  // useEffect for fetching starred posts
  useEffect(() => {
    const db = getFirestore();
    const test = query(collection(db, 'posts'), orderBy('creation', "desc"), limit(7));
    var starredTemp = [];

    getDocs(test)
      .then((querySnapshot) => {
        let imageCounter = 0;
        querySnapshot.forEach((doc) => {
          // doc.data() is the document data
          starredTemp.push({
            id:doc.id, 
            title: doc.data().title, 
            shortDescription: doc.data().shortDescription,
            imageSrc: carouselImages[imageCounter % carouselImages.length]
          })
          imageCounter++;
        });
        setStarredPosts(starredTemp)
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      });
  }, []); // empty dependency to run once at launch

  // logo animation
  const logoAnimation = useAnimation();
  
  // Array of carousel blobs to animate
  const carouselBlobAnimation = Array(7).fill(null).map(() => useAnimation());


  // carousel settings
  const settings = {
    dots: true, // Show dot indicators
    infinite: true, // Enable infinite looping
    speed: 500, // Transition speed
    slidesToShow: 3, // Show three items
    slidesToScroll: 1, // Scroll three items at a time
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024, // Adjust settings for smaller screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
    beforeChange: () => setIsDragging(true), // Set isDragging to true when dragging starts
    afterChange: () => setIsDragging(false), // Reset isDragging back to false when dragging stops
  };

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
    carouselBlobAnimation.forEach(animation => {
      animation.start(getRandomAnimation());
    });
  }, [logoAnimation, carouselBlobAnimation]);

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

  const handleClick = (url) => {
    if (!isDragging) {
      navigate(url); // Navigate only if not dragging
    }
  };

  const onHoverStart = (index) => {
    setHoveredIndex(index);
    console.log("Hover");
  };

  const onHoverEnd = (index) => {
    setHoveredIndex(null);
    console.log("Hover end");
  };

  useEffect(()=> {
    console.log(hoveredIndex);
  }, [hoveredIndex])

  const handlePrevClick = () => {
    sliderRef.current.slickPrev(); // Go to the previous slide
  };

  const handleNextClick = () => {
    sliderRef.current.slickNext(); // Go to the next slide
  };


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
      <div id="about-us" className="flex text-center justify-center p-8">
        <div className="w-3/4 font-magistral font-bold">
        <p className="text-2xl md:text-5xl lg:text-7xl"> As thought leaders of modern-day media, Generation Z at The Agency sparks innovation and cutting-edge insights across the industry. </p>
        </div>
      </div>

      {/* Render starred posts */}
      {/*
      <div className="starred-posts-container md:grid md:grid-cols-3 md:gap-4 lg:gap-6 p-4">
        {starredPosts.map((blog, index) => (
          <div key={blog.id} className="starred-post mb-4 md:mb-0" >
            <Link to={`/blog/${blog.id}`} className="block relative rounded overflow-hidden shadow-lg h-96 w-full m-auto">
              <img src={index == 0 ? favblog1 : index == 1 ? favblog2 : favblog3} alt="Post background" className="absolute inset-0 w-full h-full object-contain" />
              <div className="flex h-full  flex-col justify-center gap-4 items-center relative p-4 bg-opacity-20 bg-black hover:bg-opacity-50 transition-all duration-300">
                <h3 className="text-white text-4xl font-black text-center">{blog.title}</h3>
                <p className="text-white text-2xl text-center max-w-72">{blog.shortDescription}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      */}

        <div className='relative overflow-hidden'>
          <button onClick={handlePrevClick} className='absolute left-0 top-0 h-full flex items-center bg-white opacity-20 bg-opacity-0 z-30 hover:bg-opacity-5 hover:opacity-100'>
            <h1 className='font-bold text-4xl size-16'>{'<'}</h1>
          </button>          
        <Slider {...settings} ref={sliderRef}>
            {starredPosts.map((blog, index) => (
              <div onMouseEnter={()=> onHoverStart(index)} onMouseLeave={()=> onHoverEnd(index)} onClick={() => handleClick(`/blog/${blog.id}`)} key={index} className="starred-post mb-4 md:mb-0">
                <div className="block relative rounded shadow-lg h-105 w-full m-auto">
                  {/* Image */}
                  <motion.img
                    src={blog.imageSrc}
                    alt="Carousel Blob"
                    className="inset-0 w-full h-full " // Changed from object-contain to object-cover for full coverage
                    animate={carouselBlobAnimation[index]}
                    onHoverStart={() => onHoverStart(carouselBlobAnimation[index])}
                    onHoverEnd={() => onHoverEnd(carouselBlobAnimation[index])}
                    draggable="true"
                  />
                  {/* Overlay Content */}
                  <div className={`absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-10 text-white`}>
                    <h3 className="text-4xl font-bold text-center"> {hoveredIndex === index ? "Read Full Article" : ""} </h3> 
                    <h3 className="text-4xl font-bold text-center"> {hoveredIndex === index ? "" : blog.title}</h3>
                    <p className="text-2xl text-center">{hoveredIndex === index ? "" : blog.shortDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider> 
          <button onClick={handleNextClick} className='absolute right-0 top-0 h-full flex items-center bg-white opacity-20 bg-opacity-0 z-30 hover:bg-opacity-5 hover:opacity-100'>
            <h1 className='font-bold text-4xl size-16'>{'>'}</h1>
          </button>     
        </div>

      <div className="text-center my-20">
        <h2 className="text-4xl font-semibold mb-4">Interested in more?</h2>
        <div className="w-24 h-0.5 bg-purple-800 mx-auto mb-6"></div>
        <Link to="/library">
        <button 
          className="px-6 py-3 text-white rounded-lg bg-purple-800 hover:bg-purple-900 transition duration-300"
        >
            More Blogs 
        </button>
        </Link>
    </div>


    </div>
  )
}

export default LandingPage
