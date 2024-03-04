import { Resend } from 'resend';
import InfoEmail from '../../components/Email/InfoEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(){
    const response = await fetch('http:localhost:5172/api/email');

    const formData = await response.json();
    console.log("This is working fine.")
    console.log(formData);
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'lucastembras@ufl.edu',
        // to: 'theagency@jou.ufl.edu',
        subject: 'On the Pulse',
        react: InfoEmail(formData)
    });
}