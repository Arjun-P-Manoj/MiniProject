import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateBookingPDF = (booking) => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(24);
  doc.text('Bus Booking System', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Booking Confirmation', 105, 30, { align: 'center' });
  
  // Add booking details
  doc.setFontSize(14);
  doc.text('Booking Details', 20, 50);
  
  // Format date
  const bookingDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }) : 'N/A';

  // Create table data with null checks
  const tableData = [
    ['Booking ID', booking.id || 'N/A'],
    ['Passenger Name', (booking.user && booking.user.name) || 'N/A'],
    ['Bus Name', (booking.bus && booking.bus.name) || 'N/A'],
    ['Route', (booking.bus && booking.bus.route) || 'N/A'],
    ['Seat Number', booking.seatNumber || 'N/A'],
    ['Booking Date', bookingDate],
    ['Amount', booking.amount ? `₹${booking.amount}` : 'N/A'],
    ['Status', booking.status || 'N/A']
  ];

  // Add table using autoTable
  autoTable(doc, {
    startY: 60,
    head: [['Detail', 'Value']], // Add headers
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      cellWidth: 'auto',
      halign: 'left',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    }
  });

  // Get the Y position after the table
  const finalY = doc.lastAutoTable.finalY;

  // Add terms and conditions
  doc.setFontSize(10);
  doc.text('Terms and Conditions:', 20, finalY + 20);
  doc.setFontSize(8);
  const terms = [
    '1. This ticket is non-transferable.',
    '2. Please arrive at the bus stop 30 minutes before departure.',
    '3. Valid ID proof is required for verification.',
    '4. Cancellation charges apply as per policy.',
    '5. For any queries, please contact our customer support.'
  ];
  
  terms.forEach((term, index) => {
    doc.text(term, 20, finalY + 30 + (index * 6));
  });

  // Add footer
  doc.setFontSize(8);
  doc.text('Thank you for choosing our service!', 105, finalY + 70, { align: 'center' });
  
  // Save the PDF
  doc.save(`booking-${booking.id}.pdf`);
};

export default generateBookingPDF; 