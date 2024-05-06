# Propuesta TP DSW

### Integrantes
|Legajo|Apellido y Nombres|
|:-|:-|
| 48347 | Cantaberta Facundo |
| 49641 | Battistoni Maria Paz |
| 48889 | Carballo Abril |
| 47881 | Alfaro Bautista |
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
Usuario "*"--"1" Reserva
Horario "*"--"1" Reserva
class Envio{
+String horaEntrega
+String direccion
}
class Pedido{
+Integer nroPedido
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
class Reserva{
+String nroReserva
+Integer cantPersona}
```

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Producto<br>3. CRUD Horario<br>4. CRUD TipoPago|
|CRUD dependiente|1. CRUD Reserva<br>2. CRUD Pedido|
|Listado<br>+<br>detalle| 1. Listado de pedidos filtrado por dia y forma de pago => detalle muestra el total a pagar y productos incluidos <br> 2. Listado de reservas filtrado por rango de fecha, muestra fecha y horario y nombre del cliente => detalle muestra datos completos del cliente y cantidad de personas|
|CUU/Epic|1. -|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD LineaPedido<br>2. CRUD Envio|
|CUU/Epic|1. -<br>2. -<br>3. -|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. - <br>2. -|
|CUU/Epic|1. -<br>2. -|
|Otros|1. -|

