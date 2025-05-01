import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Reservation } from "./reservation.entity.js"
import { ReservationFilter } from "./reservation.filter.js"
import { validateReservation } from "./reservation.schema.js"
import { Schedule } from "../Schedule/schedule.entity.js"
import { validateSchedule } from "../Schedule/schedule.schema.js"
import { ScheduleFilter } from "../Schedule/schedule.filter.js"

const em = orm.em // entity manager funciona como un repository de todas las clases


async function findAll(req: Request, res: Response) {
  try {
      const user = req.user;
      const query = req.query;
      const filter: any = {};

      const validStates = ['Pending', 'Completed', 'Canceled'] as const;
      const state = typeof query.state === 'string' && validStates.includes(query.state as any)
          ? query.state
          : undefined;

      const userIdInQuery = typeof query.user === 'string' ? query.user : undefined;

      // Caso 1: Buscar todas las reservas pendientes (sin filtro de usuario)
      if (state === 'Pending' && (!userIdInQuery)) {
          if (user.userType !== 'Admin') {
              return res.status(403).json({ message: 'Only admins can view all pending reservations.' });
          }
      }

      // Caso 2: Buscar reservas pendientes para un usuario específico
      if (state === 'Pending' && userIdInQuery) {
          if (user.userType !== 'admin' && user.id !== userIdInQuery) {
              return res.status(403).json({ message: 'You can only view your own pending reservations.' });
          }
      }

      // Aplicamos los filtros válidos
      if (state) filter.state = state;
      if (userIdInQuery) filter.user = userIdInQuery;

      const reservations = await em.find(Reservation, filter, {
          populate: ['user'],
      });

      res.status(200).json({ message: 'Found reservations', data: reservations });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}


async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const reservation = await em.findOneOrFail(Reservation, { _id },
            {populate: ['user']} 
            ) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found reservation', data: reservation})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

    async function add(req: Request, res: Response) {
        try {
          const user = req.user
            const validationResult = validateReservation(req.body);
            const datetime = new Date(req.body.datetime); //UTC 
            const filter: ScheduleFilter = { datetime };
            let schedule = await em.findOne(Schedule, filter);
            const now = new Date(Date.now()); // Ya es UTC (pero lo hacemos explícito)
const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // UTC + 7 días

            maxDate.setDate(maxDate.getDate() + 7); // Sumar 7 días a la fecha actual
            if (datetime <= now) {
                return res.status(400).json({ message: "The datetime must be in the future" });
            }
            
            if (datetime > maxDate) {
                return res.status(400).json({ message: "The datetime must be within the next 7 days" });
            }
            if (!schedule) {
                const scheduleValidated = validateSchedule({
                    datetime: req.body.datetime
            })
            if (!scheduleValidated.success) {
                return res.status(400).json({ message: scheduleValidated.error.message });
            }
            else {
                schedule = em.create(Schedule, {
                    datetime: req.body.datetime,
                    estimatedTime: scheduleValidated.data.estimatedTime,
                    toleranceTime: scheduleValidated.data.toleranceTime,
                    capacityLeft: scheduleValidated.data.capacityLeft - req.body.people
                });
                await em.persistAndFlush(schedule);
            }}
            else {
                const capacityLeft = schedule.capacityLeft
                if (capacityLeft < req.body.people) {
                    return res.status(400).json({ message: "Not enough capacity" });
                }
                else {
                schedule.capacityLeft -= req.body.people;
                await em.flush();}
            }
            if (!validationResult.success) 
                { return res.status(400).json({ message: validationResult.error.message });}
            let reservation = await em.findOne(Reservation, {
                user: user.id,
                state: "Pending",
              });
              
              if (reservation) { 
                res.status(400).json({ message: "User already has a reservation pending" });}
              else {  
                reservation = em.create(Reservation, {
                    user: req.user.id,
                    state: "Pending",
                    people: req.body.people,
                    datetime: req.body.datetime,
                    schedule: schedule.id
                  });
                  
            await em.flush();
            res.status(201).json({ message: 'reservation created', data: reservation });}
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    


    async function update(req: Request, res: Response) {
        try {
          const userId = req.user?.id;
      
          if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      
          const id = req.params.id;
          const reservationToUpdate = await em.findOneOrFail(Reservation, { id }, { populate: ['user'] });
      
          // Verificar si la reserva pertenece al usuario logeado
          if (reservationToUpdate.user.id !== userId) {
            return res.status(403).json({ message: 'Forbidden: Not your reservation' });
          }
      
          em.assign(reservationToUpdate, req.body);
          await em.flush();
      
          return res.status(200).json({ message: 'Reservation updated', data: reservationToUpdate });
        } catch (error: any) {
          return res.status(500).json({ message: error.message });
        }
      }
      async function remove(req: Request, res: Response) {
        try {
          const userId = req.user?.id;
          const user = req.user
      
          if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      
          const _id = new ObjectId(req.params.id);
          const reservation = await em.findOneOrFail(Reservation, { _id }, { populate: ['user'] });
      
          // Verificar si la reserva pertenece al usuario logeado
          if ((reservation.user.id !== userId ) && (user.userType != 'Admin') ){
            return res.status(403).json({ message: 'Forbidden: Not your reservation' });
          }

          await em.removeAndFlush(reservation);
          return res.status(200).json({ message: 'Reservation removed', data: reservation });
        } catch (error: any) {
          return res.status(500).json({ message: error.message });
        }
      }
export { findAll, findOne, add, update, remove}