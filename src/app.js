const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Environments
require('dotenv').config();

//Configure mongoose's promise to global promise
//mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'edulabzz', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(errorHandler());

//Configure Mongoose
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edulabzz', { useCreateIndex: true, useNewUrlParser: true });
//mongoose.set('debug', true);
//mongoose.set('bufferCommands', false);

//Models & routes
//require('./models/user');
require('./config/passport');
app.use(require('./routes'));

app.listen(process.env.PORT || 3000, () => console.log('Server running on http://localhost:8000/'));