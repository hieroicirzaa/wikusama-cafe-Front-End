import React, { useState, useEffect } from "react";
import {  useNavigate } from 'react-router-dom';
import axios from "axios";
import { baseURL, config } from "../../config";

function TambahTransaksi() {
  const [menu, setMenu] = useState([]);
  const [meja, setMeja] = useState([]);
  const [user, setUser] = useState([]);
  const [harga, setHarga] = useState(0);
  const [idUser, setIdUser] = useState("");
  const [idMeja, setIdMeja] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [status, setStatus] = useState("");
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMenu();
    fetchMeja();
    fetchUser();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(baseURL + "/menu/getAllMenu", config);
      setMenu(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMeja = async () => {
    try {
      const response = await axios.get(baseURL + "/meja/status/kosong", config);
      setMeja(response.data.data)
      // let options = response.data.data.map(function (meja) {
      //   return meja.nomor_meja;
      // });

      // setMeja(options);
      
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(baseURL + "/user/user/kasir", config);
      let options = {
        id_user : localStorage.getItem('id_user'),
        nama_user : localStorage.getItem('namauser')
      }

      setUser(JSON.parse(JSON.stringify(options)));

      // mejaOptions = options

      // console.log("options >>> ", mejaOptions)
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = (id_menu, qty) => {
    const existingItem = detailTransaksi.find(
      (item) => item.id_menu === id_menu
    );

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        qty: existingItem.qty + qty,
        harga: existingItem
      };
      const updatedTransaksi = detailTransaksi.map((item) =>
        item.id_menu === id_menu ? updatedItem : item
      );
      setDetailTransaksi(updatedTransaksi);
    } else {
      const newItem = { id_menu: id_menu, qty: qty, harga };
      const updatedTransaksi = [...detailTransaksi, newItem];
      setDetailTransaksi(updatedTransaksi);
    }
  };

  const handleQtyChange = (id_menu, qty) => {
    const updatedItem = {
      ...detailTransaksi.find((item) => item.id_menu === id_menu),
      harga: parseInt(harga),
    };
    const updatedTransaksi = detailTransaksi.map((item) =>
      item.id_menu === id_menu ? updatedItem : item
    );
    setDetailTransaksi(updatedTransaksi);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    try {
      const transaksiData = {   
        id_user: localStorage.getItem('id_user'),
        id_meja: idMeja,
        nama_pelanggan: namaPelanggan,
        status: status,
        detail_transaksi: detailTransaksi,
      };
      console.log(transaksiData);
      ///transaksi API
      const response = await axios.post(baseURL + "/transaksi/addTransaksi", transaksiData, config).then((e) => {
        console.log(e)
      });

      if (response.status == false) {
        alert("Terjadi kesalahan saat menambahkan transaksi");
        navigate('/transaksi', { replace: true });
      } else if (response.status == true) {

        alert("Transaksi berhasil ditambahkan");
        navigate('/Transaksi', { replace: true });
      }

    } catch (error) {
      console.error(error);
        navigate('/Transaksi', { replace: true });
        alert("Transaksi berhasil ditambahkan");
    } finally {
      // Reset form fields and state after successful submission


      setIdUser("");
      setIdMeja("");
      setNamaPelanggan("");
      setStatus("");
      setDetailTransaksi([]);
      setTotalHarga(0);
    }
  };

  const handleDelete = async (id) => {
    alert("Are you sure delete this data?");

    // delete data from API using AXIOS
    try {
      const response = await axios.delete(baseURL + "/menu/" + id, config);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
    // refresh member data
    fetchMenu();
  };
  const calculateTotalHarga = () => {
    let total = 0;
    detailTransaksi.forEach((item) => {
      const menuItem = menu.find(
        (menuItem) => menuItem.id === item.id_menu
      );
      total += item.qty * menuItem.harga;
    });
    setHarga(total)
    return total;
  };

  useEffect(() => {
    const total = calculateTotalHarga();
    setTotalHarga(total);
  }, [detailTransaksi, menu]);

  return (
    <div className="py-6 overflow-auto">
  <h1 className="flex justify-center font-semibold text-4xl">Tambah Transaksi</h1>

  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mx-14 sm:p-5">
    

    {/* User */}
    <div>
      <label className="block mb-2 font-bold text-gray-900">User:</label>
      <select
        value={idUser}
        onChange={(event) => setIdUser(event.target.value)}
        className="px-4 py-2 w-full border rounded-lg text-gray-900" required
      >
        <option value="">Pilih User</option>
        
          <option key={user.id_user} value={user.id_user}>
            {user.nama_user}
          </option>
      
      </select>
    </div>

    {/* Nomor Meja */}
    <div>
      <label className="block mb-2 font-bold text-gray-900">Nomor Meja:</label>
      <select
        value={idMeja}
        onChange={(event) => setIdMeja(event.target.value)}
        className="px-4 py-2 w-full border rounded-lg text-gray-900" required
      >
        <option value="">Pilih Meja</option>
        {meja.map((meja) => (
          <option key={meja.id_meja} value={meja.id_meja}>
            {meja.nomor_meja}
          </option>
        ))}
      </select>
    </div>

    {/* Nama Pelanggan */}
    <div>
      <label className="block mb-2 font-bold text-gray-900">Nama Pelanggan:</label>
      <input
        type="text"
        value={namaPelanggan}
        onChange={(event) => setNamaPelanggan(event.target.value)}
        className="px-4 py-2 w-full border rounded-lg text-gray-900" required
      />
    </div>

    {/* Status Pembayaran */}
    <div>
      <label className="block mb-2 font-bold text-gray-900">Status Pembayaran:</label>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        name="status"
        className="px-4 py-2 w-full border rounded-lg text-gray-900" required
      >
        <option value="">Pilih Status</option>
        <option value="belum_bayar">Belum Bayar</option>
        <option value="lunas">Lunas</option>
      </select>
    </div>

    {/* Daftar Menu */}
    <div className="col-span-2 mt-10">
      <table className="w-full text-md bg-slate-200 shadow-md rounded mb-4">
        <thead>
          <tr className="bg-white">
            <th className="text-center p-3 px-5">Menu</th>
            <th className="text-center p-3 px-5">Harga</th>
            <th className="text-center p-3 px-5">Jumlah</th>
            <th className="text-center p-3 px-5">Total</th>
            <th className="text-center p-3 px-5">Aksi</th>
            <th className="text-center p-3 px-5">Hapus Menu</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((menu) => (
            <tr key={menu.id} className="hover:bg-gray-300">
              <td className="text-center p-3 px-5">{menu.nama_menu}</td>
              <td className="text-center p-3 px-5">{menu.harga}</td>
              <td className="text-center p-3 px-5">
                <input
                  type="number"
                  value={
                    detailTransaksi.find(
                      (item) => item.id_menu === menu.id
                    )?.qty || 0
                  }
                  min="0"
                  max="99"
                  onChange={(event) =>
                    handleQtyChange(menu.id, event.target.value)
                  }
                  className="w-24 text-center border rounded-md py-2 px-2"
                />
              </td>
              <td className="p-3 px-2 text-center">
                {menu.harga *
                  (detailTransaksi.find(
                    (item) => item.id_menu === menu.id
                  )?.qty || 0)}
              </td>
              <td className="p-3 px-5 text-center" required>
                <button
                  type="button"
                  onClick={() => handleAddToCart(menu.id, 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2" required
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(menu.id, -1)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" required
                >
                  Kurang
                </button>
              </td>
              <td className="p-3 px-5 text-center" required>
                <button
                  type="button"
                  onClick={() => handleDelete(menu.id)}
                  className="bg-blue-300 hover:bg-blue-500 text-white px-4 py-2 rounded mr-2" required
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Total Harga */}
    <div>
      <label className="block mb-1 text-xl font-bold text-gray-900">Total Harga:</label>
      <span className="text-xl">{totalHarga}</span>
    </div>

    {/* Tombol Submit */}
    <button
      type="submit"
      className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md no-underline inline-block cursor-pointer"
    >
      Tambah Transaksi
    </button>
  </form>
</div>

  );
}

export default TambahTransaksi