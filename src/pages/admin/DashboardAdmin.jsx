import { useState, useEffect } from "react"; // usestate untuk menyimpan nilai, useeffect: menjelaskan function sebelum render/return
import axios from "axios";

// import TataLetak from "../../components/TataLetak"
import { baseURL, config } from "../../config";

function DashboardAdmin() {
  const [mejas, setMejas] = useState("");
  const [menus, setMenus] = useState("");
  const [user, setUser] = useState("");
  let [users, setUsers] = useState([]);

  useEffect(() => {
    //sesuai dengan functionnya
    getMejas();
    getMenus();
    getUsers();
    getUser();
    
  }, []);

  const getMejas = () => {
    axios
      .get(baseURL + "/meja/getAllMeja", config)
      .then((response) => {
        setMejas(response.data.data.length);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMenus = () => {
    axios
      .get(baseURL + "/menu/getAllMenu", config)
      .then((response) => {
        setMenus(response.data.data.length);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  const getUser = () => {
    axios
      .get(baseURL + "/user/getAllUser", config)
      .then((response) => {
        setUser(response.data.data.length);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getUsers = () => {
    axios
      .get(baseURL + "/user", config)
      .then((response) => {
        setUsers(response.data.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="">
        <div className="container px-6 py-8 mx-auto bg ">          
          
            <h1 className="text-2xl font-semibold text-center  capitalize lg:text-3xl text-[#0B2447]">
            Saat ini anda login Sebagai Admin
          </h1>
          {/* ))} */}

          <p className="max-w-2xl mx-auto mt-4 text-center  xl:mt-6 text-[#0B2447]">
            Selamat Bekerja Admin jangan lelah ya, kalo lelah itu ngejar dia tapi ga dapet
            Admin kamu hanya bisa CRUD di semua asset, kalo ngerubahin dia biar suka jangan deh 
          </p>

          <div className="grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">

            {/* menu */}
          <div className="w-full p-8 space-y-8 text-center bg-[#FD841F] rounded-lg">
              <p className="font-medium text-gray-200 uppercase">Menu</p>

              <h2 className="text-5xl font-bold text-white uppercase ">
                {menus}
              </h2>
              <p className="font-medium text-gray-200">Jumlah Menu</p>
            </div>

            {/* meja */}
            <div className="w-full p-8 space-y-8 text-center border bg-[#E14D2A] rounded-lg ">
              <p className="font-medium  uppercase text-gray-200">
                Meja
              </p>
              <h2 className="text-5xl font-bold  uppercase text-white">
                {mejas}
              </h2>
              <p className="font-medium  text-gray-200">Jumlah Meja</p>
            </div>

            {/* user */}
            <div className="w-full p-8 space-y-8 text-center bg-[#CD104D] rounded-lg ">
              <p className="font-medium  uppercase text-gray-200">
                User 
              </p>

              <h2 className="text-5xl font-bold uppercase text-white">
                {user}
              </h2>

              <p className="font-medium  text-gray-200">
                Jumlah user (admin,Manajer,Kasir)
              </p>
            </div>

           

            
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;