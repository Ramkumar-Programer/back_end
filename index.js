const express = require('express');
const cors = require('cors');

require('dotenv').config();

const cron = require('node-cron');
const dbConfig = require('./src/Config/Config');


const connectAndInitializeDatabase = require('./src/Config/DbConnection');
const registerRouter = require('./src/Router/Athu/Athu')
const {otpRouter,deleteOtp} = require('./src/Router/Athu/Otp')


const app = express();
app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:3000', 'https://frontend-dkq5.onrender.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

connectAndInitializeDatabase();



app.use('/athu', registerRouter);
app.use('/otp', otpRouter);

cron.schedule('*/7 * * * *', async () => {
    console.log("came inside auot detele");
    try {
        const result = await deleteOtp("auto");
        console.log(result);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
