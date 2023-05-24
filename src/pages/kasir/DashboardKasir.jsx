import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardKasir() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login atau belum 
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
<div className="container mx-auto"> {/* tambahkan kelas container */}
      <h1 className="text-blue-500 my-4">Selamat datang di Wikusama Cafe</h1>
      <h2 className="text-xl font-bold">{user}</h2>
    </div>
      
</>
  );
}

export default DashboardKasir;