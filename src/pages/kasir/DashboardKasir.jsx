import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

let namauserlogin = localStorage.getItem("namauser");

function DashboardKasir() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login atau belum 
    if (localStorage.getItem("users") !== `"kasir"`) {
      navigate("/"); 
    } 
    if (!localStorage.getItem("logged")) {
      navigate("/");
    } else {
      // setUser(`Selamat datang sebagai ${localStorage.getItem("user")} ${localStorage.getItem("namauser")}`);
      let role = localStorage.getItem("users");
      let namauser = localStorage.getItem("namauser");
      setUser(`Selamat datang sebagai ${role} ${namauser}`);
    }
  }, [navigate]);
  
  return (
    <>
      <div className="">
        <div className="container px-6 py-8 mx-auto ">
          <h1 className="text-2xl font-semibold text-center capitalize lg:text-3xl text-[#0B2447]">
            Selamat Datang, Kasir Terbaik!
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-center xl:mt-6 text-[#0B2447]">
            Hai {namauserlogin}, hari ini adalah kesempatan untuk bersinar. Jadilah kasir yang baik hati, ramah, dan selalu tersenyum.
          </p>

        </div>
      </div>
    </>
  );
}

export default DashboardKasir;