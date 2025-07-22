
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { createServer } from 'http';
import { app } from '../app'; 
import { MikroORM } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { User } from '../User/user.entity';
import { Product } from '../Product/product.entity';
import { Category } from '../Category/category.entity'; 
import jwt from 'jsonwebtoken';
import { fetch } from 'undici';
import { Order } from '../Order/order.entity';
import { Cart } from '../Cart/cart.entity';
import { Schedule } from '../Schedule/schedule.entity';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

let server: ReturnType<typeof createServer>;
let url: string;
let orm: MikroORM<MongoDriver>;
const TEST_TIMEOUT = 90000;


// Fix: Use orm.em.getConnection() for MongoDriver, and ensure orm is initialized
async function clearDb() {
    if (!orm) return;
    const client = orm.em.getConnection().getClient();
    await client.db('myapp-test').dropDatabase();
}

async function createUserAndToken() {
  const em = orm.em.fork();

  const user = em.create(User, {
    firstName: 'Test',
    dni: '12345678',
    lastName: 'User',
    userType: 'Client',
    email: 'test@example.com',
    password: 'hashed-password',
    address: "Rivadavia 530",
  });
  await em.persistAndFlush(user);

  const token = jwt.sign({ id: user.id, userType: user.userType }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { user, token };
}

async function createFakeProduct() {
  const em = orm.em.fork();

  const category = em.create(Category, {
    name: 'Categoría test',
  });
  await em.persistAndFlush(category);

  const product = em.create(Product, {
    name: 'Café',
    price: 1000,
    stock: 10,
    category: category,
    state: 'Active',
  });
  await em.persistAndFlush(product);

  return product;
}

describe('POST /api/orders', () => {
    beforeAll(async () => {
        orm = await MikroORM.init<MongoDriver>({
            type: 'mongo',
            clientUrl: 'mongodb://localhost:27017/myapp-test',
            dbName: 'myapp-test',
            entities: [
                User, 
                Product, 
                Category,
                Order,
                Cart,
                Schedule
            ],
            debug: false,
        });

        server = createServer(app);
        await new Promise<void>((resolve) => server.listen(0, resolve));
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 0;
        url = `http://localhost:${port}`;
    }, TEST_TIMEOUT);

    afterAll(async () => {
        await clearDb();
        if (orm) await orm.close(true);
        if (server) server.close();
    }, TEST_TIMEOUT);

    it('✔️ Pedido válido con token → 201', async () => {
        const { token } = await createUserAndToken();
        const product = await createFakeProduct();

        const res = await fetch(`${url}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                products: [{ id: product.id, quantity: 2 }],
                deliveryType: 'local',
            }),
        });

        expect(res.status).toBe(201);
    }, TEST_TIMEOUT);

    it('❌ Sin token → 403', async () => {
        const res = await fetch(`${url}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                products: [],
                deliveryType: 'local',
            }),
        });

        expect(res.status).toBe(403);
    }, TEST_TIMEOUT);

    it('❌ Producto inválido → 400', async () => {
        const { token } = await createUserAndToken();

        const res = await fetch(`${url}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                products: [{ id: 'inexistente', quantity: 2 }],
                deliveryType: 'local',
            }),
        });

        expect(res.status).toBe(400);
    }, TEST_TIMEOUT);
});
