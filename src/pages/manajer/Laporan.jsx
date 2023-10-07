import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { baseURL, config } from '../../config';

const { RangePicker } = DatePicker;

function Laporan() {
  const [dateRange, setDateRange] = useState(null);
  const [monthRange, setMonthRange] = useState(null);
  const [yearRange, setYearRange] = useState(null);
  const [tampilData, setTampilData] = useState([]);
  const [noTransaksi, setNoTransaksi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("users") !== `"manajer"`) {
      navigate("/"); 
    } 
  }, []);

  const handleFormSubmitTanggal = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      const response = await axios.post(
        baseURL + '/transaksi/jumlahPendapatanTanggal',
        { startDate, endDate },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError('Terjadi kesalahan saat memuat data: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmitBulan = async () => {
    try {
      setLoading(true);
      setError(null);

      const startMonth = monthRange[0].format('YYYY-MM');
      const endMonth = monthRange[1].format('YYYY-MM');

      const response = await axios.post(
        baseURL + '/transaksi/jumlahPendapatanBulanan',
        { startMonth, endMonth },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError('Terjadi kesalahan saat memuat data: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmitTahun = async () => {
    try {
      setLoading(true);
      setError(null);

      const startYear = yearRange[0].format('YYYY');
      const endYear = yearRange[1].format('YYYY');

      const response = await axios.post(
        baseURL + '/transaksi/jumlahPendapatanTahunan',
        { startYear, endYear },
        config
      );

      const data = response.data.data;
      setTampilData(data);
      setNoTransaksi(data.length === 0);
    } catch (error) {
      setError('Terjadi kesalahan saat memuat data: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex pr-4 ml-6 mt-4">
      <div className="w-full h-screen">
        <h1 className="text-2xl font-bold mb-4">Tampil Jumlah Pendapatan Berdasarkan Tanggal</h1>
        <Space direction="vertical" size={12}>
          <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleFormSubmitTanggal}
          >
            Tampilkan
          </button>
        </Space>

        <h1 className="text-2xl font-bold my-4">Tampil Jumlah Pendapatan Berdasarkan Rentang Bulan</h1>
        <Space direction="vertical" size={12}>
          <RangePicker
            picker="month"
            value={monthRange}
            onChange={(dates) => setMonthRange(dates)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleFormSubmitBulan}
          >
            Tampilkan
          </button>
        </Space>

        <h1 className="text-2xl font-bold my-4">Tampil Jumlah Pendapatan Berdasarkan Rentang Tahun</h1>
        <Space direction="vertical" size={12}>
          <RangePicker
            picker="year"
            value={yearRange}
            onChange={(dates) => setYearRange(dates)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleFormSubmitTahun}
          >
            Tampilkan
          </button>
        </Space>

        <div className='mt-4'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : tampilData.length === 0 && !noTransaksi ? (
            <p>Tidak ada pendapatan yang ditemukan dalam rentang yang dipilih.</p>
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
                        Rp{' '}
                        {new Intl.NumberFormat('id-ID').format(transaksiItem.total_income)}
                      </td>
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
