import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaPrint } from "react-icons/fa";

const PrintButton = () => {
  const handlePrint = () => {
    const input = document.getElementById('print-area');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('wikusama cafe.pdf');

      });
  };

  return (
    <button
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-md mb-4 ml-4 mt-4"
    onClick={handlePrint}
  >
    <FaPrint></FaPrint>
  </button>
  );
};

export default PrintButton;