import React from 'react';
import jsPDF from 'jspdf';

class PrintButton extends React.Component {
  printPDF = () => {
    const doc = new jsPDF();
    const element = document.getElementById('content');
    doc.fromHTML(element, 15, 15, { width: 170 });
    doc.save('file.pdf');
  };

  render() {
    return (
      <button onClick={this.printPDF}> Print PDF</button>
    );
  }
}

export default PrintButton;