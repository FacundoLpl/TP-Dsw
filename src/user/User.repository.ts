import { Repository } from "../shared/repository.js";
import { User } from "./user.entity.js";

const users = [
    new User(
        '43349481',
        'Facundo',
        'Cantaberta',
        'Admin'
    )
]

export class UserRepository implements Repository<User>{
    public findAll(): User[] | undefined {
        return users
    }
    
    public findOne(item: { dni: string; }): User | undefined {
        return users.find((user) => user.dni === item.dni)
    }

    public add(item: User): User | undefined {
        users.push(item)
        return item
    }

    public update(item: User): User | undefined {
        const userIdx = users.findIndex((user) => user.dni === item.dni)

        if(userIdx !== -1){
            Object.assign(users[userIdx], item)
    }
    return users[userIdx]}

    public delete(item: { dni: string; }): User | undefined {
        const userIdx = users.findIndex((user) => user.dni === item.dni)
    
    if(userIdx !== -1){
        const deletedUsers = users[userIdx]
        users.splice(userIdx, 1)
        return deletedUsers
    }
}
}