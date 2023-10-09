import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL, config } from '../../config';
import { useNavigate } from "react-router-dom";
import BarChart from "../../components/chartJS/BarChart";
import LineChart from "../../components/chartJS/LineChart";
import PieChart from "../../components/chartJS/PieChart";

function Statistik() {
  const [menuData, setMenuData] = useState({
    labels: [],
    datasets: [
      {
        label: "total pesanan",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [isTerlaris, setIsTerlaris] = useState(true);

  const fetchData = async () => {
    try {
      const endpoint = isTerlaris ? "/transaksi/statistik_makanan_minuman_sedikit" : "/transaksi/statistik_makanan_minuman_terlaris";
      const response = await axios.get(baseURL + endpoint, config);
      setMenuData({
        labels: response.data.data.map((data) => data.nama_menu),
        datasets: [
          {
            label: "Statistik Makanan & Minuman",
            data: response.data.data.map((data) => data.total_pesanan),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("users") !== `"manajer"`) {
      navigate("/");
    }
    fetchData();
  }, [isTerlaris]);

  const toggleData = () => {
    setIsTerlaris(!isTerlaris);
  };

  return (
    <div>
      <div className='flex flex-col items-center'>
        <button
        onClick={toggleData}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4 mt-10"
      >
        {isTerlaris ? "Tampilkan Terlaris" : "Tampilkan Terendah"}
      </button>
      </div>
      
    <div className='flex flex-row items-center justify-center'>
      
      <div className="w-1/3 p-4">
        <BarChart chartData={menuData} />
      </div>
      <div className="w-1/3 p-4">
        <LineChart chartData={menuData} />
      </div>
      <div className="w-1/4 p-4">
        <PieChart chartData={menuData} />
      </div>
    </div>
    </div>
  );
}

export default Statistik;
