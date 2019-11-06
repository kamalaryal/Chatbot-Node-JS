const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path  = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
// const Passport = require('./server/config/passport');

const user = require('./server/routes/usersRoutes');
const routes = require('./server/routes/routes');
const templates = require('./server/routes/templatesRoutes');

mongoose.connect('mongodb://localhost:27017/chatbot', { useNewUrlParser: true }).then(console.log('mongoDB Connected.'));
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

// require('./server/config/auth')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/api/data/', templates);
app.use('/api/user/', user);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
   res.status(error.status || 500);
   res.json({
        message : error.message
   });
   console.log(error);
});

module.exports = app;