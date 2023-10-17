import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserPage() {
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    const getTokenFromLocalStorage = () => {
      const token = localStorage.getItem('loggedInUser'); // Recupera il token da localStorage

      if (token) {
        return token;
      } else {
        // Gestisci il caso in cui il token non sia presente in localStorage
        console.error('Il token non è presente in localStorage.');
        return null;
      }
    };

    const getUserData = async () => {
      const token = getTokenFromLocalStorage();

      if (!token) {
        return; 
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_URL_ENDPOINT}/users/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Errore nella richiesta:', response.status);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  return (
    <>
      <div>UserPage</div>
      <Link to="/">Vai alla Home</Link>
      {/* Qui puoi utilizzare i dati dell'utente da userData */}
    </>
  );
}
