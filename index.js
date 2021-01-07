require('dotenv').config();

const { PORT, PUBLIC_PATH, INDEX_FILE } = process.env;
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.static(`${__dirname}/${PUBLIC_PATH}`));

const api = require('./routes');

app.use('/', api);
app.use(morgan('tiny'));

app.get('*', (_, res) => {
  res.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, INDEX_FILE));
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
