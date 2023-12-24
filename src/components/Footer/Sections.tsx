import React from 'react';
import { FaLocationArrow, FaPhone, FaEnvelope } from 'react-icons/fa'; // Importing FontAwesome icons
import { SlLocationPin } from "react-icons/sl";
import { PiPhone } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";

const Section: React.FC<{ icon: JSX.Element, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="section">
        {icon}
        <h3>{title}</h3>
        {children}
    </div>
);

export const AddressSection: React.FC = () => (
    <Section icon={<SlLocationPin className="section-icon"/>} title="Address">
        <p>University of Florida</p>
        <p>1000 Weimer Hall</p>
        <p>Gainesville, FL 32611</p>
    </Section>
);

export const PhoneSection: React.FC = () => (
    <Section icon={<PiPhone className="section-icon"/>} title="Phone">
        <p>(352) 294-3848</p>
    </Section>
);

export const EmailSection: React.FC = () => (
    <Section icon={<TfiEmail className="section-icon"/>} title="Email">
        <p>theagency@jou.ufl.edu</p>
    </Section>
);
