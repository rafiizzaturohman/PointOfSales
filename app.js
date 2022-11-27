const path = require('path');
const express = require('express');

const logger = require('morgan');
const session = require('express-session')
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')

const { Pool } = require('pg');
const pool = new Pool({
  user: 'afiizza',
  host: 'localhost',
  database: 'posdb',
  password: '12345',
  port: 5432
})

const indexRouter = require('./routes/index')(pool);
const usersRouter = require('./routes/users')(pool);
const unitsRouter = require('./routes/units')(pool);
const goodsRouter = require('./routes/goods')(pool);
const salesRouter = require('./routes/sales')(pool);
const homesRouter = require('./routes/dashboard')(pool);
const suppliersRouter = require('./routes/suppliers')(pool);
const purchasesRouter = require('./routes/purchases')(pool);
const customersRouter = require('./routes/customers')(pool);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'afiizza',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/units', unitsRouter);
app.use('/goods', goodsRouter);
app.use('/sales', salesRouter);
app.use('/dashboard', homesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/purchases', purchasesRouter);
app.use('/customers', customersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;