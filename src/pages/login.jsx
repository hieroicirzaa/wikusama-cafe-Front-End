import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import loginImg from '../assets/login.jpeg';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(baseURL + "/auth/authentication", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data) {
        // alert(response.data.message)
        localStorage.setItem("logged", response.data.logged);
        localStorage.setItem("namauser",JSON.stringify(response.data.data.nama_user));
        localStorage.setItem("id_user",JSON.stringify(response.data.data.id));
        localStorage.setItem("users", JSON.stringify(response.data.data.role));
        localStorage.setItem("token", response.data.token);
        
        if (response.data.data.role === "admin") {
          navigate("/DashboardAdmin");
        } else if (response.data.data.role === "kasir") {
          navigate("/DashboardKasir");
        } else if (response.data.data.role === "manajer") {
          navigate("/DashboardManajer");
        }else {
          alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
        }
      } else {
        console.log("LOGIN GAGAL");
        alert("Login Gagal");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover' src={loginImg} alt='' />
      </div>

      <div className='bg-gray-800 flex flex-col justify-center'>
        <form
          onSubmit={handleSubmit}
          className='max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8'
        >
          <h2 className='text-4xl dark:text-white font-bold text-center'>
            SIGN IN
          </h2>
          <div className='flex flex-col text-gray-400 py-2'>
            <label htmlFor='username'>Username</label>
            <input
              className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='text'
              name='username'
              id='username'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col text-gray-400 py-2'>
            <label htmlFor='password'>Password</label>
            <input
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='password'
              name='password'
              id='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-between text-gray-400 py-2'>
            <p className='flex items-center'>
              <input className='mr-2' type='checkbox' /> Remember Me
            </p>
            <p>Forgot Password</p>
          </div>
          <button
            className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'
            type='submit'
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
