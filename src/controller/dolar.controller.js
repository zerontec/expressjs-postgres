const consultaDolar = require('consulta-dolar-venezuela');



const consultarDolar= (req, res, net)=> {


    consultaDolar.$monitor()
    .then(data => {
      const dolarData = {
        bcv: data['$bcv'],
        enparalelovzla: data['$enparalelovzla'],
        dolartoday: data['$dolartoday'],
        monitordolarweb: data['$monitordolarweb'],
        enparalelovzlavip: data['$enparalelovzlavip'],
        binancep2p: data['$binancep2p']
      };

      res.json(dolarData);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al obtener los datos del dólar' });
    });
}

module.exports = consultarDolar;



