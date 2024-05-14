export interface Repository<T> {
    findAll(): Promise<T[] | undefined>
    findOne(item: {dni: string}):Promise< T | undefined>
    add(item: T):Promise< T | undefined>
    update(item: T):Promise< T | undefined>
    delete(item: {dni: string}):Promise< T | undefined>
}