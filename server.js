const express = require("express");
const app = express();
const cors = require("cors");

//PARA UTILIZAÇÃO NO SERVIDOR, CONSERTAR HOST="127.0.0.1" NO .ENV E MYSQL | CONSERTAR PORTAS AMAZON (BANCO LOCAL)

const authentication = require("./auth");

const loginRouter = require('./routes/login');
/*const passwordRequestRouter = require('./routes/passwordRequest');
const passwordChangeRouter = require('./routes/passwordChange');
const registrationRouter = require('./routes/registration');
const appointmentListRouter = require('./routes/appointmentList');
const makeAppointmentRouter = require('./routes/makeAppointment');*/


const knex = require("./database");
//const e = require("express");

require('dotenv').config();

app.use(cors());

app.use(express.json());
app.use('/login', loginRouter);
/*app.use('/passwordRequest', passwordRequestRouter);
app.use('/passwordChange', passwordChangeRouter);
app.use('/registration', registrationRouter);
app.use('/appointmentList', authentication, appointmentListRouter);
app.use('/makeAppointment', authentication, makeAppointmentRouter);*/


const listener = app.listen(process.env.PORTA, () => {
    console.log("Server listening. PORT = " + listener.address().port);
});