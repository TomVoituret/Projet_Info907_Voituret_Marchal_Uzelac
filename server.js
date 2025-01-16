const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour obtenir l'ontologie
app.get('/api/ontology', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'ontology.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading ontology file');
    } else {
      res.json(JSON.parse(data));
      console.log(data)
    }
  });
});

// Route pour rechercher dans l'ontologie
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  const filePath = path.join(__dirname, 'data', 'ontology.json');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading ontology file');
    } else {
      const ontology = JSON.parse(data);

      // Fonction récursive de recherche
      const search = (node, term) => {
        if (node.name && node.name.toLowerCase().includes(term.toLowerCase())) {
          return [node];
        }
        if (node.categories) {
          return node.categories.flatMap((sub) => search(sub, term));
        }
        return [];
      };

      const results = search(ontology, searchTerm);
      res.json(results);
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
