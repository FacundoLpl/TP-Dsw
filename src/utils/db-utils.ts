import { orm } from '../shared/db/orm';
import { MikroORM } from '@mikro-orm/core';

export async function initDb(): Promise<MikroORM> {
  return orm; // Ya está inicializado en tu orm.ts
}

export async function closeDb(orm: MikroORM) {
  await orm.close(true);
}

export async function clearDb(orm: MikroORM) {
  const generator = orm.getSchemaGenerator();

  try {
    await generator.dropSchema(); // Elimina todas las colecciones
    await generator.createSchema(); // Crea las colecciones desde cero
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
  }
}


