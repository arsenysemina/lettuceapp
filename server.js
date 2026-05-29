// this is for hosting a lightweight server for heroku deploys, 
// but can also be used locally! after building with npx expo build:web
// you can run node server.js

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the expo export directory
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});