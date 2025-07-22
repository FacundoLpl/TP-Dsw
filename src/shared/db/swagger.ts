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
            user: { type: "string" },
            status: { type: "string", enum: ["Pending", "Completed", "Cancelled"] },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "number" },
                },
              },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            cart: { type: "string" },
            total: { type: "number" },
            status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
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
                },
                imageUrl: {
                type: "string",
                description: "URL de la imagen",
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
            user: { type: "string" },
            date: { type: "string", format: "date-time" },
            people: { type: "number" },
          },
        },
        Schedule: {
          type: "object",
          properties: {
            id: { type: "string" },
            day: { type: "string" },
            openTime: { type: "string" },
            closeTime: { type: "string" },
          },
        },
        ShipmentType: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            cost: { type: "number" },
          },
        },
       User: {
  type: "object",
  required: ["dni", "firstName", "lastName", "userType", "email", "password"],
  properties: {
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
    },
    password: {
      type: "string",
      minLength: 6,
      description: "Contraseña (mínimo 6 caracteres)",
    },
    address: {
      type: "string",
      nullable: true,
      description: "Dirección del usuario (opcional)",
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
