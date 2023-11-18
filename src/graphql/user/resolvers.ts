import UserService, { UserPayload } from "../../services/user"

const queries = {
    getUserToken: async (_: any, payload: { email: string, password: string }) => {
        const token = await UserService.userLogin(
            {
                email: payload.email,
                password: payload.password
            }
        );
        return token;
    }
}

const mutations = {
    createUser: async (_: any, user: UserPayload) => {
        console.log(user);
        const resp = await UserService.createUser(user);
        return resp.id;
    }
}

export const resolvers = { queries, mutations }