import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseURL, config } from "../../config";
import { useReactToPrint } from "react-to-print";
import Modal from "react-modal";

// STRUK 
const StrukPrint = ({ transaksiItem }) => {
  return (
    <div className="struk-container">
      <h2>Struk Transaksi</h2>
      {/* Tampilkan informasi transaksi */}
      <p>Tanggal Transaksi: {transaksiItem.tgl_transaksi}</p>
      <p>Nama Pelanggan: {transaksiItem.nama_pelanggan}</p>
      <p>No Meja: {transaksiItem.meja.nomor_meja}</p>
      <p>User: {transaksiItem.user.nama_user}</p>

      <h3>Menu:</h3>
      <ul>
        {transaksiItem.detail_transaksi.map((detailItem) => (
          <li key={detailItem.id}>
            <ul>
              {detailItem.menu.nama_menu} ({detailItem.qty})
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

// DAFTAR TRANSAKSI
const TransaksiManajer = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    fetchTransaksi();
  }, []);

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
        baseURL + "/transaksi/updateStatus/" + transaksiItem.id, //transaksi/updateStatus/
        updatedTransaksi,
        config
      );
      fetchTransaksi();
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4"
          onClick={handlePrintButtonClick}
        >
          Print Struk
        </button>
        {selectedTransaksi && (
          <StrukPrint
            transaksiItem={selectedTransaksi}
            ref={componentRef}
          />
        )}
      </Modal>
    </div>
  );
};

export default TransaksiManajer;