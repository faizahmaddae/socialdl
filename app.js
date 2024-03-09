const express = require('express');
const apiRoutes = require('./api');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// clear console
console.clear();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.set('trust proxy', true);
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the API server',
    apis: [
      '/api/download/',
      '/api/download/instagram',
      '/api/download/tiktok',
    ],
  });
});


app.listen(process.env.PORT || 8080);

// app.listen(port, () => {
//   console.log(`API server listening at http://localhost:${port}`);
// });