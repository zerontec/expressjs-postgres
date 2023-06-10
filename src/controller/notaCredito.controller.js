const { NotaCredito } = require("../db.js");

// const { PDFDocument, StandardFonts } = require('pdf-lib');
// const fs = require('fs');
// const path = require('path');

// // Función para generar un PDF con la nota de crédito
// const generarPDFNotaCredito = async (numeroNota, fecha, monto, cliente) => {
// // Código para generar el contenido del PDF
// // ...

// // Crea el documento PDF usando la librería pdf-lib
// const pdfDoc = await PDFDocument.create();
// const page = pdfDoc.addPage();

// // Agrega el contenido al PDF
// // ...

// // Guarda el PDF en un archivo
// const outputPath = path.join(__dirname, 'nota_credito.pdf');
// const pdfBytes = await pdfDoc.save();
// fs.writeFileSync(outputPath, pdfBytes);
// };

// Función para crear la nota de crédito
const crearNotaCredito = async (numeroNota, fecha, monto, clienteData) => {
  try {
    // Crea la nota de crédito
    const notaCredito = await NotaCredito.create({
      numeroNota,
      fecha,
      monto,
      clienteData,
    });

    // res.status(200).json(notaCredito)

    // // Genera el PDF de la nota de crédito
    // await generarPDFNotaCredito(numeroNota, fecha, monto, cliente);

    console.log("Nota de crédito creada exitosamente");
  } catch (error) {
    console.error("Ocurrió un error al crear la nota de crédito:", error);
  }
};

const findAllNota = async (req, res, next) => {
  try {
    const notas = await NotaCredito.findAll();
    if (notas.length === 0) {
      return res
        .status(400)
        .json({ messague: "No se encontraron Notas de credito" });
    }

    res.status(200).json(notas);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

const editNota = async (req, res, next) => {
  const id = req.params.id;
  const { monto, clienteData } = req.body;

  try {
    const nots = await NotaCredito.findByPk(id);
    if (nots) {
      nots.update({ clienteData: clienteData, monto: monto });
      res.status(201).json({ message: "Nota Actualizado exitosamente" });
    } else res.status(404).json({ messague: "no existe nota con id "`${id}` });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

const obtenerUnaNota = async (req, res, next) => {
  try {
    const id = req.params.id;

    const nota = await NotaCredito.findByPk(id);
    if (id) {
      res.status(201).json(nota);
    } else res.staus(404).json({ messague: "Nota no encontrada " });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

module.exports = {
  crearNotaCredito,
  findAllNota,
  editNota,
  obtenerUnaNota,
};
