const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoutes);

app.listen(8086, () => {
    console.log('API listening on port 8086');
});
