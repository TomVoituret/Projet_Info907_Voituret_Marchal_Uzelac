const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Autoriser les fichiers statiques
app.use(express.static('public'));

// Route pour renvoyer les données JSON
app.get('/api/armes', (req, res) => {
    const armes = require('./data/classified_data.json');
    res.json(armes);
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
