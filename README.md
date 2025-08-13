# Propuesta TP DSW

### Integrantes

| Legajo | Apellido y Nombres   |
| :----- | :------------------- |
| 48347  | Cantaberta Facundo   |
| 49641  | Battistoni Maria Paz |
| 48889  | Carballo Abril       |
| 47881  | Alfaro Bautista      |

### Repositorios

# BackEnd

- https://github.com/FacundoLpl/TP-Dsw

# FrontEnd

- https://github.com/FacundoLpl/FrontEnd-TPdsw

## 1.Tema

### Descripción

Para el trabajo decidimos realizar un sistema relacionado con el sector gastronomico. Seria una aplicacion pensada para que la utilicen en bares, restaurantes, u otros establecimientos similares. Alguna de las opciones que permite hacer serian: hacer reservas y pedidos, indicar metodos de pago, llevar registro de pedidos y turnos disponibles, aceptar reseñas, entre otras cosas.
El sitio estará diseñado para admitir diferentes niveles de usuarios, entre ellos cliente, mozo y administrador.

### Modelo

```mermaid
---
title: Class Diagram
---
classDiagram

%% Relaciones
User "1" -- "*" Cart
User "1" -- "*" Reservation
User "*" -- "1" Schedule
Cart "1" -- "*" Order
Cart "*" -- "0..1" ShipmentType
Order "*" -- "1" Product
Product "*" -- "1" Category
Reservation "*" -- "1" Schedule
Product "1" -- "*" Review

%% Clases
class User {
  +string dni
  +string firstName
  +string lastName
  +string userType
  +string email
  +string password
  +string address
}

class Cart {
  +string state
  +number total
  +string? deliveryType
  +string? deliveryAddress
  +string? paymentMethod
  +string? contactNumber
  +string? additionalInstructions
}

class Order {
  +number quantity
  +number subtotal
  +string? comment
  +string? productName
}

class Product {
  +string name
  +number price
  +number stock
  +string? description
  +string? imageUrl
  +string state
}

class Category {
  +string name
}

class ShipmentType {
  +number estimatedTime
  +string type
}

class Reservation {
  +string state
  +number people
  +Date datetime
}

class Schedule {
  +Date datetime
  +number estimatedTime
  +number toleranceTime
  +number capacityLeft
}

class Review {
  +number rating
  +string comment
  +"Active"|"Archived" state
}

```

## 2. Alcance Funcional

Aprobación Directa
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD de Tipos de Envio (ShipmentType)<br>2. CRUD de Usuarios (User)<br>3. Crud de Categorias de Producto (Category)|
|CRUD dependiente|1.CRUD Pedidos (Order)<br>2. CRUD de Carritos (Cart)<br>3. CRUD de Productos (Product)<br>4. CRUD de Reservas (Reservation)|
|Listado + Detalle|1. Listado de productos por categoría con filtros: nombre, categoría y precio. Incluye descripción, imagen, precio, stock.|
|CUU/Epic|1.Completar un carrito con productos seleccionados. -<br>2.Realizar una reserva con selección de día, hora y cantidad de personas.|

### Alcance Adicional Voluntario


| Req      | Detalle       |
| :------- | :------------ |
| Listados | 1. Listado de carritos completados por el usuario, con detalle de fecha, productos, cantidades, tipo de envío, forma de pago, estado, y opción de   cancelar si está dentro del plazo.- |
| CUU/Epic | 1. Cancelar un carrito<br>2. Envio del carrito-<br>3.Crear una review a un producto post-compra |

### 3. Instrucciones de instalacion
a. Clona este repositorio en tu máquina local:
git clone https://github.com/FacundoLpl/TP-Dsw.git

b. Instalar las dependencias usando pnpm:
pnpm install

c. Crea una cuenta en MongoDB Atlas si aún no tienes una.
d. Crea un clúster en MongoDB Atlas.

e. Crea un archivo .env y agrega la configuración de tu conexión a MongoDB Atlas en el archivo .env:
MONGO_DB=nombre_de_tu_base_de_datos
MONGO_URI=tu_URI_de_conexión_a_MongoDB_Atlas

f. Ejecutar comando:
pnpm run start:dev

La aplicación estará disponible en http://localhost:3000

### 4. Documentación de la API
http://localhost:3000/api-docs/

### 5. Playlist de vistas del cliente, mozo y admin
Puedes ver las vistas del cliente y admin en nuestra playlist de YouTube:
https://www.youtube.com/watch?v=weAU8VJpBGo&list=PLf6CHWHo-JCBbGxIeUZTRqLe3IcO5Srze&ab_channel=FacundoCantaberta