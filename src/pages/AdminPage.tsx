// AdminPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../contexts/UserContext';
import SignIn from '../components/SignIn/SignIn';
import { getAuth, signOut } from 'firebase/auth';

const AdminPage: React.FC = () => {
    const userContext = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // TO DO: Implement Admin Functionality
    useEffect(() => {
        if (userContext?.currentUser) {
            const db = getFirestore();
            const userRef = doc(db, "users", userContext.currentUser.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists() && docSnap.data().role === 'admin') {
                    setIsAdmin(true);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [userContext?.currentUser]);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          // Update context or state as needed
          if (userContext?.setCurrentUser) {
            userContext.setCurrentUser(null);
          }
        }).catch((error) => {
          // An error happened.
          console.error('Logout Error:', error);
        });
      };

    if (!userContext?.currentUser) {
        return <div className="h-screen flex items-center justify-center"><SignIn /></div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    // TO DO: Implement Admin Functionality
    /*
    if (!isAdmin) {
        return (
            <div className="h-screen flex flex-col items-center justify-center mt-10">
                <p>You need an admin account to access this page.</p>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Logout
                </button>
            </div>
        );
    }
    */

    // Admin page content goes here...
    return (
        <div className="h-screen w-full">
            {/* Your form and admin content */}

            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                Logout
            </button>
        </div>
    );
};

export default AdminPage;
