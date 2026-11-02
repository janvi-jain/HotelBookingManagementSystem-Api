const dotenv = require('dotenv')
dotenv.config()

const bodyParser = require('body-parser');
const express = require('express')

const port = process.env.PORT || 3000;
const database = require('./config/db');
const routes = require('./routes/index')

const app = express();
database();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

//route middleware
app.use('/api', routes)

app.listen(port, (err) => {
    if (!err) {
        console.log(`server port started on http://localhost:${port}`);
    }
})
