const{Supplier}= require('../db');
const{Op} = require('sequelize')
const createSupplier = async (req, res, next) => {
    try {
      const { name, address, rif, phoneNumber } = req.body;
  
      const existingSupplier = await Supplier.findOne({ where: { rif } });
  
      if (existingSupplier) {
        return res.status(409).json({ message: 'El proveedor ya existe' });
      }
  
      const newSupplier = await Supplier.create({
        name,
        address,
        rif,
        phoneNumber
      });
  
      res.status(200).json(newSupplier);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al crear el proveedor' });
    }
  };
  



  const editSupplier = async (req, res, next) => {
    const id = req.params.id;
  
    const { name, identification, telf, address } = req.body;
  
    try {
      const supplier= await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(401).json({ message: `Proveedor con id ${id} no existe` });
      } else {
        supplier.update(req.body);
        res
          .status(201)
          .json({ message: `customer con ${id} actualizado con exito ` });
      }
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  };

  const findAllSupplier = async (req, res, next) => {
    try {
      const supplier = await Supplier.findAll();
  
      if (supplier.length ===0) {
        return res
          .status(404)
          .json({ message: "no hay informacion que mostrar" });
      } else {
        return res.status(200).json(supplier);
      }
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  };

  const deleteSupplier = async (req, res, next) => {
    let id = req.params.id;
    try {
      const supplier = await Supplier.findByPk(id);
      if (supplier) {
        await supplier.destroy();
        res.status(200).json({ message: "Proveedor borrado con exito" });
      } else {
        res.status(400).json({ message: "No se encontro proveedor  con ID " });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

  const detailSupplier = async(req, res, next)=> {

    try{
    
    const id = req.params.id;
    
        const supplier = await Supplier.findByPk(id);
        if(!supplier){
    
          return res.status(404).json({messague:"no exite proveedor con id " `${id}`})
        }
    
        res.status(201).json(supplier)
     
    
    }catch(err){
    
      res.status(500).json(err)
      next(err)
    
    }
    
    
    }
    
    const searchSupplierByQuery = async (req, res, next) => {
      console.log("Buscando suppliers...");
      const { q } = req.query;
    
      try {
        const suppliers= await Supplier.findAll({
          where: {
            [Op.or]: [
              {
                rif: {
                  [Op.iLike]: `%${q}%`,
                },
              },
              {
                name: {
                  [Op.iLike]: `%${q}%`,
                },
              },
            ],
          },
        });
        console.log("Consulta SQL generada:", suppliers.toString()); // Nueva línea de código
        console.log("Aqui el log", suppliers);
        console.log("q:", suppliers.toString()); // Verificar la consulta
        if (suppliers.length === 0) {
          console.log("No se encontraron análisis.");
          return res.status(404).json({ message: "No se Encontro Proveedor agreguelo" });
        }
    
        res.status(200).json(suppliers);
        console.log(suppliers);
      } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).json(err);
        next(err);
      }
    };
    

  module.exports={
createSupplier,
detailSupplier,
findAllSupplier,
editSupplier,
deleteSupplier,
searchSupplierByQuery

  }
  