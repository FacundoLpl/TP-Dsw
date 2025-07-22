import { MikroORM } from '@mikro-orm/core';
import { User } from '../User/user.entity';
import { Product } from '../Product/product.entity';
import jwt from 'jsonwebtoken';

export async function createUserAndToken(orm: MikroORM) {
  const em = orm.em.fork();

  const user = em.create(User, {
    dni: '12345678',
    firstName: 'Test',
    lastName: 'User',
    address: "Rivadavia 530",
    email: 'test@example.com',
    password: 'hashed-password',
    userType: 'Admin',
  });

  await em.persistAndFlush(user);

  const secret = process.env.Token || 'default_secret'; // Usás tu variable del .env

  const token = jwt.sign(
    { id: user.id, userType: user.userType },
    secret,
    { expiresIn: '1h' }
  );

  return { user, token };
}

export async function createFakeProduct(orm: MikroORM) {
  const em = orm.em.fork();

  const product = em.create(Product, {
    name: 'Café',
    price: 1000,
    stock: 10,
    description: 'Café recién molido',
    category: "680c19ec22e59b4bcfa32dc8",
    state: 'Active',
  });

  await em.persistAndFlush(product);
  return product;
}
