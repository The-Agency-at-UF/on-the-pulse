import React from 'react'

function LearnMore() {
  return (
    <>
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

          </form>
        </div>
      </div>
    </>
  )
}

export default LearnMore
