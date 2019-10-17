require('dotenv').config();
//const { createLogger, transports ,format} = require('winston');

const logger = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

winston.loggers.add('customLogger', {
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: './logs/QuizZBot-Server.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    }),
  ],
});

var express = require('express'),
  exphbs = require('express-handlebars'),
  app = express(),
  port = process.env.EHBPORT;
logger.info('Starting QuizZBot-Server...')

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

var routes = require('./api/routes/questionRoutes.js');
routes(app);


app.listen(port, '0.0.0.0', () => {
  logger.info(`App running on port ${port}.`)
});
