import React from 'react';
import './Footer.css';
import { AddressSection, PhoneSection, EmailSection } from './Sections';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <AddressSection />
      <PhoneSection />
      <EmailSection />
    </div>
  );
};

export default Footer;
