import React from 'react';
import './Footer.css';
import { AddressSection, PhoneSection, EmailSection } from './Sections';

const Footer: React.FC = () => {
  return ( 
    <>
    <div className="w-full h-[0.5px] bg-white mb-[4em]"> </div>
    <div className="font-gentona flex justify-around mb-[6em]">
      <PhoneSection />
      <EmailSection />
      <AddressSection />
    </div>
    </>
  );
};

export default Footer;
