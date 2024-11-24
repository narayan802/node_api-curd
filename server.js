

const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());

// Prifix Routes
app.use('/api', customerRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
