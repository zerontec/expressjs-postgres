const {Propiedad} = require('../db')
const {Op} = require("sequelize");


const createPropietir = async (req, res, next) => {
    try {
        const newProperti = {

            type: req.body.type,
            address: req.body.address,
            price: req.body.price,
            asesor: req.body.asesor,
            image:req.body.image
        }

        await Propiedad.create(newProperti)
        res.status(200).json(newProperti );

    } catch (err) {
        res.status(500).send(err)


    }


}


const getAllPropierti = async (req, res, next) => {
    try {
     console.log('entramos a propiedad')
      const data = await Propiedad.findAll({
        // attributes: [ "type", "address", "price", "asesor"],
      }
       
      );
  
    res.status(200).json( data ) 
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

const findOne = async (req, res, next) => {


    const id = req.params.id;

    Propiedad.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `No se encuentra propiedad con id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error con propiedad id =" + id
        });
      });
  };




    // const id = req.params.id
    // let propiedad

    // try {
    //     propiedad = await Propiedad.findByPk(id)
    //     if (propiedad) {
    //         res.status(200).json(propiedad)

    //     } else {

    //         res.status(404).json({message: 'No Encontrado'})
    //     }


    // } catch (err) {

    //     res.status(500).json({message: 'Erro con id '})


    // }

    //BUSQUEDA POR QUERY 
    // try {
    //     const { query } = req;
    //     const propiedad = await Propiedad.findOne({
    //       where: {
    //         id: query.id,
    //       },
    //     });
    //     res.status(200).json(propiedad);
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json("Error al cargar departamento");
    //   }
    // }


/** */

// const findAll = async (req, res, next) => {
//     const type = req.query.type;
//     try {
//         let condition = type ? {
//             type: {
//                 [Op.iLike]: `%${type}%`
//             }
//         } : null
//         Propiedad.findAll({where: condition})
//         res.status(200).json(condition)

//     } catch (err) {
//         res.status(500).send({
//             message: err.message || ' algo salio mal '
//         })


//     }


// }




const putPropierti = async (req, res, next) => {
  const {  type, address, price,asesor } = req.body;
  const id = req.params.id
try{
  // const { type, address, price,asesor } = update
  if (!type || !address || !price || !asesor ) {

    return res.status(404).send("fill in all the data")
  }
  const propiedad = await Propiedad.findOne({
                        where: {id:id}
                     })
  await propiedad.update(
    { type:type,address:address, price:price, asesor:asesor},
   
  );
  return res.status(200).send("La propiedad ha sido Actualizada");
  }catch(err){

    console.log(err)
  }



// const id = req.params.id
//   const {type,address,price, asesor} = req.body

//         try{            
//                 const propiedad = await Propiedad.findOne({
//                     where: {id:id}
//                 })
//                 const response = await propiedad.update({
//                    type,
//                    address,
//                    price,
//                    asesor
//                 })
//              res.status(200).json( response)
                
//             }catch(err){
//               res.status(500).json({mesage:"Error con propiedad" ,err})
//               console.log(err)
//             }
}


const deleteProperti= async(req, res,next)=> {
let id = req.params.id;

    try{
if(id){

    const data = await Propiedad.findOne({
        where:{id:id},
    });
    if(data){
        await data.destroy();
        res.status(200).json({message:'Propiedad borrada correctamente '})

    }else{
      res.status(400).json({message:'Error con id de propiedad '})
    }
}




    }catch(err){
res.status(500).json(err)


    }


}


module.exports = {
    createPropietir,
    // findAll,
    findOne,
    putPropierti,
    deleteProperti,
    getAllPropierti

}
