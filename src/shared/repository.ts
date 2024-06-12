export interface Repository<T> {
    findAll(): Promise<T[] | undefined>
    findOne(item: {identificador: string}):Promise< T | undefined>
    add(item: T):Promise< T | undefined>
    update(item: T):Promise< T | undefined>
    delete(item: {identificador: string}):Promise< T | undefined>
}
