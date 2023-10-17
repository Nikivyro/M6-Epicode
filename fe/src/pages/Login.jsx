import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginData, setLoginData] = useState({});
  const [login, setLogin] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_URL_ENDPOINT}/login`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('loggedInUser', JSON.stringify(data.token));
        navigate('/me');
      }

      setLogin(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>Login</div>
      <form
        onSubmit={loginSubmit}
        className="flex flex-col gap-2 p-3 bg-slate-900 text-white rounded min-w-[400px]">
        <h1>Login</h1>
        <input
          className="p-2 bg-zinc-100 text-black rounded"
          type="text"
          name="email"
          required
          onChange={handleInputChange}
        />
        <input
          className="p-2 bg-zinc-100 text-black rounded"
          type="password"
          name="password"
          required
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-green-600 p-2 rounded mt-5">
          Login
        </button>
      </form>
    </>
  );
}
