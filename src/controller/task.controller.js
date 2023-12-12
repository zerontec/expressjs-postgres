// controllers/tasksController.js
const {
  Task,
  Tecnico,
  Customer,
  User,
  HistorialTareasTerminadas,
  HistorialGeneral,FinishTask
} = require("../db");


// Obtener todas las tareas

const obtenerTodasLasTareas = async (req, res, next) => {
  try {
    const tareas = await Task.findAll({
      include: [
        {
          model: User,
          as: "tecnico",
          attributes: ["id", "name", "email", "telephone"],
        },
        {
          model: Customer,
          attributes: ["id", "name", "email", "address", "telf"],
        },
      ],
    });
    if (tareas.length === 0) {
      return res.status(409).json({ mensaje: "No se encontro informacion" });
    }
    return res.status(200).json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las tareas" });
    next(error);
  }
};

// Obtener una tarea por ID
const obtenerTareaPorId = async (req, res, next) => {
  const id = req.params.id;

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    return res.status(200).json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la tarea" });
    next(error);
  }
};

// Crear una nueva tarea
const crearTarea = async (req, res, next) => {
  const {
    note,
    asignar_tecnico,
    description,
    address,
    estatus,
    tecnico_id,
    cliente_id,
  } = req.body;
  const estadoD = "Por realizar ";
  try {
    let tarea;

    if (asignar_tecnico === true) {
      // Si se indica asignar un técnico, crea la tarea con el técnico asignado
      //   const tecnico_id = tecnico_id; // Supongamos que el ID del técnico está disponible en la solicitud

      tarea = await Task.create({
        cliente_id,
        description,
        estatus: "Pendiente",
        tecnico_id:tecnico_id,
        note: note,
        address: address,
        date: new Date(),
      });
    } else {
      // Si no se indica asignar un técnico, crea la tarea sin asignar un técnico
      tarea = await Task.create({
        cliente_id,
        description,
        estatus: "Pendiente",
        tecnico_id: null,
        note: note,
        address: address,
        date: new Date(),
      });
    }

    return res.status(201).json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la tarea" });
    next(error);
  }
};

// Actualizar una tarea por ID
const actualizarTarea = async (req, res) => {
  const { id } = req.params;
  const { note, description, estatus, tecnico_id, cliente_id } = req.body;

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    tarea.description = description;
    tarea.estatus = estatus;
    tarea.tecnico_id = tecnico_id;
    tarea.cliente_id = cliente_id;
    tarea.note = note;

    await tarea.save();

    return res.status(200).json(tarea);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error al actualizar la tarea" });
  }
};

// Eliminar una tarea por ID
const eliminarTarea = async (req, res, next) => {
  const id = req.params.id;

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    await tarea.destroy();

    res.status(200).json({ message: "Tarea Eliminada con exito " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la tarea" });
    next(error);
  }
};

// Tomar una tarea por un técnico
const tomarTarea = async (req, res, next) => {
  const id = req.params.id;
  const tecnico_id = req.params.tecnico_id;

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    if (tarea.estatus === "En Progreso" || tarea.estatus === "Completada") {
      // Si la tarea ya está en progreso o completada, no se puede tomar
      return res.status(400).json({ mensaje: "La tarea no está disponible para tomar" });
    }

    if (tarea.estatus === "Pendiente") {
      if (!tarea.tecnico_id) {
        // Si la tarea está pendiente y no tiene técnico asignado, cualquier técnico puede tomarla
        tarea.estatus = "En Progreso";
        tarea.tecnico_id = tecnico_id;
        await tarea.save();
      } else if (tarea.tecnico_id.toString() === tecnico_id.toString()) {
        // Si la tarea está pendiente y ya tiene técnico asignado (y es el mismo técnico que está intentando tomarla), permitir que el técnico asignado la tome
        tarea.estatus = "En Progreso";
        await tarea.save();
      } else {
        // Si la tarea está pendiente y ya tiene técnico asignado a otro, no se puede tomar
        return res.status(400).json({ mensaje: "La tarea está asignada a otro técnico" });
      }
    }

    return res.status(200).json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al tomar la tarea" });
    next(error);
  }
};


// Actualizar el estado de una tarea a 'Terminada' por un técnico
// const terminarTarea = async (req, res, next) => {
//   const id = req.params.id;
//   const note = req.body.note;
//   const tecnico_id = req.params.tecnico_id;

//   try {
//     const tarea = await Task.findByPk(id);

//     if (!tarea) {
//       return res.status(404).json({ mensaje: "Tarea no encontrada" });
//     }
//     if (tarea.estatus !== "En Progreso") {
//       return res.status(400).json({ mensaje: "La tarea no está en progreso" });
//     }

//     // Almacena el ID del técnico antes de establecerlo en null
//     const tecnicoId = tarea.tecnico_id;

//     // Crear una entrada en el historial de tareas terminadas
//     const historial = await HistorialTareasTerminadas.create({
//       fechaTerminacion: new Date(),
//       tecnico_id: tecnico_id,
//       tarea_id: id,
//     });

