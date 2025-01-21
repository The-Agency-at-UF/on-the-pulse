import React from 'react';

import { TfiEmail } from "react-icons/tfi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


export const AddressSection: React.FC = () => (
    <div className="flex flex-col justify-center text-xl">
        <p>University of Florida</p>
        <p>1000 Weimer Hall</p>
        <p>Gainesville, FL 32611</p>
    </div>
);

export const PhoneSection: React.FC = () => (
    <div className="flex flex-col justify-center text-xl">
        <p>(352) 294-3848</p>
        <p className='underline underline-offset-1'>theagency@jou.ufl.edu</p>
    </div>
);

export const EmailSection: React.FC = () => (
    <div className="flex flex-col">
        <div className="flex flex-row items-center justify-center "> 
        <TfiEmail className="ml-2 mr-2" size="2em"/>  
        <FaInstagram className="ml-2 mr-2" size="2em" />
        <FaXTwitter className="ml-2 mr-2" size="2em" />
        <FaLinkedin className="ml-2 mr-2" size="2em" />
        </div>
        <div className='mt-4'>
        <div className="h-full w-[26em] text-center rounded-3xl bg-gradient-to-r from-[#FFB23E] via-[#FF4D56] to-[#AB9BFF] p-1">
            <div className="h-full w-full bg-white rounded-3xl">
                <button className="text-black font-bold text-4xl p-6 font-gentona"> <a className="text-black hover:text-black visited:text-black font-bold text-4xl p-6 font-gentona" href="https://theagency.jou.ufl.edu/seo"> UF CLIENTS </a> </button>
            </div> 
        </div>
        </div>
    </div>
);
 