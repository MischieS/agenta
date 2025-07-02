// Simple Express server to test port binding
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Debug server running');
});

const port = 8080; // Using a common open port
app.listen(port, () => {
  console.log(`Debug server listening on port ${port}`);
});
