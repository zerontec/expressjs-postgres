//                o88o            o88o
//               o8888o          o8888o
//                 o888888oo0oo888888o
//                     8o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');


// const {  defaultAdminAndRoles } = require('../api/src/dbLoad/loadUser');

const port = process.env.PORT || 5040;


  // Syncing all the models at once.
  conn.sync({ force: false }).then(() => {
    server.listen(port, () => {
      console.log('o|O_O|o robot Σωκράτης listening at 5040');
  // defaultAdminAndRoles();
    });
  
  });
  
// deployment heroku