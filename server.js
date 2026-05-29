const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the expo export directory
const buildPath = path.join(__dirname, 'dist'); // Use 'web-build' if using an older Expo SDK
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});