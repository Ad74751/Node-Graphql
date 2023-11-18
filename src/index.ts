import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphQlServer from './graphql/index';
const PORT = Number(process.env.PORT) || 8000;

async function init() {
    const app = express()

    app.use(express.json())

    const gqlServer = await createApolloGraphQlServer();


    app.use('/graphql', expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.json({ msg: "Hello from Express TypeScript Server" })
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server started @ port ${PORT}`);
    });
}

init();