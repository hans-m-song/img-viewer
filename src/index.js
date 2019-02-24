if (process.env.NODE_ENV === 'development') require('dotenv').config();

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
    res.send({
        message: 'api endpoints',
        endpoints: [
            '/api',
            '/api/live',
            '/api/post',
            '/api/stat'
        ]
    });
});

app.get('/api/live', (req, res) => {
    res.send({ message: 'server is live' });
});

app.post('/api/post', (req, res) => {
    console.log(req.body);
    res.send({
        received: req.body.post || 'nothing',
        response: 'responding to post request',
    });
});

app.get('api/stat', (req, res) => {
    console.log('api/stat', req.query)
    if (!req.query.dir) res.sendStatus(403).send({ message: 'no directory provided' });
    
    const dir = fs.readdirSync(path.resolve(req.dir));
    console.log(dir)
    res.send({ stat: fs.readdirSync(dir) });
});

app.listen(port, () => console.log(`listening on port ${port}`));