const { Router } = require('express');
const router = Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const invoiceRoutes = require('./facturacion.routes')
const customerRoutes = require('./customer.routes')
const sellerRoutes = require('./seller.routes')
const inventoryRoutes = require('./inventory.routes');
const supplierRoutes = require('./supplier.routes');
const purchaseRoutes = require('./purchase.routes');
const productRoutes = require('./product.routes');
const storeRoutes = require('./store.routes');
const reportRoutes = require('./reports.routes');
const devolutionsRoutes = require('./devolucion.routes')
const notaRoutes = require('./notaCredito.routes');
const pdfRoutes = require('./pdf.routes');
const accountpayableRoutes = require('./accountP.routes');
const accountreceivableRoutes = require('./accountR.routes');
const devolucionCompraRoutes = require('./devolucionCompra.routes')
const dollarRoutes = require('./dollar.routes')
const URL = "/api/"

router.use(`${URL}user`, userRoutes);
router.use(`${URL}auth`, authRoutes);
router.use(`${URL}invoice`, invoiceRoutes);
router.use(`${URL}customer`, customerRoutes)
router.use(`${URL}seller`,sellerRoutes)
router.use(`${URL}inventory`,inventoryRoutes);
router.use(`${URL}supplier`,supplierRoutes);
router.use(`${URL}purchase`,purchaseRoutes);
router.use(`${URL}product`, productRoutes);
router.use(`${URL}store`, storeRoutes);
router.use(`${URL}report`, reportRoutes);
router.use(`${URL}devolucion`, devolutionsRoutes);
router.use(`${URL}creditnotes`, notaRoutes);
router.use(`${URL}pdf`, pdfRoutes);
router.use(`${URL}account-payable`, accountpayableRoutes);
router.use(`${URL}account-receivable`, accountreceivableRoutes);
router.use(`${URL}devolucion-compra`, devolucionCompraRoutes);
router.use(`${URL}consulta`, dollarRoutes);


module.exports = router;
