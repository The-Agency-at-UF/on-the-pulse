import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { blobBottomLeft, blobBottomRight, blobTopLeft, blobTopRight } from '../assets/images/learn-more';
import submitBlob from '../assets/images/submit-blob.png';
import { getRandomAnimation, onHoverEnd, onHoverStart } from '../utils/animations';

function LearnMore() {

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
    <div className="">
        {/* Blob Elements */}
        <motion.img 
          src={blobTopLeft}
          alt="Blob Top Left"
          className="absolute top-0 left-0"
          animate={topLeftControls}
          onHoverStart={() => onHoverStart(topLeftControls)}
          onHoverEnd={() => onHoverEnd(topLeftControls)}
          draggable="false"
        />
        <motion.img 
          src={blobTopRight}
          alt="Blob Top Right"
          className="absolute top-0 right-0"
          animate={topRightControls}
          onHoverStart={() => onHoverStart(topRightControls)}
          onHoverEnd={() => onHoverEnd(topRightControls)}
          draggable="false"
        />
        <motion.img 
          src={blobBottomLeft}
          alt="Blob Bottom Left"
          className="absolute bottom-0 left-0"
          animate={bottomLeftControls}
          onHoverStart={() => onHoverStart(bottomLeftControls)}
          onHoverEnd={() => onHoverEnd(bottomLeftControls)}
          draggable="false"
        />
        <motion.img 
          src={blobBottomRight}
          alt="Blob Bottom Right"
          className="absolute bottom-0 right-0"
          animate={bottomRightControls}
          onHoverStart={() => onHoverStart(bottomRightControls)}
          onHoverEnd={() => onHoverEnd(bottomRightControls)}
          draggable="false"
        />
    </div>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
            Learn More
        </h2>
        
        <div className="w-full max-w-2xl">

          <h3 className="text-xl md:text-2xl font-semibold pb-4">Describe Your Inquiry</h3>
          
          <form action="" className="space-y-4">
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
            <input type="text" name="firstName" className="w-full p-2" />

            <h4 className="text-sm md:text-lg mt-4">Last Name</h4>
            <input type="text" name="lastName" className="w-full p-2" />

            <h4 className="text-sm md:text-lg mt-4">Company</h4>
            <input type="text" name="company" className="w-full p-2" />

            <h4 className="text-sm md:text-lg mt-4">Email Address</h4>
            <input type="text" name="email" className="w-full p-2" />

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
    </>
  )
}

export default LearnMore
