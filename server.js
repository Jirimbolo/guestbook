// tarvittavat moduulit
var express = require('express');
var app = express();
var fs = require('fs');

//haetaan dotenv moduuli
const dotenv = require('dotenv').config();
// luodaan palvelinportti
const PORT = dotenv.parsed.PORT02 || 3002;

// Staattiset tiedostot "public" kansiosta
app.use(express.static('public'));

// juurireitti, joka palauttaa selaimeen index.html tiedoston sisällön
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// luodaan reitti, joka parsii .json tiedoston sisällön taulukkomuotoon ja palauttaa sen selaimeen
app.get('/guestbook', function (req, res) {
    var data = require(__dirname + '/data/guestbook.json');

    // Parse the results into a variable
    var results = '<table border="1">';
    for (var i = 0; i < data.length; i++) {
        results +=
            '<tr>' +
            '<td>' + data[i].Name + '</td>' +
            '<td>' + data[i].Country + '</td>' +
            '<td>' + data[i].Message + '</td>' +
            '</tr>';
    }
    res.send(results);
});

// parse application/x-www-form-urlencoded 
const bodyParser = require('body-parser');
const { count } = require('console');
const { send } = require('process');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));

// lisätään GET polku, joka hakee /public/newmessage.html tiedoston ja lähettää sen selaimeen 
app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname + '/public/newmessage.html');
})
// lisätään POST polku, joka hakee tiedoT selaimesta ja tallentaa ne guestbook.json tiedostoon.
app.post('/newmessage', function (req, res) {
    // Load the existing data from a file and assign to an array (lista)
    const data = require(__dirname + '/data/guestbook.json');
    //luodaan uusi henkilö ja viesti
    const name = req.body.name
    const country = req.body.country
    const message = req.body.message;
    const date = new Date().getDate() + "/" + (1 + parseInt(new Date().getMonth())) + "/" + new Date().getFullYear();
    //...ja pusketaan käyttäjän viesti listan (tiedoston) viimeiseksi
    data.push({
        "Name": name,
        "Country": country,
        "Message": message,
    });

    // Convert the JSON object to a string format 
    var jsonStr = JSON.stringify(data);
    // Write data to a file
    fs.writeFile(__dirname + '/data/guestbook.json', jsonStr, (err) => {
        if (err) throw err;
        console.log("Something went wrong")
    })
    res.send('Thank you for your message! Here you can get back to<a href="/"> homepage.</a>');
});

// lisätään GET polku (route) joka hakee /public/ajaxcall.html tiedoston ja lähettää sen selaimeen 
app.get('/ajaxmessage', function (req, res) {
    res.sendFile(__dirname + '/public/ajaxmessage.html');
})
// lisätään POST polku (route) joka hakee tiedot ja tallentaa ne guestbook.json tiedostoon.
app.post('/ajaxmessage', function (req, res) {
    // Load the existing data from a file and assign to an array
    const data = require(__dirname + '/data/guestbook.json');

    //luodaan uusi henkilö ja viesti
    const name = req.body.name
    const country = req.body.country
    const message = req.body.message;
    //...ja pusketaan käyttäjän viesti listan (tiedoston) viimeiseksi
    data.push({
        "Name": name,
        "Country": country,
        "Message": message,
    });

    // Convert the JSON object to a string format 
    var jsonStr = JSON.stringify(data);

    // Write data to a file
    fs.writeFile(__dirname + '/data/guestbook.json', jsonStr, (err) => {
        if (err) throw err;
        console.log("Success")
    })
    res.send(data)
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    //res.send('Cant find the requested page', 404);
    res.sendFile(__dirname + '/public/error.html');
});


// käynnistetään palvelin kuuntelemaan valittua porttia
app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});