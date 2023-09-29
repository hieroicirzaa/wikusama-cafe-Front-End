import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { baseURL, config } from "../../config";
import { useReactToPrint } from "react-to-print";
import Modal from "react-modal";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import PrintButton from "./PrintButton";


// STRUK 
const StrukPrint = ({ transaksiItem }) => {
  return (
    <div className="struk-container">
      {/* <h2 >Struk Transaksi</h2> */}
      {/* Tampilkan informasi transaksi */}
      <table className="w-full mt-4 border-collapse">
        <thead className="bg-[#F4E869] w-full text-lg text-black">
          <tr>
            <th className="py-3 px-4 " colSpan="2">Struk Transaksi</th>
          </tr>
        </thead>

        <tbody className="bg-[#fffcd8] divide-y divide-gray-700 text-base">
          <tr>
            <th className="py-3 px-4">Tanggal Transaksi:</th>
            <th className="py-3 px-4">{" "}
        {new Intl.DateTimeFormat("id-ID").format(
          new Date(transaksiItem.tgl_transaksi)
        )}</th>
          </tr>
          <tr>
            <th className="py-3 px-4">Nama Pelanggan:</th>
            <th className="py-3 px-4">{transaksiItem.nama_pelanggan}</th>
          </tr>
          <tr>
            <th className="py-3 px-4">No Meja:</th>
            <th className="py-3 px-4">{transaksiItem.meja.nomor_meja}</th>
          </tr>
          <tr>
            <th className="py-3 px-4">User:</th>
            <th className="py-3 px-4">{transaksiItem.user.nama_user}</th>
          </tr>
          <tr>
            <th className="py-3 px-4" colSpan="2">Menu pemesanan:</th>

          </tr>
          <tr>
            <th className="py-3 px-4">
              <ul>
                {transaksiItem.detail_transaksi.map((detailItem) => (
                  <li key={detailItem.id}>
                    <ul>
                      {detailItem.menu.nama_menu} ({detailItem.qty})
                    </ul>
                  </li>
                ))}
              </ul>
            </th>
            <th className="py-3 px-4">
              <ul>
                {transaksiItem.detail_transaksi.map((detailItem) => (
                  <li key={detailItem.id}>
                    <ul>
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(detailItem.harga)}
                    </ul>
                  </li>
                ))}
              </ul>
            </th>
          </tr>
          <tr>
            <th className="py-3 px-4">Total Harga:</th>
            <th className="py-3 px-4">
              Rp{" "}
              {new Intl.NumberFormat("id-ID").format(
                transaksiItem.detail_transaksi.reduce(
                  (total, detailItem) =>
                    total + detailItem.menu.harga * detailItem.qty,
                  0
                )
              )}
            </th>
          </tr>
        </tbody>
      </table>

    </div>
  );
};

// DAFTAR TRANSAKSI
const Transaksi = () => {
  let [search, setSearch] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const componentRef = useRef();
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransaksi();
  }, []);
  useEffect(() => {
    // Cek apakah user sudah login atau belum 
    if (!localStorage.getItem("logged")) {
      navigate("/");
    } else {
      // setUser(`Selamat datang sebagai ${localStorage.getItem("user")} ${localStorage.getItem("namauser")}`);
      // let role = localStorage.getItem("user");
      // let namauser = localStorage.getItem("namauser");
      let id_user = localStorage.getItem("id_user");
      setUser(`${id_user}`);
    }
  }, [navigate]);

  const fetchTransaksi = async () => {
    try {
      const response = await axios.get(baseURL + "/transaksi/getTransaksi", config);
      setTransaksi(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (transaksiItem) => {
    const updatedTransaksi = {
      ...transaksiItem,
      status: transaksiItem.status === "belum_bayar" ? "lunas" : "belum_bayar",
    };

    try {
      await axios.put(
        baseURL + "/transaksi/updateStatus/" + transaksiItem.id,
        updatedTransaksi,
        config
      );
      fetchTransaksi();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL + "/transaksi/filterTransaksi",
        { keyword: search },
        config
      );
      setTransaksi(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = (transaksiItem) => {
    setSelectedTransaksi(transaksiItem);
    setShowPrintModal(true);
  };

  const handleAfterPrint = () => {
    setShowPrintModal(false);
  };

  const handlePrintButtonClick = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: handleAfterPrint,
  });

 

  return (
    <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Daftar Transaksi
      </h1>
      <div className="flex justify-content-between align-items-center mb-3">
        {/* search form*/}
        <form
          className="w-full flex justify-end text-gray-100"
          onSubmit={(e) => handleSearch(e)}
        >
          <input
            type="search"
            name="Search"
            placeholder="Search..."
            className="w-56 py-2 pl-4 text-sm outline-none bg-white text-gray-700   rounded-2xl border-2 border-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Transaksi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Pelanggan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No Meja
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Menu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Struk
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transaksi.map((transaksiItem, index) => (
              <tr key={transaksiItem.id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.DateTimeFormat("id-ID").format(
                    new Date(transaksiItem.tgl_transaksi)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaksiItem.nama_pelanggan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaksiItem.meja.nomor_meja}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaksiItem.user.nama_user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul>
                    {transaksiItem.detail_transaksi.map((detailItem) => (
                      <li key={detailItem.id}>
                        {detailItem.menu.nama_menu} ({detailItem.qty})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    transaksiItem.detail_transaksi.reduce(
                      (total, detailItem) =>
                        total + detailItem.menu.harga * detailItem.qty,
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaksiItem.status === "belum_bayar" ? (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => handleToggleStatus(transaksiItem)}
                    >
                      Belum Bayar
                    </button>
                  ) : (
                    <button
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md"
                      disabled
                    >
                      Lunas
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => handlePrint(transaksiItem)}
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Print */}
      <Modal
        isOpen={showPrintModal}
        onRequestClose={() => setShowPrintModal(false)}
        className="print-modal"
      >
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-md mb-4 ml-4 mt-4"
          onClick={() => {
            setShowPrintModal(false);
            navigate(-1); // Menggunakan navigate(-1) untuk kembali ke halaman sebelumnya
          }}
        >
          <FaArrowLeft></FaArrowLeft>
        </button>
        
        
        <div className="mx-auto w-fit bg-white">
          {selectedTransaksi && (
            <div id="print-area" className="max-w-xl">
              <StrukPrint
                transaksiItem={selectedTransaksi}
                ref={componentRef}
              />
              <PrintButton />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Transaksi;