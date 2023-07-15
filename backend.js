/*
    /api /ping
        should return pong
    
*/
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.get('/', (req, res) => {
  res.send('pong');
});

app.post('/api', (req, res) => {
  const cornerLettering = req.body.cornerLettering;
  const edgeLettering = req.body.edgeLettering;

  // Process the data and send the response
  res.json({ result: 'Success', cornerLettering, edgeLettering});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

