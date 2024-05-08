export interface Repository<T> {
    findAll(): T[] | undefined
    findOne(item: {dni: string}): T | undefined
    add(item: T): T | undefined
    update(item: T): T | undefined
    delete(item: {dni: string}): T | undefined
}