import React, { useState } from 'react';
import axios from 'axios';
import { baseURL, config } from '../../config';

function Laporan() {
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [transaksiData, setTransaksiData] = useState([]);
  const [noTransaksi, setNoTransaksi] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const tglTransaksi = `${tahun}-${bulan}`;

      const response = await axios.post(
        baseURL + "/transaksi/bulan",
        { tgl_transaksi: tglTransaksi },
        config
      );


      const data = response.data.data;
      setTransaksiData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tampil Transaksi Berdasarkan Bulan</h1>
      <form onSubmit={handleFormSubmit} className="mb-4">
        <div className="flex mb-2">
          <label className="mr-2">Bulan:</label>
          <select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          >
            <option value="">Pilih Bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>
        <div className="flex mb-2">
          <label className="mr-2">Tahun:</label>
          <input
            type="text"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Tampilkan Transaksi
        </button>
      </form>

      <div>
        {transaksiData.length === 0 ? (
          <p>Tidak ada transaksi yang ditemukan di bulan ini.</p>
        ) : (
          transaksiData.length > 0 && (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transaksiData.map((transaksiItem, index) => (
                  <tr key={transaksiItem.id_transaksi}>
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
                          <li key={detailItem.id_detail_transaksi}>
                            {detailItem.menu.nama_menu} ({detailItem.jumlah})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        transaksiItem.detail_transaksi.reduce(
                          (total, detailItem) =>
                            total + detailItem.menu.harga * detailItem.jumlah,
                          0
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaksiItem.status === "belum_bayar" ? (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                          // onClick={() => handleToggleStatus(transaksiItem)}
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
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

export default Laporan;