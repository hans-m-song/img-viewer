if (process.env.NODE_ENV === 'development') require('dotenv').config();

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/live', (req, res) => {
    res.send({ message: 'server is live' });
});

app.get('/api/dir', (req, res) => {
    if (!req.query.dir) {
        res.status(403).send({ message: 'no directory provided' });
        return;
    }
    const type = req.query.type || 'image';

    // TODO limit places someone could request

    let contents;
    try {
        if (type === 'directory') {
            contents = fs.readdirSync(path.resolve(req.query.dir))
                .filter(fileName => fs.lstatSync(path.join(req.query.dir, fileName)).isDirectory());
        } else
        if (type === 'image') {
            contents = fs.readdirSync(path.resolve(req.query.dir))
                .filter(fileName => fs.lstatSync(path.join(req.query.dir, fileName)).isFile() 
                    && /(jp(e)?g|png)/ig.test(fileName));
        } else {
            res.status(403).send({ message: `unhandled type request: ${type}` });
            return;
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.status(404).send({
                code: err.code,
                syscall: err.syscall,
                path: err.path,
                message: err.message,
            });
        } else {
            res.status(404).send(err);
        }
        return;
    }

    res.send({ contents })
    // res.send({ stat: fs.readdirSync(dir) });
});

app.get('/api/file', (req, res) => {
    if (!req.query.file) {
        res.status(403).send({ message: 'no file provided' });
        return;
    }

    // TODO limit files someone could request

    let filepath;
    try {
        filepath = path.resolve(req.query.file);
        fs.existsSync(filepath)
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.status(404).send({
                code: err.code,
                syscall: err.syscall,
                path: err.path,
                message: err.message,
            });
        } else {
            res.status(404).send(err);
            return;
        }
    }

    res.sendFile(filepath);
});

app.post('/api/post', (req, res) => {
    console.log(req.body);
    res.send({
        received: req.body.post || 'nothing',
        response: 'responding to post request',
    });
});

app.get('/api', (req, res) => {
    res.send({
        message: 'api endpoints',
        endpoints:  app._router.stack
            .map(route => route.route)
            .filter(route => route)
            .map(route => {
                return {
                    route: route.path || 'hidden',
                    method: route.stack[0].method || 'hidden',
                }}),
    });
});

app.listen(port, () => console.log(`listening on port ${port}`));