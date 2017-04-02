/**
 * Created by Ozgen on 9/7/16.
 */
// main start of the server

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const mkdirp = require('mkdirp');
const multer = require('multer');
const cookieParser = require('cookie-parser');


// multer fileupload setup

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp(path.join(__dirname, './uploads/', req.body.folder.toString()), function (err) {
            if (err) console.log(err);
        });
        cb(null, './uploads/' + req.body.folder + '/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const app = express();
app.use(cors());


//DB setup


//mongoose.connect('mongodb://localhost:auth/auth');
var options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
};
mongoose.connect(config.database, options, function (err) {
    if (err)
        console.log(err);
    else
        console.log("connected to db");
});

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    // Wait for the database connection to establish, then start the app.
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/views/index.html');
    });

});
// app setup

app.use(multer({storage: storage}).any());
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//config for router
app.use('/client/', routes);

//ui setup


//server setup

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('server is start on:', port);