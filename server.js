// Innlessur environment variablar frá .env file
require('dotenv').config();
// Importerar neyðug modul
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

// Initialiserar Express app
const app = express();
// Setur port til 3000
const PORT = process.env.PORT || 3000;

// Setur upp middleware til at lesa JSON frá request body
app.use(cors());
app.use(bodyParser.json());

// Setur upp MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Connect til MongoDB
client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        // Setur collection til at vera employees
        const employeesCollection = client.db('ITConsultantBusiness').collection('employees');

    // Heinta allar employees
    app.get('/api/employees', async (req, res) => {
        // eomployeesCollection.find() returnar eitt cursor object,.toArray() ger object til array. await er neyðugt til at gera async
        const employees = await employeesCollection.find().toArray();
        // Sendur employees array til client
        res.send(employees);
    });

        // Ger eitt nýtt employee object
        app.post('/api/employees', async (req, res) => {
            // Setur employee object frá request body
            const employee = req.body;
            // Setur employee object inn í employees collection
            const result = await employeesCollection.insertOne(employee);

            // Sendur aftur employee object við _id
            if (result.insertedCount === 1) {
                res.send({_id: result.insertedId});
            } else {
                res.sendStatus(500);
            }
        });

        // Sletta employee frá database
        app.delete('/api/employees/:id', async (req, res) => {
            // Setur employee id frá request params
            const employeeId = req.params.id;
            // Slettar employee frá employees collection
            const result = await employeesCollection.deleteOne({ _id: new ObjectId(employeeId) });

            if (result.deletedCount === 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });


    // Setur static files til at vera í public mappuni
        app.use(express.static('public'));
    // Startar servaran
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    })
    // Catchar error og stoppar serverarna - kanska broyta til at restarta server ístaðin!
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
});
