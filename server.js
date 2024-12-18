/********************************************************************************
* WEB700 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: John Clarence C. Husenia Student ID: 174280230 Date: December 06, 2024
*
* Published URL: https://test2-lac-zeta.vercel.app/
*
********************************************************************************/
const express = require("express");
const app = express();
const HTTP_PORT = 8080; 

const path = require('path');
const fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
app.use(express.urlencoded({ extended: true }));


app.use(express.json());

app.get("/", (req,res)=>{
    res.render("home");

});

app.get("/", (req,res)=>{
    res.render("home");

});

app.get("/about", (req,res)=>{
    res.render("about");

});

// testing
app.get("/test", async (req,res)=>{
    try {
        const themeSets = await legoData.getAllThemes();
        res.render("addsets", {themes: themeSets});
    } catch (error) {
        console.error(error);
        res.render("404");
    }

});



app.get("/lego/addSet",  async (req,res)=>{

    try {
        const themeSet = await legoData.getAllThemes();
        res.render("addsets", {themes: themeSet});

    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.get("/lego/sets", async (req,res)=>{
    const theme = req.query.theme;
    try {
        const themeSets = await legoData.getSetsByTheme(theme)
        res.render("sets", {sets: themeSets}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
    
});

app.get('/lego/set/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const setNum1 = await legoData.getSetByNum(setNum);
        res.render("set", {set: setNum1}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.post('/lego/addsets', async (req, res) => {
    console.log("running add");
    try {
        const newObject = req.body;
        const addset = await legoData.legoaddset(newObject);
        console.log(addset);
        const setNum1 = await legoData.getSetByNum(addset.set_num);
        res.render("set", {set: setNum1});  
    } catch (err) {
        res.status(500).render("500", {message: err}); 
    }


});

app.get('/lego/deleteset/:set_num', async (req, res) => {
    const theme = req.query.theme;
    try{ 
        await legoData.deleteSetByNum(req.params.set_num); 
        res.redirect("/lego/sets");
        }catch(err){ 
            res.status(500).render("500", {message: err}); 
        }
});

app.get('/lego/redirectToSets', async (req, res) => {
    try{ 
        res.redirect("/lego/sets"); 
        }catch(err){ 
        res.status(404).send(err); 
        }
});



// 404 handler for any undefined routes
app.use((req, res) => {
    res.render("404");
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