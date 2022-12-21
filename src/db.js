require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = process.env;
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();




let sequelize =
  process.env.NODE_ENV === "production"
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
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/glove`,
        { logging: false, native: false }
      );


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { User,Propiedad, Services, Role, Review, Rating, PurcharseOrder, buyServices } = sequelize.models;
const ROLES = ['admin', 'usergl','usertl']


//User.hasMany(Shopping_cart, {as:"shopping_cart", foreignKey: 'user_id'});
// Shopping_cart.belongsTo(User, {as:"user"});

// User.hasMany(PurchaseOrder)
// PurchaseOrder.belongsToMany(User, {through: 'user_purchase_order'})

// Artwork.hasMany(Review);
// Review.belongsTo(Artwork);

// User.hasMany(Process_payment);
// Process_payment.belongsTo(User, {through: 'user_process_payment'});

// Artwork.belongsToMany(Rating, {through: 'artwork_rating'});
// Rating.belongsToMany(Artwork, {through: 'artwork_rating'});
// Rating.belongsToMany(User, {through: 'user_rating'});
// User.belongsToMany(Rating, {through: 'user_rating'});


// Shopping_cart.belongsToMany(Artwork, { through: 'Shopping_cart_artwork' });
// Artwork.belongsToMany(Shopping_cart, { through: 'Shopping_cart_artwork' });
// Artwork.belongsToMany(Type, {through: 'artwork_type'});
// Type.belongsToMany(Artwork, {through: 'artwork_type'});
Role.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
// User.hasMany(Propiedad,{through:"user_Propiedad"} );
// Pripiedad.belongsToMany(User,{through:"propiedad_User"})
// RefreshToken.belongsTo(User,{ foreignKey: 'userId', targetKey: 'id'})
// User.hasOne(RefreshToken, {foreignKey: 'userId', targetKey: 'id'})

module.exports = {
  ...sequelize.models, 
  conn: sequelize,  
  ROLES   
};