require('dotenv').config();
const { createLogger, transports ,format} = require('winston');
const logger = createLogger({}
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
),
  transports: [
    new transports.File({
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
