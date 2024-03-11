const swagger = require('express-jsdoc-swagger');
const path = require('path');

module.exports = (app) => {
  swagger(app)({
    info: {
      version: '0.0.1',
      title: 'Statistic app',
      description: '',
    },
    security: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
    baseDir: path.resolve(__dirname, '../'),
    filesPattern: ['./routes/*.js', './routes/*/*.js', './helpers/*.js', './models/*.js'],
    exposeApiDocs: true,
    apiDocsPath: '/api-docs.json',
  });
};
