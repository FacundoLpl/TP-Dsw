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
    console.log('🎯 === RESERVATION CONTROLLER START ===');
    console.log('🔍 Raw req.body:', req.body);
    console.log('🔍 req.body keys:', Object.keys(req.body));
    console.log('🔍 datetime value:', req.body.datetime);
    console.log('🔍 typeof datetime:', typeof req.body.datetime);
    console.log('🔍 datetime constructor:', req.body.datetime?.constructor?.name);
    
    // 1. Validar body completo con Zod primero
    const validationResult = validateReservation(req.body)
    if (!validationResult.success) {
      console.log('❌ ZOD VALIDATION FAILED - SENDING 400');
      console.log('❌ Validation errors:', validationResult.error.errors);
      return res.status(400).json({ message: validationResult.error.message, errors: validationResult.error.errors })
    }
    console.log('✅ Validation passed, data:', validationResult.data); 
    console.log('🔍 Checking availability for datetime:', validationResult.data.datetime);

    // 2. Ahora que sabemos que es válido, usamos los datos validados
    const data = validationResult.data
    const datetime = data.datetime
    console.log('🔍 Using validated datetime:', datetime);
    console.log('🔍 Datetime type:', typeof datetime);

    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + 7) // max 7 días
    console.log('🔍 Current time:', now);
    console.log('🔍 Max allowed date:', maxDate);
    console.log('🔍 Requested datetime:', datetime);

    if (datetime <= now) {
      console.log('❌ DATETIME IN PAST - SENDING 400');
      return res.status(400).json({ message: "The datetime must be in the future" })
    }

    if (datetime > maxDate) {
      console.log('❌ DATETIME TOO FAR - SENDING 400');
      return res.status(400).json({ message: "The datetime must be within the next 7 days" })
    }

    console.log('✅ Datetime validation passed');

    // 3. Buscar schedule
    const filter: ScheduleFilter = { datetime } as any
    console.log('🔍 Searching schedule with filter:', filter);
    
    let schedule = await em.findOne(Schedule, filter)
    console.log('🔍 Schedule found:', schedule);

    if (!schedule) {
      console.log('🔍 No schedule found, creating new one');
      
      // ✅ SOLUCIÓN: Convertir Date de vuelta a string para validateSchedule
      const datetimeString = datetime.toISOString();
      console.log('🔍 Converting datetime to string for validation:', datetimeString);
      
      const scheduleValidated = validateSchedule({ datetime: datetimeString })
      if (!scheduleValidated.success) {
        console.log('❌ SCHEDULE VALIDATION FAILED - SENDING 400');
        console.log('❌ Schedule validation errors:', scheduleValidated.error.errors);
        return res.status(400).json({ message: scheduleValidated.error.message })
      }

      console.log('✅ Schedule validation passed:', scheduleValidated.data);

      schedule = em.create(Schedule, {
        datetime, // ✅ Usar el Date object para la entidad
        estimatedTime: scheduleValidated.data.estimatedTime,
        toleranceTime: scheduleValidated.data.toleranceTime,
        capacityLeft: scheduleValidated.data.capacityLeft - data.people,
      })
      
      console.log('🔍 Created schedule object:', schedule);
      
      await em.persistAndFlush(schedule)
      console.log('✅ Schedule persisted successfully');
      
    } else {
      console.log('🔍 Schedule exists, checking capacity');
      console.log('🔍 Current capacity left:', schedule.capacityLeft);
      console.log('🔍 Requested people:', data.people);
      
      if (schedule.capacityLeft < data.people) {
        console.log('❌ NOT ENOUGH CAPACITY - SENDING 400');
        return res.status(400).json({ message: "Not enough capacity" })
      }
      
      schedule.capacityLeft -= data.people
      console.log('🔍 Updated capacity left:', schedule.capacityLeft);
      
      await em.flush()
      console.log('✅ Schedule capacity updated successfully');
    }

    // 4. Verificar si el usuario ya tiene reserva pendiente
    if (!req.user || !req.user.id) {
      console.log('❌ NO USER AUTHENTICATION - SENDING 401');
      return res.status(401).json({ message: "Authentication required" })
    }

    const userId = req.user.id
    console.log('🔍 Checking existing reservations for user:', userId);
    
    let reservation = await em.findOne(Reservation, {
      user: userId,
      state: "Pending",
    })
    
    console.log('🔍 Existing pending reservation:', reservation);

    if (reservation) {
      console.log('❌ USER HAS PENDING RESERVATION - SENDING 400');
      return res.status(400).json({ message: "User already has a reservation pending" })
    }

    console.log('✅ No pending reservations found, proceeding to create');

    // 5. Crear reserva - use references for user and schedule
    console.log('🔍 Creating reservation with data:');
    console.log('  - user:', userId);
    console.log('  - state: Pending');
    console.log('  - people:', data.people);
    console.log('  - datetime:', datetime);
    console.log('  - schedule:', schedule.id);
    
    reservation = em.create(Reservation, {
      user: em.getReference("User", userId),
      state: "Pending",
      people: data.people,
      datetime,
      schedule: schedule.id,
    })

    console.log('🔍 Reservation object created:', reservation);

    await em.flush()
    console.log('✅ Reservation persisted successfully');

    console.log('🎯 SENDING SUCCESS RESPONSE');
    res.status(201).json({ message: "Reservation created", data: reservation })
    console.log('🎯 SUCCESS RESPONSE SENT');

  } catch (error: any) {
    console.log('💥 CONTROLLER ERROR:', error);
    console.log('💥 ERROR MESSAGE:', error.message);
    console.log('💥 ERROR STACK:', error.stack);
    console.log('💥 ERROR NAME:', error.name);
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
    console.log('🔍 DELETE request - Removing reservation with ID:', req.params.id);
    console.log('🔍 User requesting:', req.user.id);
    
    // Validar que el ID sea válido
    if (!req.params.id || req.params.id === 'undefined') {
      console.log('❌ Invalid reservation ID');
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    let _id;
    try {
      _id = new ObjectId(req.params.id);
      console.log('✅ Valid ObjectId created:', _id);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ message: 'Invalid reservation ID format' });
    }

    // Buscar la reserva primero
    const reservation = await em.findOne(Reservation, { _id });
    console.log('🔍 Found reservation:', reservation);
    
    if (!reservation) {
      console.log('❌ Reservation not found');
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Verificar que la reserva pertenece al usuario (si no es admin)
    const reservationUserId = reservation.user?.id || reservation.user;
    console.log('🔍 Reservation user ID:', reservationUserId);
    console.log('🔍 Current user ID:', req.user.id);
    
    if (req.user.userType !== 'admin' && reservationUserId !== req.user.id) {
      console.log('❌ User not authorized to cancel this reservation');
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Restaurar capacidad del schedule
    if (reservation.schedule) {
  console.log('🔍 Reservation schedule:', reservation.schedule);
  
  // Obtener el ID del schedule
  let scheduleId;
  if (typeof reservation.schedule === 'string') {
    scheduleId = reservation.schedule;
  } else if (reservation.schedule.id) {
    scheduleId = reservation.schedule.id;
  } else if (reservation.schedule._id) {
    scheduleId = reservation.schedule._id.toString();
  }
  
  console.log('🔍 Schedule ID to find:', scheduleId);
  
  if (scheduleId) {
    try {
      // Convertir a ObjectId si es necesario
      const objectId = new ObjectId(scheduleId);
      const schedule = await em.findOne(Schedule, { _id: objectId });
      console.log('🔍 Found schedule:', schedule);
      
      if (schedule) {
        schedule.capacityLeft += reservation.people;
        console.log('🔍 Restored schedule capacity to:', schedule.capacityLeft);
        await em.flush(); // Guardar los cambios
      }
    } catch (error) {
      console.log('❌ Error converting to ObjectId:', error);
    }
  }
}

    await em.removeAndFlush(reservation);
    console.log('✅ Reservation removed successfully');
    
    res.status(200).json({ message: "Reservation canceled successfully", data: reservation });
    
  } catch (error: any) {
    console.log('💥 Error removing reservation:', error);
    console.log('💥 Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
}
// Obtener reservas del usuario autenticado
async function findByUser(req: AuthenticatedRequest, res: Response) {
  try {
    console.log('🔍 Finding reservations for user:', req.user.id);
    
    const userId = req.user.id;
    const reservations = await em.find(Reservation, { 
      user: userId 
    }, {
      populate: ['schedule'] // Para obtener info del schedule si la necesitas
    });
    
    console.log('✅ Found reservations:', reservations.length);
    
    res.status(200).json({ 
      message: 'Reservations found', 
      data: reservations 
    });
    
  } catch (error: any) {
    console.log('💥 Error finding reservations:', error);
    res.status(500).json({ message: error.message });
  }
}

// Obtener solo la reserva pendiente del usuario
async function findPendingByUser(req: AuthenticatedRequest, res: Response) {
  try {
    console.log('🔍 Finding pending reservation for user:', req.user.id);
    
    const userId = req.user.id;
    const pendingReservation = await em.findOne(Reservation, { 
      user: userId,
      state: 'Pending'
    });
    
    console.log('✅ Pending reservation:', pendingReservation);
    
    res.status(200).json({ 
      message: 'Pending reservation found', 
      data: pendingReservation 
    });
    
  } catch (error: any) {
    console.log('💥 Error finding pending reservation:', error);
    res.status(500).json({ message: error.message });
  }
}


export { findAll, findOne, add, update, remove, findByUser, findPendingByUser }


