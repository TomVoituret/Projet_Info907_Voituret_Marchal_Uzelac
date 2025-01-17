import json
import math
from collections import defaultdict

# Fonction pour calculer l'entropie en fonction des occurrences de "oui"
def entropy(data, target_attribute):
    counts = defaultdict(int)
    total = len(data)
    
    # Comptabiliser les occurrences de "oui" pour l'attribut donné
    for weapon in data:
        value = get_attribute_value(weapon, target_attribute)
        if value == "oui":
            counts["oui"] += 1
        else:
            counts["non"] += 1
    
    # Calculer l'entropie
    ent = 0
    for count in counts.values():
        prob = count / total
        if prob > 0:
            ent -= prob * math.log2(prob)
    return ent

# Fonction pour obtenir la valeur d'un attribut, même imbriqué
def get_attribute_value(weapon, attribute):
    keys = attribute.split('.')
    value = weapon
    for key in keys:
        value = value.get(key, None)
        if value is None:
            return None
    return value

# Fonction pour calculer le gain d'information d'un attribut
def information_gain(data, attribute):
    original_entropy = entropy(data, attribute)
    
    # Diviser les données selon les valeurs possibles de l'attribut
    attribute_values = defaultdict(list)
    for weapon in data:
        value = get_attribute_value(weapon, attribute)
        attribute_values[value].append(weapon)
    
    # Calculer l'entropie après la division
    weighted_entropy = 0
    total = len(data)
    for group in attribute_values.values():
        weighted_entropy += (len(group) / total) * entropy(group, attribute)
    
    # Le gain d'information est la réduction de l'entropie
    return original_entropy - weighted_entropy

# Fonction pour trier les attributs par gain d'information
def sort_attributes_by_information_gain(data, attributes):
    gains = {attribute: information_gain(data, attribute) for attribute in attributes}
    sorted_attributes = sorted(gains.items(), key=lambda x: x[1], reverse=True)
    return sorted_attributes

# Charger les données depuis un fichier JSON
def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as jsonfile:
        return json.load(jsonfile)

# Main
if __name__ == "__main__":
    # Chemin vers le fichier JSON
    file_path = "./weapons.json"
    
    # Charger les données du fichier JSON
    weapons_data = load_json(file_path)
    
    # Liste des attributs à analyser
    attributes = [
        "mode.un-coup.semi-auto", "mode.un-coup.repetition-manuelle", "mode.un-coup.a 1 coup", 
        "mode.multi-coup.automatique", "mode.multi-coup.rafale", "utilisation.cible_theorique.sportif", 
        "utilisation.cible_reelle.cible_legales.chasse", "utilisation.cible_reelle.cible_legales.militaire", 
        "utilisation.cible_reelle.cible_illegales.tueur-a-gage", "utilisation.cible_reelle.cible_illegales.gangster", 
        "canon.canon-lisse", "canon.canon-rayé", "prise.arme-de-poing", "prise.arme-d-epaule", 
        "projectile.unique", "projectile.multiple", "porte.court", "porte.moyenne", "porte.long", 
        "mecanisme.repetition-manuelle", "mecanisme.tire-unique", "mecanisme.automatique.full-auto", 
        "mecanisme.automatique.semi-auto", "categorie.cat-D", "categorie.cat-C", "categorie.cat-B", "categorie.cat-A", 
        "modele"
    ]
    
    # Calculer le gain d'information pour chaque attribut
    sorted_attributes = sort_attributes_by_information_gain(weapons_data, attributes)
    
    # Afficher les attributs triés par gain d'information (les meilleurs en premier)
    print("Attributs triés par gain d'information (les plus pertinents en premier):")
    for attribute, gain in sorted_attributes:
        print(f"{attribute}: Gain d'Information = {gain}")
