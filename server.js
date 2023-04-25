
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to the MongoDB database
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


client.connect()
    .then(() => {
        console.log('Connected to MongoDB');

    const employeesCollection = client.db('ITConsultantBusiness').collection('employees');

    // Get all employees
    app.get('/api/employees', async (req, res) => {
        const employees = await employeesCollection.find().toArray();
        res.send(employees);
    });

    // Add a new employee
    app.post('/api/employees', async (req, res) => {
        const employee = req.body;
        const result = await employeesCollection.insertOne(employee);
        if (result.result.ok === 1) {
            res.send({_id: result.insertedId});
        } else {
            res.sendStatus(500);
        }
    });

    app.use(express.static('public'));
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
});