//     const historialGeneral = await HistorialGeneral.create({
//       tecnicoId: tecnico_id,
//       tareaId: historial.id,
//     });

//     // Verifica si hay un técnico antes de intentar remover la tarea
//     if (tarea.tecnico_id) {
//       // Recupera el técnico antes de remover la tarea
//       const tecnico = await User.findByPk(tarea.tecnico_id);

//       if (tecnico) {
//         // Remueve la tarea de la lista de tareas del técnico
//         await tecnico.removeTarea(tarea);
//       }
//     }
//     tarea.estatus = "Terminada";
//     tarea.notaFinal = note;
//     tarea.tecnico_id= tecnicoId
  
//     // Desasocia el técnico antes de guardar la tarea
//     await tarea.setTecnico(null);
//     await tarea.save({

//      tecnicoId

//     });

//     return res.status(200).json(tarea);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: "Error al terminar la tarea" });
//     next(error);
//   }
// };



const terminarTarea = async (req, res, next) => {
  const id = req.params.id;
  const note = req.body.note;
  const tecnico_id = req.params.tecnico_id;
  // const customer = req.body.customer;

  console.log("tecnico", tecnico_id);
  // console.log("Customer", customer)

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    if (tarea.estatus !== "En Progreso") {
      return res
        .status(400)
        .json({ mensaje: "La tarea esta en progreso o finalizada" });
    }

    // Almacena el ID del técnico antes de establecerlo en null
    const tecnicoId = tarea.tecnico_id;
    const clienteId = tarea.cliente_id;
    console.log("ciliente", clienteId);

    // const task = await Task.findByPk(id, { include: Customer });
    // console.log("tas",task.Customer); // Cliente asociado a la tarea

    // Crear una entrada en el historial de tareas terminadas
    const historial = await HistorialTareasTerminadas.create({
      fechaTerminacion: new Date(),
      tecnico_id: tecnico_id,
      tarea_id: id,
      note: tarea.note,
      description: tarea.description,
      address: tarea.address,
      cliente_id: clienteId,
    });

    const historialGeneral = await HistorialGeneral.create({
      tecnicoId: tecnico_id,
      tareaId: historial.id,
    });

    // Verifica si hay un técnico antes de intentar remover la tarea
    if (tarea.tecnico_id) {
      // Recupera el técnico antes de remover la tarea
      const tecnico = await User.findByPk(tecnico_id);

      if (tecnico) {
        // Remueve la tarea de la lista de tareas del técnico
        await tecnico.removeTarea(tarea);
      }
    }

    const saveIdtec = tecnico_id;
    console.log("saveId", saveIdtec);

    tarea.estatus = "Terminada";
    tarea.notaFinal = note;

    tarea.tecnico_id = saveIdtec;
    await tarea.save();

    if ((tarea.status = "Terminada")) {
      const tecnico = await User.findByPk(tecnico_id);

      const finishTask = await FinishTask.create({
        tecnico_id: tecnico_id,
        tareaId: id,
        estatus: tarea.status,
        description: tarea.description,
        cliente_id: tarea.cliente_id,
        note: tarea,
        note,
        date: new Date(),
      });

      // Remueve la tarea de la lista de tareas del técnico
      await tecnico.removeTarea(tarea);

      const eliminarDeLista = await Task.findByPk(id);
      await eliminarDeLista.destroy();
      // Desasocia el técnico antes de guardar la tarea
      //  await tarea.setTecnico(null);
    }

    return res.status(200).json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al terminar la tarea" });
    next(error);
  }
};


const obetenrHistorialTerminada = async (req, res, next) =>{

  try{

    
    const historial = await FinishTask.findAll(




    )
    if(historial.length === 0){

          return res.status(400).json({messague:"No hay informacion que mostrar"})

    }


    res.status(201).json(historial);

  }catch(error){

    res.status(500).json({messague:"Error al traer Historial de tareas "})
  next(error)
  }



}



const obtenerTareasFinalizadasPorId = async (req, res, next)=> {

  const id = req.params.id;

try{
  const tareaFinalizada = await FinishTask.findByPk(id);

  if (!tareaFinalizada) {
    return res.status(404).json({ mensaje: "Tarea no encontrada" });
  }

return res.status(200).json(tareaFinalizada);

}catch(error){


  res.status(500).json({messague:"Error al trae tarea"})

}


}


const obtenerTareasTerminadasTecnicoA = async (req, res, next) => {
  const tecnicoId = req.params.tecnicoId;

  try {
    // Consulta para obtener todas las tareas terminadas del técnico
    const tecnicoConTareasTerminadas = await HistorialTareasTerminadas.findAll( {
 where:{

  tecnico_id:tecnicoId

 },
   
      include: [
        { model: User, as: 'tecnico' },

        
      ],
      include: [
        { model: Customer, as: 'cliente' },

        
      ],
    });

    if (!tecnicoConTareasTerminadas) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }

    return res.status(200).json(tecnicoConTareasTerminadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las tareas terminadas del técnico" });
    next(error);
  }
};


