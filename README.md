# Projet Info907 - Application POC pour Recherche Ontologique sur les Armes à Feu

## Auteurs
- Uzelac Yvann
- Marchal Enzo
- Voituret Tom

## Description
Cette application Proof of Concept (POC) permet de réaliser des recherches ontologiques sur les armes à feu. Elle est développée en JavaScript avec Node.js.

## Lancement de l'application
Pour lancer l'application, exécutez la commande suivante :
```sh
$ node server.js
```
La page web sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Étapes de Réflexion

### Choix des Attributs
Nous avons d'abord identifié les attributs importants d'une arme à feu, qui sont :
```js
attributes = ["Utilisation", "Catégorie", "Canon", "Projectiles", "Portée", "Mode"]
```
Nous avons détaillé chacun de ces attributs comme suit :
```js
{
    "mode": {
        "un-coup": {
            "semi-auto": "0",
            "repetition-manuelle": "0",
            "a 1 coup": "1"
        },
        "multi-coup": {
            "automatique": "0",
            "rafale": "0"
        }
    },
    "utilisation": {
        "cible_theorique": {
            "sportif": "0"
        },
        "cible_reelle": {
            "cible_legales": {
                "chasse": "1",
                "militaire": "0"
            },
            "cible_illegales": {
                "tueur-a-gage": "0",
                "gangster": "0"
            }
        }
    },
    "canon": {
        "canon-lisse": "0",
        "canon-rayé": "1"
    },
    "prise": {
        "arme-de-poing": "0",
        "arme-d-epaule": "1"
    },
    "projectile": {
        "unique": "1",
        "multiple": "0"
    },
    "portée": {
        "court": "0",
        "moyenne": "1",
        "long": "0"
    },
    "mecanisme": {
        "repetition-manuelle": "0",
        "tire-unique": "1",
        "automatique": {
            "full-auto": "0",
            "semi-auto": "0"
        }
    },
    "categorie": {
        "cat-D": "0",
        "cat-C": "1",
        "cat-B": "0",
        "cat-A": "0"
    },
    "modele": "IJ 18 (IZH18 - MP18 - MP18MH)"
}
```

### Analyse des Attributs
Nous avons utilisé le script `other/mainjson.py` pour analyser les attributs les plus importants à l'aide de calculs mathématiques basés sur l'entropie, en utilisant le fichier `other/weapon.js`.

Les attributs les plus importants pour générer un arbre de décision sont :
```js
["Utilisation", "Catégorie", "Canon", "Projectiles", "Portée", "Mode"]
```

### Génération de l'Arbre de Décision
Pour générer l'arbre de décision, nous utilisons le fichier `other/weapons.js` qui met les données à plat pour une lecture simplifiée :
```js
[
  [
    "mode.un-coup.a 1 coup",
    "utilisation.cible_reelle.cible_legales.chasse",
    "canon.canon-rayé",
    "prise.arme-d-epaule",
    "projectile.unique",
    "portée.moyenne",
    "mecanisme.tire-unique",
    "categorie.cat-C",
    "IJ 18 (IZH18 - MP18 - MP18MH)"
  ]
]
```
Notre application permet ensuite de choisir une arme en fonction des attributs sélectionnés.

## Récupération des Informations
Un fichier CSV complet peut être récupéré sur le site du gouvernement français, répertoriant toutes les armes. Nous adaptons ensuite ces données à nos attributs en les modifiant si nécessaire.


## Récupération des images

En fonction du nom, on prend la première image sur google.