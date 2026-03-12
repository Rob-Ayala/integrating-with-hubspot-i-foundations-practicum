const fs = require('fs');
const path = require('path');

console.log('--- DIAGNÓSTICO DE CARPETA ---');
console.log('¿Existe el archivo .env?:', fs.existsSync(path.join(__dirname, '.env')));
console.log('Ruta de la carpeta:', __dirname);
console.log('Contenido de la carpeta:', fs.readdirSync(__dirname));
console.log('------------------------------');


require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// Definimos las constantes globales
const OBJECT_TYPE = '2-58889138';

// RUTA GET HOMEPAGE ("/")
app.get('/', async (req, res) => {
    // Definimos el token y headers ADENTRO para asegurar que no sea undefined
    const token = process.env.HS_ACCESS_TOKEN;
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=partner_name,partner_website,partnery_type`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot', data });
    } catch (error) {
        console.error("Error en GET /:", error.response ? error.response.data : error.message);
    }
});

// RUTA GET FORMULARIO
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// RUTA POST FORMULARIO
app.post('/update-cobj', async (req, res) => {
    const token = process.env.HS_ACCESS_TOKEN;
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const newRecord = {
        properties: {
            "partner_name": req.body.partner_name,
            "partner_website": req.body.partner_website, 
            "partnery_type": req.body.partnery_type 
        }
    };

    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error("Error en POST /update-cobj:", error.response ? error.response.data : error.message);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));