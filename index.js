const express = require('express');
const cors = require('cors');


const connectAndInitializeDatabase = require('./Config/DbConnection');
const registerRouter = require('./Router/Athu/Register')


const app = express();
app.use(express.json());
app.use(cors());


connectAndInitializeDatabase();



app.use('/api', registerRouter);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});