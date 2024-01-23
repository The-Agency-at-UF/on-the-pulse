import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const SignIn: React.FC = () => {
  const handleSignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <button onClick={handleSignIn}>Sign in with Google</button>
  );
};

export default SignIn;

