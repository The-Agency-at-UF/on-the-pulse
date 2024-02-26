import { motion, useAnimation } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { blobBottomLeft, blobBottomRight, blobTopLeft, blobTopRight } from '../assets/images/learn-more';
import submitBlob from '../assets/images/submit-blob.png';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';

function LearnMore() {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: ''
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted:', formData);
  }


  // blob animations
  const topLeftControls = useAnimation();
  const topRightControls = useAnimation();
  const bottomLeftControls = useAnimation();
  const bottomRightControls = useAnimation();

  // submitBlob animation
  const submitBlobControls = useAnimation();

  useEffect(() => {
    topLeftControls.start(getRandomAnimation());
    topRightControls.start(getRandomAnimation());
    bottomLeftControls.start(getRandomAnimation());
    bottomRightControls.start(getRandomAnimation());

    //submitBlob
    submitBlobControls.start(getRandomAnimation());
  }, [topLeftControls, topRightControls, 
    bottomLeftControls, bottomRightControls,
    submitBlobControls]);


  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className='blob-container'>
        {/* Blob Elements */}
        <motion.img 
          src={blobTopLeft}
          alt="Blob Top Left"
          className="blob absolute top-8 left-[-3rem] w-1/3
          sm:top-6 sm:left-[-6rem] sm:w-[12rem]"
          animate={topLeftControls}
          onHoverStart={() => onHoverStart(topLeftControls)}
          onHoverEnd={() => onHoverEnd(topLeftControls)}
          draggable="false"
        />
        <motion.img 
          src={blobBottomLeft}
          alt="Blob Bottom Left"
          className="absolute bottom-[-4rem] left-[-9rem] w-1/2
          sm:bottom-[-7rem] sm:left-[-8rem] sm:w-[16rem]"
          animate={bottomLeftControls}
          onHoverStart={() => onHoverStart(bottomLeftControls)}
          onHoverEnd={() => onHoverEnd(bottomLeftControls)}
          draggable="false"
        />
        <motion.img 
          src={blobTopRight}
          alt="Blob Top Right"
          className="absolute top-[6rem] right-0 w-[8rem]
          sm:top-[5rem] sm:right-0 sm:w-[10rem]"
          animate={topRightControls}
          onHoverStart={() => onHoverStart(topRightControls)}
          onHoverEnd={() => onHoverEnd(topRightControls)}
          draggable="false"
        />
        <motion.img 
          src={blobBottomRight}
          alt="Blob Bottom Right"
          className="absolute bottom-0 right-0 w-1/4
          sm:bottom-[-2rem] sm:right-0 sm:w-[12rem]"
          animate={bottomRightControls}
          onHoverStart={() => onHoverStart(bottomRightControls)}
          onHoverEnd={() => onHoverEnd(bottomRightControls)}
          draggable="false"
        />
      </div>

      {/* Content */}
      <div className="mt-6 mb-12 z-10 w-full px-4">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
            Learn More
        </h2>
        
        <div className="w-full mx-auto max-w-2xl">

          <h3 className="text-xl md:text-2xl font-semibold pb-4">Describe Your Inquiry</h3>
          
          <form action="" className="space-y-4" onSubmit={handleSubmit}>
            <label className="form-control flex items-center gap-2 text-lg md:text-xl">
              <input type="checkbox" name="checkbox" className="checkbox" />
              I'm interested in a custom workshop on an On The Pulse topic.
            </label>
            <label className="form-control flex items-center gap-2 text-lg md:text-xl">
              <input type="checkbox" name="checkbox-checked" className="checkbox" />
              I'm interested in working with The Agency.
            </label>

            <label className="form-control flex items-center gap-2 text-lg md:text-xl">
              <input type="checkbox" name="checkbox-checked" className="checkbox" />
              Other
            </label>
            <textarea name="other" className="w-full p-2 h-36" 
            placeholder="Specify your request."/>

            <h3 className="text-xl md:text-2xl font-semibold mt-6">Contact Information</h3>
            
            <h4 className="text-sm md:text-lg mt-4">First Name</h4>
            <input type="text" name="firstName" className="w-full p-2" value={formData.firstName} onChange={handleChange}/>

            <h4 className="text-sm md:text-lg mt-4">Last Name</h4>
            <input type="text" name="lastName" className="w-full p-2" value={formData.lastName} onChange={handleChange} />

            <h4 className="text-sm md:text-lg mt-4">Company</h4>
            <input type="text" name="company" className="w-full p-2" value={formData.company} onChange={handleChange}/>

            <h4 className="text-sm md:text-lg mt-4">Email Address</h4>
            <input type="text" name="email" className="w-full p-2" value={formData.email} onChange={handleChange} />
            
            <button type="submit"
            className='flex justify-center items-center w-full'>
              <motion.img 
                src={submitBlob}
                alt="Submit Blob"
                className="w-1/2 mt-6"
                animate={submitBlobControls}
                onHoverStart={() => onHoverStart(submitBlobControls)}
                onHoverEnd={() => onHoverEnd(submitBlobControls)}
                draggable="false"
              />
            </button>

          </form>
        </div>
      </div>
      </div>

    </>
  )
}

export default LearnMore
