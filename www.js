const serve = require('koa-static')
const Koa = require('koa')

const {exec} = require("child_process");

var app = new Koa()

app.use(serve('./views/'))

app.listen({host: 'localhost', port: '3000'})
console.log(' http://localhost:3000/home.html')

// app.listen({host: '192.168.43.226', port: '3000'})
// console.log('http://192.168.43.226:3000/home.html')

// exec(`start http://192.168.43.226:3000/home.html`);
// exec(`start http://localhost:3000/home.html`);

