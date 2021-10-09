import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import env from './configs';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import * as ErrorHandler from './middlewares/ErrorHandler';
import TestController from './controllers/TestController';
import axios from 'axios';
import { Dummydata } from './dummyData';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 받은 데이터를 req에 넣어줌.
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(
    session({
        secret: env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.get('/single', (req, res, next) => {
    var count = 0;
    axios({
        url: 'http://localhost:4000/single-running',
        method: 'post',
        data: { latitude: 37.52818511648284, longitude: 127.07127183483387 },
        headers: {
            Authorization: `Bearer ${env.JWT_TOKEN_DUMMY}`,
        },
    })
        .then((response) => {
            console.log('응답', response.data);
            setInterval(async () => {
                const result = await axios({
                    url: 'http://localhost:4000/single-running/running',
                    method: 'post',
                    data: { id: String(response.data.id), runData: [Dummydata[count]] },
                    headers: {
                        Authorization: `Bearer ${env.JWT_TOKEN_DUMMY}`,
                    },
                });
                console.log(result);
                count += 1;
            }, 2000);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

app.use('/test', TestController);

//404Router handler
app.use(ErrorHandler.routerHanlder);

//Error Handler
app.use(ErrorHandler.logHandler);
app.use(ErrorHandler.errorHandler);

app.listen(env.PORT, () => {
    console.log(env.PORT + '서버 시작');
});
