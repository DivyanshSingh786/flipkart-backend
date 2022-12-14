const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

// routes
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin/auth.js');
const initialDataRoutes = require('./routes/admin/initialData.js');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const pageRoutes = require('./routes/admin/page');
const addressRoutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const adminOrderRoute = require('./routes/admin/order.routes');

// environment variables or you can say constants
env.config();

// mongodb connection
// mongodb+srv://ecommerceuser:xJ!2Mg5LfMJ2u#!@cluster-ecommerce-webap.dkigi0i.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster-ecommerce-webap.dkigi0i.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
).then(() => {
  console.log('Database connected');
});

//  It parses incoming JSON requests and puts the parsed data in req.body.
// 1.  express.json() is a built in middleware function in Express starting from v4.16.0.
// app.use(express.json());
// 2. bodyParser()
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', pageRoutes);
app.use('/api', addressRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})