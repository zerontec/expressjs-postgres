const {jsPDF} = require('jspdf');
const fs = require("fs");
require('jspdf-autotable');
const { Invoice ,User, NotaCredito} = require('../db');

// ESTE FUNCINA GUARDANDO LA FACTURA 

const generatePdf = async (invoiceData) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar el título del documento
    doc.setFontSize(20);
    doc.text(`Factura #${invoiceData.invoiceNumber}`, 14, 22);

    // Agregar los detalles del cliente
    doc.setFontSize(12);
    doc.text(`Nombre: ${invoiceData.cliente.name}`, 14, 40);
    doc.text(`Cédula: ${invoiceData.cliente.identification}`, 14, 48);
    doc.text(`Dirección: ${invoiceData.cliente.address}`, 14, 56);
    doc.text(`Teléfono: ${invoiceData.cliente.telf}`, 14, 64);
    // doc.text(`Correo electrónico: ${invoiceData.client.email}`, 14, 72);
    doc.text(`Vendedor: ${invoiceData.vendedor.codigo}`, 14, 72);
    // Agregar los detalles de la factura
    doc.setFontSize(16);
    doc.text(`Total: ${invoiceData.subtotal}`, 150, 100);
    doc.text(`IVA: ${invoiceData.Iva}`, 150, 108);
    doc.text(`Total a pagar: ${invoiceData.amount}`, 150, 116);

    // Agregar la tabla de análisis
    doc.autoTable({
      startY: 120,
      head: [['Items', 'Cantidad', 'Precio', 'Subtotal']],
      body: invoiceData.productos.map((item) => [
        item.name,
        item.quantity,
        item.price,
        item.quantity * item.price
      ]),
      showHead: 'firstPage',
      margin: { top: 10 }
    });

    // Descargar el archivo PDF
    const pdfPath = `factura_${invoiceData.invoiceNumber}.pdf`;
    doc.save(pdfPath);
    console.log(`Archivo guardado en: ${pdfPath}`);
  } catch (err) {
    console.error(err);
  }
};


const generatePdfNotaCredito = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtén la nota de crédito seleccionada de la base de datos
    const notaCredito = await NotaCredito.findByPk(id);

    if (!notaCredito) {
      return res.status(404).json({ message: "Nota de crédito no encontrada" });
    }

    // Crea un nuevo documento PDF
    const doc = new jsPDF();

    // Establece las fuentes y tamaños de fuente para el encabezado y el contenido
    const headerFont = "Helvetica";
    const headerFontSize = 18;
    const contentFont = "Times";
    const contentFontSize = 12;

    // Define las coordenadas x e y para el encabezado y el contenido
    const headerX = doc.internal.pageSize.getWidth() / 2;
    const headerY = 30;
    const contentX = 20;
    let contentY = 60;

    // Agrega el encabezado al documento
    doc.setFont(headerFont, "bold");
    doc.setFontSize(headerFontSize);
    doc.text("Nota de Crédito", headerX, headerY, { align: "center" });

    // Agrega el contenido al documento
    doc.setFont(contentFont);
    doc.setFontSize(contentFontSize);
    doc.text(`Número de nota de crédito: ${notaCredito.numeroNota}`, contentX, contentY);
    contentY += 15;
    doc.text(`Fecha: ${notaCredito.fecha.toDateString()}`, contentX, contentY);
    contentY += 15;
    doc.text(`Nombre: ${notaCredito.clienteData.name}`, contentX, contentY);
    contentY += 15;
    doc.text(`Identificacion: ${notaCredito.clienteData.identification}`, contentX, contentY);
    contentY += 15;
    doc.text(`Direccion: ${notaCredito.clienteData.address}`, contentX, contentY);
    contentY += 15;

    // Verificar si la propiedad "monto" es un número válido
    const monto = parseFloat(notaCredito.monto);
    if (!isNaN(monto)) {
      // Formatear el valor del monto con dos decimales
      const montoFormateado = monto.toFixed(2);
      doc.text(`Monto: $${montoFormateado}`, contentX, contentY);
    } else {
      doc.text('Monto: Valor inválido', contentX, contentY);
    }

    // Genera el archivo PDF como un objeto en formato base64
    const pdfData = doc.output("datauristring");

    // Envía la respuesta al cliente con el objeto PDF en base64
    res.status(200).json({ pdfData });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};


module.exports={generatePdf, generatePdfNotaCredito}
