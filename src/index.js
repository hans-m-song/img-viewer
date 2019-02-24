if (process.env.NODE_ENV === 'development') require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/live', (req, res) => {
    res.send({ express: 'server is live' });
});

app.post('/api/post', (req, res) => {
    console.log(req.body);
    res.send({
        received: req.body.post || 'nothing',
        response: 'responding to post request',
    });
});

app.listen(port, () => console.log(`listening on port ${port}`));