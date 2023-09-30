import React, { useState } from 'react';
import axios from 'axios';
import { baseURL, config } from '../../config';

function Laporan() {
  const [tanggal, setTanggal] = useState('');
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [tampilData, setTampilData] = useState([]);
  const [noTransaksi, setNoTransaksi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmitTanggal = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Menandakan bahwa permintaan sedang berlangsung
      setError(null); // Menghapus pesan kesalahan sebelumnya (jika ada)

      let date = `${tanggal}`;

      const response = await axios.post(
        baseURL + "/transaksi/jumlahPendapatanTanggal",
        { date: date },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError("Terjadi kesalahan saat memuat data."); // Menampilkan pesan kesalahan kepada pengguna
      console.error(error);
    } finally {
      setLoading(false); // Menandakan bahwa permintaan telah selesai
    }
  };

  const handleFormSubmitBulan = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Menandakan bahwa permintaan sedang berlangsung
      setError(null); // Menghapus pesan kesalahan sebelumnya (jika ada)

      let month = `${bulan}`;
      let year = `${tahun}`;

      const response = await axios.post(
        baseURL + "/transaksi/jumlahPendapatanBulanan",
        { month: month, year: year },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError("Terjadi kesalahan saat memuat data."); // Menampilkan pesan kesalahan kepada pengguna
      console.error(error);
    } finally {
      setLoading(false); // Menandakan bahwa permintaan telah selesai
    }
  };

  const handleFormSubmitTahun = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Menandakan bahwa permintaan sedang berlangsung
      setError(null); // Menghapus pesan kesalahan sebelumnya (jika ada)
      let year = `${tahun}`;

      const response = await axios.post(
        baseURL + "/transaksi/jumlahPendapatanTahunan",
        { year: year },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError("Terjadi kesalahan saat memuat data."); // Menampilkan pesan kesalahan kepada pengguna
      console.error(error);
    } finally {
      setLoading(false); // Menandakan bahwa permintaan telah selesai
    }
  };

  return (
    <div className="flex pr-4  ml-4 mt-4 ">
      <div className="w-full h-screen">
        {/* berdasarkan tanggal */}
        <h1 className="text-2xl font-bold mb-4">Tampil Jumlah Pendapatan Berdasarkan Tanggal</h1>
        <form onSubmit={handleFormSubmitTanggal} className="mb-4">

          <div className="flex mb-2">
            <label className="mr-2">Tanggal:</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded" required
            />
          </div>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Tampilkan
          </button>
        </form>

        {/* berdasarkan bulan dan tahun */}
        <h1 className="text-2xl font-bold mb-4">Tampil Jumlah Pendapatan Berdasarkan Bulan</h1>
        <form onSubmit={handleFormSubmitBulan} className="mb-4">
          <div className="flex mb-2">
            <label className="mr-2">Bulan:</label>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded" required
            >
              <option value="">Pilih Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div className="flex mb-2">
            <label className="mr-2">Tahun:</label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded" required
            />
          </div>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Tampilkan
          </button>
        </form>

        {/* Berdasarkan Tahun */}
        <h1 className="text-2xl font-bold mb-4">Tampil Jumlah Pendapatan Berdasarkan Tahun</h1>
        <form onSubmit={handleFormSubmitTahun} className="mb-4">
          <div className="flex mb-2">
            <label className="mr-2">Tahun:</label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded" required
            />
          </div>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Tampilkan
          </button>
        </form>

        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : tampilData.length === 0 && !noTransaksi ? (
            <p>Tidak ada pendapatan yang ditemukan pada tanggal, bulan dan tahun ini.</p>
          ) : (
            tampilData.length > 0 && (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-blue-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Jumlah Pendapatan:
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-blue-200 divide-y divide-gray-200">
                  {tampilData.map((transaksiItem) => (
                    <tr key={transaksiItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(transaksiItem.total_income)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Laporan;