import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/Route';
import cookies from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookies());
app.use(router);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send({
        response: "Express Typescript"
    });
});


app.listen(process.env.APP_PORT, () => {
    console.log((`${process.env.APP_NAME} running on port ${process.env.APP_PORT}`));
})