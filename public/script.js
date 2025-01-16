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

    // Fonction pour afficher les données
    const renderTable = (data) => {
        tableBody.innerHTML = ''; // Vider le tableau avant d'afficher les nouvelles données
        data.forEach(arme => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${arme.modele}</td>
                <td>${arme.categorie ? Object.keys(arme.categorie).find(cat => arme.categorie[cat] === 1) : ''}</td>
                <td>${arme.mode['un-coup']['a 1 coup'] ? '1 coup' : 'Multi-coup'}</td>
                <td>${arme.canon['canon-lisse'] ? 'Canon lisse' : 'Canon rayé'}</td>
                <td>${arme.utilisation.cible_reelle.cible_legales.chasse ? 'Chasse' : 'Autre'}</td>
            `;
            tableBody.appendChild(row);
        });
    };

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

    // Chargement initial des données
    fetchData().then(data => renderTable(data));
});
