import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import authRoutes from './routes/auth.js'; 
import notificationRoutes from './routes/notificationRoutes.js';
import promotionsRouter from './routes/promotions.js'; // Correct path and import
import vouchersRouter from './routes/vouchers.js';
import shippingRoutes from './routes/shipping.js';
import taxRoutes from './routes/tax.js';
/*// data imports*/
/*import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';

import {
    dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat
  } from "./data/index.js";*/

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

  

/* ROUTES */
app.use('/api/client', clientRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/sales', salesRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/promotions', promotionsRouter); // Use promotions router
app.use('/api/vouchers', vouchersRouter);
app.use('/api/shipping', shippingRoutes);
app.use('/api/tax', taxRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

     /* ONLY ADD DATA This only ONE TIME */
     /*AffiliateStat.insertMany(dataAffiliateStat);
    OverallStat.insertMany(dataOverallStat);
     Transaction.insertMany(dataTransaction);
     Product.insertMany(dataProduct);
     ProductStat.insertMany(dataProductStat);
    User.insertMany(dataUser);*/

}).catch((error) => console.log(`${error} did not connect`));