const obtenerTareasTerminadasTecnico = async (req, res, next) => {
  const tecnicoId = req.params.tecnicoId;

  try {
    // Consulta para obtener todas las tareas terminadas del técnico
    const tecnicoConTareasTerminadas = await User.findByPk(tecnicoId, {
      include: [{ model: HistorialTareasTerminadas, as: 'historialTareasTerminadasU',
    
      include: [
        { model: User, as: 'tecnico' },

        
      ],
      include: [
        { model: Customer, as: 'cliente' },

        
      ],
      
    
    
    }],
    });

    if (!tecnicoConTareasTerminadas) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }

    return res.status(200).json(tecnicoConTareasTerminadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las tareas terminadas del técnico" });
    next(error);
  }
};



const obtenerTareasEnProgreso = async (req, res, next) => {
try{
    const tareasprogreso = await Task.findAll({

      where:{

        estatus:"En Progreso"
      }
    })

    if( tareasprogreso.length === 0){

      return res.status(400).json({message:"No hay informacion que mostrar "})
    }

    return res.status(201).json(tareasprogreso)

}catch(error){

  console.error(error);
  res.status(500).json({messague:"Error al obtener las tareas"})
}





}


const obtenerTodasTareasTerminadas = async (req, res, next) => {
  try{
      const tareasTerminadas = await Task.findAll({
  
        where:{
  
          estatus:"Terminada"
          
        },
        include: [
          {
            model: User,
            as: "tecnico",
            attributes: ["id", "name", "email", "telephone"],
          },
        ]
      })
  
      if( tareasTerminadas.length === 0){
  
        return res.status(400).json({message:"No hay informacion que mostrar "})
      }else{
  
      return res.status(201).json(tareasTerminadas)
      }
  
  }catch(error){
  
    console.error(error);
    res.status(500).json({messague:"Error al obtener las tareas"})
  }
  
  
  
  
  
  }




const obtenerTareasPendiente = async (req, res , next) =>{

  try{


    const tareaPendiente = await Task.findAll({

      where: {
        estatus: "Pendiente",
        tecnico_id: null
      },
      include: [
        { model: Customer },
        {
          model: User,
          as: "tecnico",
          attributes: ["id", "name", "email", "telephone"],
        },
      ],
    });


    if(tareaPendiente.length === 0 ){

        return res.status(400).json({messague:"No hay Informacion que mostrar"})

    }

     return res.status(201).json(tareaPendiente);

  }catch(error){

    res.status(500).json({messague:"Error al traer tareas"})
      next(error)
  
  
  }



}



// Cancelar una tarea por un técnico
const cancelarTarea = async (req, res, next) => {
  const id = req.params.id;
  const note = req.body.note;
  const tecnicoId = req.params.id;

  try {
    const tarea = await Task.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    // if (tarea.estatus !== "En Progreso") {
    //   return res.status(400).json({ mensaje: "La tarea no está en progreso" });
    // }
    if(tarea.estatus === "Pendiente" && tarea.tecnico_id === tecnicoId){

      tarea.estatus = "Pendiente";
    tarea.tecnico_id = null; // Liberar la tarea del técnico actual
    tarea.note = note;
    await tarea.save();


    }if(tarea.status === "En Progreso" && tarea.tecnico_id === tecnicoId){
      tarea.estatus = "Pendiente";
      tarea.tecnico_id = null; // Liberar la tarea del técnico actual
      tarea.note = note;
  
      await tarea.save();

    }

    tarea.estatus = "Pendiente";
    tarea.tecnico_id = null; // Liberar la tarea del técnico actual
    tarea.note = note;
    await tarea.save();

    return res.status(200).json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cancelar la tarea" });
    next(error);
  }
};

// //tareas Asignadas

const getTareasAsignadas = async (req, res, next) => {
  const { tecnico_id } = req.params;

  try {
    const tareasAsignadas = await Task.findAll({
      where: { tecnico_id },
      include: [
        {
          model: User,
          as: "tecnico",
          attributes: ["id", "name", "email", "telephone"],
        },
        {
          model: Customer,
          attributes: ["id", "name", "email", "address", "telf"],
        },
      ],


    });
    if (tareasAsignadas.length === 0) {
     return res.status(400).json({ mensaje: "No hay tareas que mostrar " });
    }

    res.status(200).json(tareasAsignadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las tareas asignadas" });
    next(error);
  }
};

// const marcarTareaTerminada = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//       const tarea = await Task.findByPk(id);

//       if (!tarea) {
//           return res.status(404).json({ mensaje: "Tarea no encontrada" });
//       }

//       tarea.estatus = "Terminada";

//       await tarea.save();

//       res.status(200).json(tarea);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ mensaje: "Error al marcar la tarea como terminada" });
//       next(error);
//   }
// };

module.exports = {
  obtenerTareaPorId,
  obtenerTodasLasTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  tomarTarea,
  terminarTarea,
  cancelarTarea,
  getTareasAsignadas,
  obtenerTareasTerminadasTecnico,
  obtenerTareasEnProgreso,
  obtenerTodasTareasTerminadas,
  obtenerTareasPendiente,
  obetenrHistorialTerminada,
  obtenerTareasFinalizadasPorId,
  obtenerTareasTerminadasTecnicoA

};
