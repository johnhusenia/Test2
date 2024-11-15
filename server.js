/********************************************************************************
* WEB700 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: John Clarence C. Husenia Student ID: 174280230 Date: November 1, 2024
*
* Published URL: https://web100test1.vercel.app/
*
********************************************************************************/
const express = require("express");
const app = express();
const HTTP_PORT = 8080; 

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const path = require('path');
const fs = require('fs');

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/insert', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'test.html'));
});

app.get('/lego/sets', async (req, res) => {
    const theme = req.query.theme;
    try {
        const themeSets = await legoData.getSetsByTheme(theme);
        res.json(themeSets);
    } catch (error) {
        console.error(error);
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    }
});

app.get('/lego/sets/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const setNum1 = await legoData.getSetByNum(setNum);
        res.json(setNum1);
    } catch (error) {
        console.error(error);
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    }
});

app.get('/aboutme', (req, res) => {
    res.json("Hello I am John Clarence Husenia");
});

// Endpoint to handle adding an object to JSON file
app.post('/add-object', (req, res) => {
    const newObject = req.body;

    fs.readFile('data/setData.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send('Server error');
        }

        let jsonData = data ? JSON.parse(data) : [];
        jsonData.push(newObject);

        fs.writeFile('data/setData.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send('Server error');
            }
            res.status(200).send('Data added successfully');
        });
    });
});

// 404 handler for any undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


async function startServer() {
    try {
        await legoData.initialize(); 
        console.log("Initialization complete. Starting server...");
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    } catch (error) {
        console.error("Failed to initialize:", error);
    }
}

startServer();
