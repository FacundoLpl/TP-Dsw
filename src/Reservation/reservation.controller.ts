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


async function findAll(req: Request,res: Response) { 
    try{
        const filter: ReservationFilter = req.query
        const reservations = await em.find(Reservation, filter, {
            populate: [
                'user'
            ]})
        res.status(200).json({message: 'Found all reservations', data: reservations})
    } catch (error: any){
        res.status(500).json({message: error.message})
}}

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
            const validationResult = validateReservation(req.body);
            const datetime = new Date(req.body.datetime);
            const filter: ScheduleFilter = { datetime };
            let schedule = await em.findOne(Schedule, filter);
            const now = new Date();
            const maxDate = new Date(now);
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
            let reservation = await em.findOne( // encuentro reserva
                Reservation,
                { user: req.body.user,
                  state: "Pending"}
              );
              if (reservation) { 
                res.status(400).json({ message: "User already has a reservation pending" });}
              else {  
                reservation = em.create(Reservation, {
                  user: req.body.user,
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
    


    async function update(req: Request,res: Response){
        try {
            const reservation: Reservation = req.body;
              const id = req.params.id
              const reservationToUpdate = await em.findOneOrFail(Reservation, { id });
              em.assign(reservationToUpdate, req.body);
              await em.flush();
              res.status(200).json({ message: "Reservation updated", data: reservationToUpdate });
            } catch (error: any) {
                res.status(500).json({ message: error.message });
  }}
     
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const reservation = em.getReference(Reservation, _id )
        await em.removeAndFlush(reservation)
        res.status(200).json({ message: "Reservation removed", data: reservation })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}
    

export { findAll, findOne, add, update, remove}