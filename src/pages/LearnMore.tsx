import React from 'react'

function LearnMore() {
  return (
    <>
      <div class="flex flex-col items-center justify-center min-h-screen">
        
        <h2>Learn More</h2>
        
        <div class="w-full max-w-2xl">

          <h3>Describe Your Inquiry</h3>
          
          <form action="" class="space-y-4">
            <label class="form-control flex items-center gap-2 text-xl">
              <input type="checkbox" name="checkbox" class="checkbox" />
              I'm interested in a cusom workshop on an On The Pulse topic.
            </label>
            <label class="form-control flex items-center gap-2 text-xl">
              <input type="checkbox" name="checkbox-checked" class="checkbox" />
              I'm interested in working with The Agency.
            </label>

            <label class="form-control flex items-center gap-2 text-xl">
              <input type="checkbox" name="checkbox-checked" class="checkbox" />
              Other
            </label>
            <textarea name="other" class="w-full p-2 h-36" 
            placeholder="Specify your request."/>

            <h3>Contact Information</h3>
            
            <h4 class="text-lg">First Name</h4>
            <input type="text" name="firstName" class="w-full p-2" />

            <h4 class="text-lg">Last Name</h4>
            <input type="text" name="lastName" class="w-full p-2" />

            <h4 class="text-lg">Company</h4>
            <input type="text" name="company" class="w-full p-2" />

            <h4 class="text-lg">Email Address</h4>
            <input type="text" name="email" class="w-full p-2" />



          </form>
        </div>
      </div>
    </>
  )
}


export default LearnMore
