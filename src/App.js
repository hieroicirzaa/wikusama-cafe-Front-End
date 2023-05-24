import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/login";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Menu from "./pages/admin/Menu";
import User from "./pages/admin/User";
import Meja from "./pages/admin/Meja";
import DashboardKasir from "./pages/kasir/DashboardKasir";
import Transaksi from "./pages/kasir/Transaksi";
import TambahTransaksi from "./pages/kasir/TambahTransaksi";
import DashboardManajer from "./pages/manajer/DashboardManajer";
import TransaksiManajer from "./pages/manajer/Transaksi";
import Laporan from "./pages/manajer/Laporan";

import "./App.css";
import TataLetak from "./components/tataLetak";

export default function App() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className="App bg-[#e4fffb] h-full min-h-screen text-[Poppins]">
      {location.pathname !== "/" && location.pathname !== "*" && <TataLetak />}

       {/* route utama */}
       <Routes>
        <Route path="/" element={ <Login/>} />
      </Routes> 
      {/* route admin */} 
      <Routes path="/admin" element={<DashboardAdmin/>}>
        <Route path="DashboardAdmin" element={<DashboardAdmin/>}/>
        <Route path="Menu" element={<Menu/>}/>
        <Route path="User" element={<User/>}/>
        <Route path="Meja" element={<Meja/>}/>
      </Routes>
      {/* route kasir */}
      <Routes path="  /kasir" element={<DashboardKasir/>}>
      <Route path="DashboardKasir" element={<DashboardKasir/>}/>
        <Route path="Transaksi" element={<Transaksi/>}/>
        <Route path="TambahTransaksi" element={<TambahTransaksi/>}/>
      </Routes>
      {/* route manajer */}
      <Routes path="  /manajer" element={<DashboardManajer/>}>
      <Route path="DashboardManajer" element={<DashboardManajer/>}/>
      <Route path="TransaksiManajer" element={<TransaksiManajer/>}/>
      <Route path="Laporan" element={<Laporan/>}/>
      </Routes>
    </div>
  );
}
