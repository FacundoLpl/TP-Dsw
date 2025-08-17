import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Restaurante UTN",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    servers: [{ url: "http://localhost:3000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Cart: {
          type: "object",
          properties: {
            id: { type: "string" },
            state: { type: "string" },
            total: { type: "number" },
            deliveryType: { type: "string", nullable: true },
            deliveryAddress: { type: "string", nullable: true },
            paymentMethod: { type: "string", nullable: true },
            contactNumber: { type: "string", nullable: true },
            additionalInstructions: { type: "string", nullable: true },
            shipmentType: { type: "string", nullable: true },
            user: { type: "string" },
            orders: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            products: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            quantity: { type: "number" },
            subtotal: { type: "number" },
            comment: { type: "string", nullable: true },
            productName: { type: "string", nullable: true },
            product: { type: "string" },
            cart: { type: "string" },
          },
        },
        Product: {
          type: "object",
          required: ["name", "price", "stock", "category", "state"],
          properties: {
            id: {
              type: "string",
              description: "ID único del producto",
            },
            name: {
              type: "string",
              description: "Nombre del producto",
            },
            price: {
              type: "number",
              description: "Precio del producto",
            },
            stock: {
              type: "number",
              description: "Cantidad disponible",
            },
            description: {
              type: "string",
              description: "Descripción del producto",
              nullable: true,
            },
            imageUrl: {
              type: "string",
              description: "URL de la imagen",
              nullable: true,
            },
            category: {
              type: "string",
              description: "ID de la categoría asociada",
            },
            state: {
              type: "string",
              enum: ["Active", "Archived"],
              description: "Estado del producto",
            },
          },
        },
        Reservation: {
          type: "object",
          properties: {
            id: { type: "string" },
            state: {
              type: "string",
              enum: ["Completed", "Pending", "Canceled"],
            },
            user: { type: "string" },
            people: { type: "number" },
            datetime: { type: "string", format: "date-time" },
            schedule: { type: "string" },
          },
        },
        Schedule: {
          type: "object",
          properties: {
            id: { type: "string" },
            datetime: { type: "string", format: "date-time" },
            estimatedTime: { type: "number" },
            toleranceTime: { type: "number" },
            capacityLeft: { type: "number" },
            reservations: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        ShipmentType: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            estimatedTime: { type: "number" },
          },
        },
        User: {
          type: "object",
          required: ["dni", "firstName", "lastName", "userType"],
          properties: {
            id: { type: "string" },
            dni: {
              type: "string",
              description: "DNI del usuario",
            },
            firstName: {
              type: "string",
              description: "Nombre del usuario",
            },
            lastName: {
              type: "string",
              description: "Apellido del usuario",
            },
            userType: {
              type: "string",
              enum: ["Admin", "Client", "Mozo"],
              description: "Rol del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              nullable: true,
            },
            password: {
              type: "string",
              description: "Contraseña (mínimo 6 caracteres)",
              nullable: true,
            },
            address: {
              type: "string",
              description: "Dirección del usuario (opcional)",
              nullable: true,
            },
            carts: {
              type: "array",
              items: { type: "string" },
            },
            reservations: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único del usuario",
            },
            dni: {
              type: "string",
              description: "DNI del usuario",
            },
            firstName: {
              type: "string",
              description: "Nombre del usuario",
            },
            lastName: {
              type: "string",
              description: "Apellido del usuario",
            },
            userType: {
              type: "string",
              enum: ["Admin", "Client", "Mozo"],
              description: "Rol del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              nullable: true,
            },
            address: {
              type: "string",
              nullable: true,
              description: "Dirección del usuario (opcional)",
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.routes.{js,ts}"], // tus rutas con comentarios @swagger
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
