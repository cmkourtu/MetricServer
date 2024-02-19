const express = require('express');

const configure = require('./config');
const sequelize = require('./config/db');
const routes = require('./routes');
const defaultErrorHandler = require('./helpers/defaultErrorHandler');
const {join} = require("path");

const app = express();

configure(app);
app.use('/api', routes);
app.use(defaultErrorHandler);
app.use('/public', express.static(join(__dirname, 'public')));
sequelize.authenticate().then(() => {
  const server = app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`  Server Listening on port ${server.address().port}`);
  });
});
