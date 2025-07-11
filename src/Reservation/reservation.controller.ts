import { Response } from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Reservation } from "./reservation.entity.js"
import  { ReservationFilter } from "./reservation.filter.js"
import { validateReservation } from "./reservation.schema.js"
import { Schedule } from "../Schedule/schedule.entity.js"
import { validateSchedule } from "../Schedule/schedule.schema.js"
import  { ScheduleFilter } from "../Schedule/schedule.filter.js"
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js"

const em = orm.em

async function findAll(req: AuthenticatedRequest, res: Response) {
  try {
    const filter: ReservationFilter = req.query as any
    const reservations = await em.find(Reservation, filter, {
      populate: ["user"],
    })
    res.status(200).json({ message: "Found all reservations", data: reservations })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const reservation = await em.findOneOrFail(Reservation, { _id }, { populate: ["user"] })
    res.status(200).json({ message: "found reservation", data: reservation })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: AuthenticatedRequest, res: Response) {
  try {

    
    // 1. Validar body completo con Zod primero
    const validationResult = validateReservation(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message, errors: validationResult.error.errors })
    }

    // 2. Ahora que sabemos que es válido, usamos los datos validados
    const data = validationResult.data
    const datetime = data.datetime
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + 7) // max 7 días

    if (datetime <= now) {
      return res.status(400).json({ message: "The datetime must be in the future" })
    }

    if (datetime > maxDate) {
      return res.status(400).json({ message: "The datetime must be within the next 7 days" })
    }

    // 3. Buscar schedule
    const filter: ScheduleFilter = { datetime } as any

    let schedule = await em.findOne(Schedule, filter)

    if (!schedule) {
      // Convertir Date de vuelta a string para validateSchedule
      const datetimeString = datetime.toISOString();
      
      const scheduleValidated = validateSchedule({ datetime: datetimeString })
      if (!scheduleValidated.success) {

        return res.status(400).json({ message: scheduleValidated.error.message })
      }

      schedule = em.create(Schedule, {
        datetime, // ✅ Usar el Date object para la entidad
        estimatedTime: scheduleValidated.data.estimatedTime,
        toleranceTime: scheduleValidated.data.toleranceTime,
        capacityLeft: scheduleValidated.data.capacityLeft - data.people,
      })
      
      await em.persistAndFlush(schedule)
      
    } else {

      if (schedule.capacityLeft < data.people) {

        return res.status(400).json({ message: "Not enough capacity" })
      }
    
      schedule.capacityLeft -= data.people
      
      await em.flush()
    }

    // 4. Verificar si el usuario ya tiene reserva pendiente
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const userId = req.user.id
    
    let reservation = await em.findOne(Reservation, {
      user: userId,
      state: "Pending",
    })
    

    if (reservation) {
      return res.status(400).json({ message: "User already has a reservation pending" })
    }

    // 5. Crear reserva - use references for user and schedule
    reservation = em.create(Reservation, {
      user: em.getReference("User", userId),
      state: "Pending",
      people: data.people,
      datetime,
      schedule: schedule.id,
    })


    await em.flush()

    res.status(201).json({ message: "Reservation created", data: reservation })

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const userId = req.user.id

    const id = req.params.id
    const reservationToUpdate = await em.findOneOrFail(Reservation, { id }, { populate: ["user"] })

    // When using wrapped references, we need to access the user ID differently
    const reservationUserId = reservationToUpdate.user.id

    // Verificar si la reserva pertenece al usuario logeado
    if (reservationUserId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your reservation" })
    }

    em.assign(reservationToUpdate, req.body)
    await em.flush()

    return res.status(200).json({ message: "Reservation updated", data: reservationToUpdate })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    
    // Validar que el ID sea válido
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    let _id;
    try {
      _id = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid reservation ID format' });
    }

    // Buscar la reserva primero
    const reservation = await em.findOne(Reservation, { _id });
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Verificar que la reserva pertenece al usuario (si no es admin)
    const reservationUserId = reservation.user?.id || reservation.user;

    
    if (req.user.userType !== 'admin' && reservationUserId !== req.user.id) {

      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Restaurar capacidad del schedule
    if (reservation.schedule) {

  
  // Obtener el ID del schedule
  let scheduleId;
  if (typeof reservation.schedule === 'string') {
    scheduleId = reservation.schedule;
  } else if (reservation.schedule.id) {
    scheduleId = reservation.schedule.id;
  } else if (reservation.schedule._id) {
    scheduleId = reservation.schedule._id.toString();
  }
  
  
  if (scheduleId) {
    try {
      // Convertir a ObjectId si es necesario
      const objectId = new ObjectId(scheduleId);
      const schedule = await em.findOne(Schedule, { _id: objectId });

      
      if (schedule) {
        schedule.capacityLeft += reservation.people;

        await em.flush(); // Guardar los cambios
      }
    } catch (error) {

    }
  }
}

    await em.removeAndFlush(reservation);

    
    res.status(200).json({ message: "Reservation canceled successfully", data: reservation });
    
  } catch (error: any) {

    res.status(500).json({ message: error.message });
  }
}
// Obtener reservas del usuario autenticado
async function findByUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.id;

    const now = new Date()
    const expiredReservations = await em.find(Reservation, {
    user: userId,
    state: "Pending",
    datetime: { $lte: now }
  })

  for (const reservation of expiredReservations) {
    reservation.state = "Completed"
  }
  if (expiredReservations.length > 0) {
    await em.flush()
  }
   const reservations = await em.find(Reservation, { user: userId }, { populate: ['schedule'] })
  res.status(200).json({ message: 'Reservations found', data: reservations })
    

    
    res.status(200).json({ 
      message: 'Reservations found', 
      data: reservations 
    });
    
  } catch (error: any) {

    res.status(500).json({ message: error.message });
  }
}

// Obtener solo la reserva pendiente del usuario
async function findPendingByUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.id;
    const pendingReservation = await em.findOne(Reservation, { 
      user: userId,
      state: 'Pending'
    });
    
    res.status(200).json({ 
      message: 'Pending reservation found', 
      data: pendingReservation 
    });
    
  } catch (error: any) {

    res.status(500).json({ message: error.message });
  }
}


export { findAll, findOne, add, update, remove, findByUser, findPendingByUser }


