import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Reservation } from "./reservation.entity.js"
import { ReservationFilter } from "./reservation.filter.js"
import { validateReservation } from "./reservation.schema.js"

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
                  datetime: req.body.datetime
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