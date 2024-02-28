const express = require('express');
const app = express(); //rest object

const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');

// use cors
app.use(cors());

// configure .env ko
// dotenv.config();


// mongodb connection
connectDB();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// import router
app.use('/api', userRoutes)
app.use('/api', adminRoutes)
app.use('/api', doctorRouter)



// routes
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Server Running'
  })
})

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server start at ${port}`.bgCyan.white); //we have added color
})