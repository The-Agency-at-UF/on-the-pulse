import React from 'react';

/* Font Awesome Icons */
import LocationIcon from '../../assets/fontawesome-icons/location-dot-solid.svg';
import PhoneIcon from '../../assets/fontawesome-icons/phone-solid.svg';
import EmailIcon from '../../assets/fontawesome-icons/envelope-regular.svg';

const Section: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="section">
        <img src={icon} alt={title} className="section-icon" />
        <h3>{title}</h3>
        {children}
    </div>
);

export const AddressSection: React.FC = () => (
    <Section icon={LocationIcon} title="Address">
        <p>University of Florida</p>
        <p>1000 Weimer Hall</p>
        <p>Gainesville, FL 32611</p>
    </Section>
);
  
export const PhoneSection: React.FC = () => (
    <Section icon={PhoneIcon} title="Phone">
        <p>(352) 294-3848</p>
    </Section>
);

export const EmailSection: React.FC = () => (
    <Section icon={EmailIcon} title="Email">
        <p>theagency@jou.ufl.edu</p>
    </Section>
);