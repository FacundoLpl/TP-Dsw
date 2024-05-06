# Propuesta TP DSW

## Grupo
### Integrantes
* 48347 - Cantaberta Facundo
* 49641 - Battistoni Maria Paz
* 48889 - Carballo Abril
* 47881 - Alfaro Bautista
### Repositorios
* https://github.com/FacundoLpl/TP-Dsw

## Tema
### Descripción
Para el trabajo decidimos realizar un sistema relacionado con el sector gastronomico. Seria una aplicacion pensada para que la utilicen en bares, restaurantes, u otros establecimientos similares. Alguna de las opciones que permite hacer serian: hacer reservas, utilizar distintos perfiles para cada mozo, indicar metodos de pago, realizar el pago mediante la aplicacion, llevar registro de pedidos y turnos disponibles, aceptar opiniones, entre otras cosas.
El sitio estará diseñado para admitir diferentes niveles de usuarios, entre ellos cliente, mozo y encargado.

### Modelo
```mermaid
---
title: Class Diagram
---
classDiagram
TipoPago "*"--"1" Pedido
Envio "0..1"--"1" Pedido
LineaPedido "1"--*"1..*" Pedido
Producto "*"--"1" LineaPedido
Usuario "1"--"1" Horario
Usuario "*"--"0..1" Pedido
Usuario "*"--"1" Pedido
class Envio{
+String horaEntrega
+String direccion
}
class Pedido{
+Integer total
+String fecha
+Integer nroMesa
}
class TipoPago{
+String tipo_Pago
}
class Usuario{
+Integer dni
+String nombre
+String apellido
+String tipoUsuario
}

class LineaPedido{
+Integer cantidad
+Number subtotal
}
class Producto{
+String nombre
+String descripcion
+Number precio
+Integer stock
}
class Horario{
+String hs_Desde
+String hs_Hasta
+String dia
+Integer cupo
}

https://drive.google.com/file/d/1Td8cQJW3CoufiX9eqGsaDqw5zLub8Lea/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

