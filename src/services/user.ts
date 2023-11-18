import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "crypto";
import JWT from "jsonwebtoken";

const Jwt_Secret = "$uper$ecretPassword"

export interface UserPayload{
    firstName: string,
    lastName?: string,
    email: string,
    password: string,
}
export interface TokenPayload{
    email:string,
    password:string,
}
class UserService {
    private static generateHash(salt:string,password:string){
        return createHmac('sha256', salt).update(password).digest('hex')
    }
    public static createUser(user: UserPayload) {
        const { firstName, lastName, email, password } = user;
        console.log(user);
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = this.generateHash(salt,password)
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt
            }
        });
    }
    private static getUserByEmail(email:string){
        return prismaClient.user.findUnique({where:{email}})
    }
    public static async userLogin(payload:TokenPayload){
        const {email,password} = payload
        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error('404 - User not found')
        const userSalt = user.salt;
        const userHashPassword = this.generateHash(userSalt,password)

        if(userHashPassword !== user.password){
            throw new Error('Incorrect Password');
        }

        const token = JWT.sign({id:user.id,email:user.email},Jwt_Secret);
        return token;
    }
}

export default UserService;