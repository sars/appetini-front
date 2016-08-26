require('babel/polyfill');
const moment = require('moment');

moment.locale('ru');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const origin = 'http://appetini.com';

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  origin: origin,
  app: {
    title: 'Appetini',
    phone: '+38 068 366 11 24',
    description: 'Сервис доставки вкусных домашних обедов каждый день',
    head: {
      titleTemplate: 'Appetini - доставка обедов: %s',
      meta: [
        {name: 'description', content: 'Сервис доставки вкусных домашних обедов каждый день'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Appetini - доставка обедов Сумы'},
        {property: 'og:image', content: `${origin}/appetini.jpg`},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Appetini - доставка обедов'},
        {property: 'og:description', content: 'Сервис доставки вкусных домашних обедов каждый день'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }

}, environment);
