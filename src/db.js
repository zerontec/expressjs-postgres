require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {

  PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME 
} = process.env;

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/gallery`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const  pg = require("pg");
const { Pool } = require('pg')
 
const pool = new Pool({
  host: 'localhost',
  user: 'database-user',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway



let sequelize =
  process.env.NODE_ENV === "development"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },

        pool: {
          max: 5, // Número máximo de conexiones en el pool
          min: 0, // Número mínimo de conexiones en el pool
          acquire: 30000, // Tiempo máximo en milisegundos para adquirir una conexión
          idle: 10000, // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser liberada
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/munecadb`,
        { logging: false, native: false }
      );



// let sequelize =
//   process.env.NODE_ENV === "production"
//     ? new Sequelize({
//         database: PGDATABASE,
//         dialect: "postgres",
//         host: PGHOST, 
//         port: PGPORT,
//         username: PGUSER,
//         password: PGPASSWORD,
//         pool: {
//           max: 3,
//           min: 1,
//           idle: 10000,
//         },
//         dialectOptions: {
//           ssl: {
//             require: true,
//             // Ref.: https://github.com/brianc/node-postgres/issues/2009
//             rejectUnauthorized: false,
//           },
//           keepAlive: true,
//         },
//         ssl: true,
//       })
//     : new Sequelize(
//         `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`,
//         { logging: false, native: false }
//       );


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const {
  NotaCredito,
  ProductoDevuelto,
  DevolucionesVentas,
  InvoiceProduct,
  InvoiceFactura,
  AccountsReceivable,
  Customer,
  Seller,
  AccountPayable,
  Invoice,
  Alert,
  Store,
  Supplier,
  Purchase,
  Product,
  Inventory,
  User,
  Propiedad,
  Services,
  Role,
  Review,
  Rating,
  PurcharseOrder,
  buyServices,
  DevolucionCompras,
  NotaDebito,
  ProductosDefectuosos
  
} = sequelize.models;
const ROLES = ["admin", "vendedor", "facturacion"];

Role.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// Product.hasOne(Inventory, { foreignKey: "productId", as: "productInventory" });
// Inventory.belongsTo(Product, { foreignKey: "productId" });


// Purchase.hasMany(Product, { as: 'productos', foreignKey: 'purchaseId' });





NotaDebito.belongsTo(DevolucionCompras, {as: 'devolucionCompra',
foreignKey: 'numeroDevolucion'});


DevolucionCompras.belongsTo(Purchase, { as: 'compra', foreignKey: 'numeroFactura' });

// Asociación entre Product e Purchase
Product.hasMany(Purchase, { foreignKey: "productId", as: "productPurchases" });
Purchase.belongsTo(Product, { foreignKey: "productId" });

Purchase.hasMany(Product, { as: 'products' });
Product.belongsTo(Purchase, { as: 'purchase' });


// Asociación entre Supplier y Purchase
Supplier.hasMany(Purchase, { as: "supplierPurchases" });
Purchase.belongsTo(Supplier);

// Relación entre Producto, Inventario y Tienda
Product.belongsToMany(Store, { through: Inventory, as: "productStores" });
Store.belongsToMany(Product, { through: Inventory, as: "storeProducts" });

// Relación con el modelo de Inventario
Alert.belongsTo(Inventory, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Relación entre Invoice (Factura) y Supplier (Proveedor)
Invoice.belongsTo(Supplier);

// Relación entre Invoice (Factura) y Purchase (Compra)
Invoice.belongsTo(Purchase);

// Relación entre Purchase (Compra) y AccountsPayable (Cuentas por Pagar)
Purchase.hasMany(AccountPayable);
AccountPayable.belongsTo(Purchase);

// Relación entre AccountPayable (Cuentas por Pagar) y Supplier (Proveedor)
AccountPayable.belongsTo(Supplier);

Customer.hasMany(InvoiceFactura, { foreignKey: "customerId" });
Seller.hasMany(InvoiceFactura, { foreignKey: "sellerId" });

Invoice.belongsTo(Customer, { foreignKey: "customerId" });
Invoice.belongsTo(Seller, { foreignKey: "sellerId" });

Customer.hasMany(AccountsReceivable, { foreignKey: "customerId" });
AccountsReceivable.belongsTo(Customer, { foreignKey: "customerId" });

InvoiceFactura.hasOne(AccountsReceivable, { foreignKey: "invoiceId" });

InvoiceFactura.belongsTo(AccountsReceivable, {
  foreignKey: "accountsReceivableId",
});

AccountsReceivable.belongsTo(InvoiceFactura, {
  foreignKey: "invoiceFacturaId",
});

// Customer.hasMany(Purchase);
// Purchase.belongsTo(Customer);
Inventory.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

Supplier.hasMany(Inventory, {
  foreignKey: "supplierId",
  as: "inventory",
});

Store.hasMany(Inventory, { foreignKey: "storeId", onDelete: "CASCADE" });
Inventory.belongsTo(Store, { foreignKey: "storeId" });

// Relaciones
InvoiceFactura.belongsTo(Seller, { foreignKey: "sellerIdId" });
InvoiceFactura.belongsTo(Customer, { foreignKey: "customerId" });
InvoiceFactura.belongsToMany(Product, {
  through: InvoiceProduct,
  as: "products",
});

Product.belongsTo(InvoiceFactura, { foreignKey: "invoiceFacturaId" });
InvoiceFactura.hasMany(Product, {
  foreignKey: "invoiceFacturaId",
  as: "productos",
});
// Relaciones con otros modelos
DevolucionesVentas.belongsTo(InvoiceFactura, {
  foreignKey: "invoiceFacturaId",
});

DevolucionesVentas.hasMany(ProductoDevuelto, {
  as: "productosDevueltos",
  foreignKey: "devolucionVentaId",
});

ProductoDevuelto.belongsTo(DevolucionesVentas, {
  foreignKey: "devolucionVentaId",

});

Product.hasMany(ProductoDevuelto, { foreignKey: 'productId' });


ProductosDefectuosos.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

NotaCredito.belongsTo(Customer, { foreignKey: "clienteId" }); // Reemplaza 'Cliente' con el modelo correspondiente a tu entidad de Cliente
// // Definir las relaciones con otros modelos
// InvoiceProduct.belongsTo(Product, { foreignKey: 'productId' });
// InvoiceProduct.belongsTo(InvoiceFactura, { foreignKey: 'invoiceId' });

// Relaciones con otros modelos
// InvoiceFactura.hasMany(InvoiceProduct, { as: 'invoiceProducts', foreignKey: 'invoiceFacturaId' });
// InvoiceProduct.belongsTo(InvoiceFactura, { as: 'invoiceFactura', foreignKey: 'invoiceFacturaId' });
module.exports = {
  ...sequelize.models,
  conn: sequelize,
  ROLES,
  sequelize,
};
