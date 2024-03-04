import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Font,
  } from "@react-email/components";
  import * as React from "react";

  
  interface InfoEmailProps {
    firstName: string,
    lastName: string,
    company: string,
    other: string,
    email: string,
    inquiry: string[],
    
  }
  
  export const InfoEmail = ({firstName, lastName, company, inquiry, other, email}: InfoEmailProps) => (
    <Html>
      <Head />
      <Preview>
        New message from On the Pulse "Learn More" page!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi, I'm {firstName} {lastName} from {company}</Text>
          <Text style={paragraph}>
            {inquiry.map((item,index)=>(
              <div key={index}>{index+1}). {item}</div>
            ))
            }
            <br/>
            Other: {other}
          </Text>
          <Text style={paragraph}>
            You can reach me at {email}
            <br/>
          </Text>
          <Text style={paragraph}>
            Best,
            <br />
            {firstName} {lastName}
          </Text>
          <Hr style={hr} />
        </Container>
      </Body>
    </Html>
  );
  
  
  export default InfoEmail;
  
  const main = {
    backgroundColor: "#000000",
    fontFamily:"Magistral",
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    color: "white",
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center" as const,
  };
  
  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };