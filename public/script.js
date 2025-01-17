document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('armesTableBody');
    const searchInput = document.getElementById('searchInput');
    let dataGlobal = {}
    // Fonction pour récupérer les données depuis le serveur
    const fetchData = async () => {
        try {
            const response = await fetch('/api/armes');
            const data = await response.json();
            dataGlobal = data
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const renderTable = (data) => {
        tableBody.innerHTML = ''; // Vider le tableau avant d'afficher les nouvelles données
        data.forEach(arme => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${arme.image_url}" alt="${arme.modele}" width="100" height="auto"></td>
                <td>${arme.modele}</td>
                <td>${formatCategorie(arme.categorie)}</td>
                <td>${formatMode(arme.mode)}</td>
                <td>${formatProjectile(arme.projectile)}</td>
                <td>${formatUtilisation(arme.utilisation)}</td>
            `;
            tableBody.appendChild(row);
        });
    };
    
    // Fonction pour formater la catégorie
    function formatCategorie(categorie) {
        // Retourne la clé de la catégorie où la valeur est 1
        return Object.keys(categorie).find(cat => categorie[cat] === 1) || 'Non spécifié';
    }
    
    // Fonction pour formater le mode de tir
    function formatMode(mode) {
        // Recherche du mode "un-coup"
        const unCoupMode = Object.keys(mode['un-coup']).filter(key => mode['un-coup'][key] === 1);
        // Recherche du mode "multi-coup"
        const multiCoupMode = Object.keys(mode['multi-coup']).filter(key => mode['multi-coup'][key] === 1);
        
        // Si on trouve des modes "un-coup", les afficher
        if (unCoupMode.length > 0) {
            return `${unCoupMode.join(', ')}`;
        }
        
        // Si on trouve des modes "multi-coup", les afficher
        if (multiCoupMode.length > 0) {
            return `${multiCoupMode.join(', ')}`;
        }
        
        return 'Mode non spécifié';
    }
    
    // Fonction pour formater le type de canon
    function formatProjectile(projectile) {
        const projectileType = Object.keys(projectile).filter(key => projectile[key] === 1);
        if (projectileType.length > 0) {
            return projectileType.join(', ');
        }
        return 'Type de projectile non spécifié';
    }
    
    // Fonction pour formater l'utilisation de l'arme
    function formatUtilisation(utilisation) {
        const legalTargets = Object.keys(utilisation.cible_reelle.cible_legales).filter(key => utilisation.cible_reelle.cible_legales[key] === 1);
        const illegalTargets = Object.keys(utilisation.cible_reelle.cible_illegales).filter(key => utilisation.cible_reelle.cible_illegales[key] === 1);
        const notReelTargets = Object.keys(utilisation.cible_theorique).filter(key => utilisation.cible_theorique[key] === 1);

        const allTargets = [...legalTargets, ...illegalTargets, ...notReelTargets];
        
        if (allTargets.length > 0) {
            return allTargets.join(', ');
        }
        
        return 'Utilisation non spécifiée';
    }


    // Fonction pour filtrer les données
    const filterData = (data, query) => {
        return data.filter(arme => {
            // Vérifier si 'modele' est bien une chaîne de caractères avant d'utiliser toLowerCase()
            const modele = (arme.modele && typeof arme.modele === 'string') ? arme.modele.toLowerCase() : '';
            
            return modele.includes(query.toLowerCase()) || 
                   Object.keys(arme.categorie).some(cat => 
                     cat.toLowerCase().includes(query.toLowerCase()) && arme.categorie[cat] === 1
                   );
        });
    };


// Listener sur le bouton de recherche
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchBox').value;
    const filteredData = filterData(dataGlobal, query);
    renderTable(filteredData); // Passe les données filtrées à la fonction renderTable
});

// Listener sur la touche "Entrée" dans le champ de recherche
document.getElementById('searchBox').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('searchBox').value;
        const filteredData = filterData(dataGlobal, query);
        renderTable(filteredData); // Passe les données filtrées à la fonction renderTable
    }
});

    // Fonction pour récupérer toutes les valeurs sélectionnées
    const getSelectedValues = () => {
    const selectedValues = {
      porte: [],
      prise: [],
      mecanisme: []
    };
    
    // Récupérer les valeurs sélectionnées pour "Porte"
    document.querySelectorAll('input[id^="porte_"]:checked').forEach(checkbox => {
      selectedValues.porte.push(checkbox.value);
    });

    // Récupérer les valeurs sélectionnées pour "Prise"
    document.querySelectorAll('input[id^="prise_"]:checked').forEach(checkbox => {
      selectedValues.prise.push(checkbox.value);
    });

    // Récupérer les valeurs sélectionnées pour "Mécanisme"
    document.querySelectorAll('input[id^="mecanisme_"]:checked').forEach(checkbox => {
      selectedValues.mecanisme.push(checkbox.value);
    });

    return selectedValues;
  };

  // Fonction pour filtrer les armes selon les valeurs sélectionnées
  const filterWeapons = () => {
    const selectedValues = getSelectedValues();
    console.log(selectedValues)
    const filteredData = dataGlobal.filter(arme => {
      const porteMatch = selectedValues.porte.length === 0 || selectedValues.porte.some(value => arme.porte[value] === 1);
      const priseMatch = selectedValues.prise.length === 0 || selectedValues.prise.some(value => arme.prise[value] === 1);
      const mecanismeMatch = selectedValues.mecanisme.length === 0 || selectedValues.mecanisme.some(value => arme.mecanisme[value] === 1) || selectedValues.mecanisme.some(value => arme.mecanisme.automatique[value] === 1);
      return porteMatch && priseMatch && mecanismeMatch;
    });
    renderTable(filteredData);
  };

  // Appeler filterWeapons chaque fois qu'une case est cochée ou décochée
  document.querySelectorAll('.form-check-input').forEach(input => {
    input.addEventListener('change', filterWeapons);
  });

    // Chargement initial des données
    fetchData().then(data => renderTable(data));

});
