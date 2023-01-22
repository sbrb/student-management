const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const route = require('./router/route');
const app = express();

app.use(express.json())
mongoose.set('strictQuery', true);
const port = process.env.PORT;

mongoose.connect(process.env.DB, {
    useNewUrlParser: true
}).then(() => console.log('MongoDb is connected..'))
    .catch(err => console.log(err));

app.use('/', route);

app.use((req, res) => res.status(400).send({ status: false, message: 'Invalid Url.' }));
app.listen(port, () => console.log(`Express app is connected on port${port}`));
