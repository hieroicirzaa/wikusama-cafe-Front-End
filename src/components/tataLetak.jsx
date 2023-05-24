import React from "react";
import NavbarAdmin from "./Navbar/NavbarAdmin";
import NavbarKasir from "./Navbar/NavbarKasir";
import NavbarManajer from "./Navbar/NavbarManajer";

export default function TataLetak() {
  const userRole = JSON.parse(localStorage.getItem("users"));
  const roles = ["admin", "kasir", "manajer"];
  const navbarComponents = [
    <NavbarAdmin />,
    <NavbarKasir />,
    <NavbarManajer />
  ];

  const selectedNavbar = navbarComponents[roles.indexOf(userRole.toLowerCase())];

  return (
    <div>
      {selectedNavbar}
    </div>
  );
}
