import ast
from typing import List, Literal, Union, cast

from fastapi.responses import ORJSONResponse

AllowedAccessibilityCategories = Literal[
    "transport", "stationnement", "chemin", "entree", "acceuil", "sanitaire"
]


def create_category_dict(
    category: AllowedAccessibilityCategories,
) -> dict[str, Union[str, List[str]]]:
    """
    Create a dictionary for a specific category.

    Parameters:
    - category (AllowedAccessibilityCategories): The category for which to create the dictionary.

    Returns:
    - dict: A dictionary containing the category label, icon, and accessibility information.
    """
    category_dict = {
        "transport": {"label": "Transport", "icon": "bus"},
        "stationnement": {"label": "Stationnement", "icon": "square-parking"},
        "chemin": {"label": "Cheminement", "icon": "route"},
        "acceuil": {"label": "Accueil et équipement", "icon": "user"},
        "entree": {"label": "Entrée", "icon": "door-open"},
        "sanitaire": {"label": "Sanitaire", "icon": "toilet"},
    }

    if category not in category_dict:
        raise ValueError("Invalid category provided.")

    return {**category_dict[category], "accesbility_information": []}


def has_at_least_one_key(d: dict, keys: list) -> bool:
    """
    Verify if a dictionary has at least one of the provided keys.
    """
    return bool(set(d.keys()) & set(keys))


def format_negation(message: str) -> str:
    """
    Formats the negation properly:
    - Uses "Pas d’" if the message starts with a vowel or h
    - Uses "Pas de" otherwise.
    """
    vowels = {"a", "e", "i", "o", "u", "é", "è", "ê", "à"}
    first_letter = message.lstrip().lower()[0]
    negation = "Pas d'" if first_letter in vowels else "Pas de "
    lowered_message = message[0].lower() + message[1:]
    return f"{negation}{lowered_message}"


def manage_transport_accessibility_information(row: dict) -> dict | None:
    """
    Manage accessibility information for the "Transport" category.

    Parameters:
    - row (dict): A dictionary containing accessibility data for "Stationnement".

    Returns:
    - dict | None: A dictionary with processed accessibility information, or None if no relevant data is found.
    """
    transport_keys = {"transport_station_presence": "Station de transport à l'extérieur"}

    if not has_at_least_one_key(row, list(transport_keys.keys())):
        return None

    transport_dict = create_category_dict("transport")
    acces_info = acces_info = cast(List[str], transport_dict["accesbility_information"])

    # Boolean values processing
    for key, message in transport_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    return transport_dict


def manage_stationnement_accessibility_information(row: dict) -> dict | None:
    """
    Manage accessibility information for the "Stationnement" category.

    Parameters:
    - row (dict): A dictionary containing accessibility data for "Stationnement".

    Returns:
    - dict | None: A dictionary with processed accessibility information, or None if no relevant data is found.
    """
    stationnement_keys = {
        "stationnement_presence": "Stationnement à l'intérieur de l'établissement",
        "stationnement_pmr": "Stationnement adapté aux PMR à l'intérieur de l'établissement",
        "stationnement_ext_presence": "Stationnement à l'extérieur de l'établissement",
        "stationnement_ext_pmr": "Stationnement adapté aux PMR à l'extérieur de l'établissement",
    }

    if not has_at_least_one_key(row, list(stationnement_keys.keys())):
        return None

    stationnement_dict = create_category_dict("stationnement")
    acces_info = acces_info = cast(
        List[str], stationnement_dict["accesbility_information"]
    )

    # Boolean values processing
    for key, message in stationnement_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    return stationnement_dict


def manage_chemin_accessibility_information(row: dict) -> dict | None:
    """
    Manage accessibility information for the "Chemin" category.

    Parameters:
    - row (dict): A dictionary containing accessibility data for "Chemin".

    Returns:
    - dict | None: A dictionary with processed accessibility information, or None if no relevant data is found.
    """
    chemin_keys = {
        "cheminement_ext_presence": "Chemin à l'extérieur de l'établissement",
        "cheminement_ext_terrain_stable": "Chemin sur un terrain stable",
        "cheminement_ext_plain_pied": "Chemin de plain pied",
        "cheminement_ext_ascenseur": "Ascenseur à l'extérieur de l'établissement",
        "cheminement_ext_reperage_marches": "Repères sur les marches",
        "cheminement_ext_main_courante": "Main courante au niveau des marches",
        "cheminement_ext_pente_presence": "Pente dans le chemin d'accès",
        "cheminement_ext_bande_guidage": "Bande de guidage le long du chemin",
        "cheminement_ext_retrecissement": "Rétrécissement le long du chemin",
    }

    parameter_chemin_keys = {
        "cheminement_ext_rampe": "Rampe d'accès aux marches: {}",
        "cheminement_ext_nombre_marches": "{} marches à l'extérieur de l'établissement",
        "cheminement_ext_sens_marches": "Marches: sens {}",
        "cheminement_ext_pente_degre_difficulte": "Degré de la pente: {}%",
        "cheminement_ext_pente_longueur": "Longueur de la pente: {}cm",
        "cheminement_ext_devers": "Dévers: {}%",
    }

    if not has_at_least_one_key(
        row, list(chemin_keys.keys()) + list(parameter_chemin_keys.keys())
    ):
        return None

    chemin_dict = create_category_dict("chemin")
    acces_info = acces_info = cast(List[str], chemin_dict["accesbility_information"])

    # Ajout des valeurs booléennes
    for key, message in chemin_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    # Gestion des valeurs spécifiques (entiers / chaînes)
    for key, message in parameter_chemin_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message.format(row[key]))

    return chemin_dict


def manage_entree_accessibility_information(
    row: dict,
) -> dict[str, Union[str, List[str]]] | None:
    """
    Manage accessibility information for the "Entrée" category.

    Parameters:
    - row (dict): A dictionary containing accessibility data for "Entrée".

    Returns:
    - dict | None: A dictionary with processed accessibility information, or None if no relevant data is found.
    """
    entree_keys = {
        "entree_porte_presence": "Porte à l'entrée",
        "entree_reperage": "Repères à l'entrée",
        "entree_vitree": "Entrée vitrée",
        "entree_vitree_vitrophanie": "Vitrophanie sur l'entrée vitrée",
        "entree_plain_pied": "Entrée de plain-pied",
        "entree_ascenseur": "Ascenseur à l'entrée",
        "entree_marches_reperage": "Repères des marches à l'entrée",
        "entree_marches_main_courante": "Main courante sur les marches de l'entrée",
        "entree_balise_sonore": "Balise sonore à l'entrée",
        "entree_aide_humaine": "Aide humaine à l'entrée",
        "entree_pmr": "Entrée adaptée aux PMR",
        "entree_dispositif_appel": "Dispositif d'appel à l'entrée",
    }

    parameter_entree_keys = {
        "entree_dispositif_appel_type": "Types de dispositifs d'appel disponibles: {}",
        "entree_marches": "Nombre de marches à l'entrée: {}",
        "entree_marches_rampe": "Rampe d'accès aux marches: {}",
        "entree_marches_sens": "Sens des marches: {}",
        "entree_largeur_mini": "Largeur minimale de l'entrée: {} cm",
        "entree_porte_manoeuvre": "Manœuvre de la porte d'entrée: {}",
        "entree_porte_type": "Type de porte d'entrée: {}",
    }

    if not has_at_least_one_key(
        row, list(entree_keys.keys()) + list(parameter_entree_keys.keys())
    ):
        return None

    entree_dict = create_category_dict("entree")
    acces_info = cast(List[str], entree_dict["accesbility_information"])

    # Processing boolean values
    for key, message in entree_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    # Processing special keys (int/str values)
    for key, message in parameter_entree_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(
                message.format(
                    ", ".join(row[key])  # type: ignore[arg-type]
                    if isinstance(row[key], list)
                    else row[key]
                )
            )

    return entree_dict


def manage_accueil_accessibility_information(row: dict) -> dict | None:
    accueil_keys = {
        "accueil_visibilite": "Accueil visible",
        "accueil_audiodescription_presence": "Présence d'équipement d'audiodescription",
        "accueil_equipements_malentendants_presence": "Présence d'équipements pour malentendants",
        "accueil_cheminement_plain_pied": "Cheminement de plain-pied",
        "accueil_cheminement_ascenseur": "Ascenseur dans l'établissement",
        "accueil_cheminement_reperage_marches": "Repérage des marches",
        "accueil_cheminement_main_courante": "Main courante dans les escalier",
        "accueil_chambre_douche_plain_pied": "Douche de plain-pied",
        "accueil_chambre_douche_siege": "Siège de douche",
        "accueil_chambre_douche_barre_appui": "Barre d'appui dans la douche",
        "accueil_chambre_sanitaires_barre_appui": "Barre d'appui dans les sanitaires",
        "accueil_chambre_sanitaires_espace_usage": "Espace d'usage dans les sanitaires",
        "accueil_chambre_numero_visible": "Numéro de chambre visible",
        "accueil_chambre_equipement_alerte": "Équipement d'alerte dans l'établissement",
        "accueil_chambre_accompagnement": "Accompagnement dans l'établissement",
        "accueil_retrecissement": "Rétrécissement dans l'accueil",
    }

    paramter_accueil_keys = {
        "accueil_personnels": "Personnels: {}",
        "accueil_audiodescription": "Audiodescription disponible: {}",
        "accueil_equipements_malentendants": "Équipements pour malentendants: {}",
        "accueil_cheminement_nombre_marches": "Nombre de marches: {}",
        "accueil_cheminement_rampe": "Rampe: {}",
        "accueil_cheminement_sens_marches": "Sens des marches: {}",
        "accueil_chambre_nombre_accessibles": "Nombre de chambres accessibles: {}",
    }

    if not has_at_least_one_key(
        row, list(accueil_keys.keys()) + list(paramter_accueil_keys.keys())
    ):
        return None

    accueil_dict = create_category_dict("acceuil")
    acces_info = cast(List[str], accueil_dict["accesbility_information"])

    for key, message in accueil_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    for key, message in paramter_accueil_keys.items():
        if key in row and row[key] is not None:
            acces_info.append(
                message.format(
                    ", ".join(row[key]) if isinstance(row[key], list) else row[key]
                )
            )

    return accueil_dict


def manage_sanitaire_accessibility_information(row: dict) -> dict | None:
    sanitaire_key = {
        "sanitaires_presence": "Sanitaires dans l'établissement",
        "sanitaires_adaptes": "Sanitaires adaptés aux PMR",
    }

    if not has_at_least_one_key(row, list(sanitaire_key.keys())):
        return None

    sanitaire_dict = create_category_dict("sanitaire")
    acces_info = cast(List[str], sanitaire_dict["accesbility_information"])

    # Boolean values processing with proper negation handling
    for key, message in sanitaire_key.items():
        if key in row and row[key] is not None:
            acces_info.append(message if row[key] else format_negation(message))

    return sanitaire_dict


def create_no_accessibility_information_response(building_uuid: str) -> ORJSONResponse:
    return ORJSONResponse(
        {
            "message": "Aucune information d'accesibilité renseignée pour le moment",
            "building_uuid": building_uuid,
        },
        status_code=404,
    )


def format_build_accessibility_response(
    row: dict | None, building_uuid: str
) -> ORJSONResponse:
    """
    Format the building accessibility response to be returned as an API response.

    Parameters:
    - row (dict): Row of building accessibility data fetched from the database.

    Returns:
    - dict: A formatted response containing building accessibility details. We return human-readable information.
    """
    if row is None:
        return create_no_accessibility_information_response(building_uuid)

    # Remove None values and convert stringified lists to actual lists
    cleaned_data = {}
    for key, val in row.items():
        if val is not None:
            # Try to convert stringified lists into actual lists
            try:
                if isinstance(val, str):
                    print(key, val)
                if isinstance(val, str) and val.startswith('"[') and val.endswith(']"'):
                    val = val.replace('\\"', '"')  # Remove the backslashes
                    val = val[1:-1]  # Remove the surrounding quotes
                    val = ast.literal_eval(
                        val
                    )  # This converts the stringified list into a Python list
                    for v in val:
                        print(v)
            except ValueError:
                pass  # If parsing fails, leave val as it is
            cleaned_data[key] = val

    formatted_result = []

    transport_dict = manage_transport_accessibility_information(cleaned_data)
    if transport_dict:
        formatted_result.append(transport_dict)

    stationnement_dict = manage_stationnement_accessibility_information(cleaned_data)
    if stationnement_dict:
        formatted_result.append(stationnement_dict)

    chemin_dict = manage_chemin_accessibility_information(cleaned_data)
    if chemin_dict:
        formatted_result.append(chemin_dict)

    entree_dict = manage_entree_accessibility_information(cleaned_data)
    if entree_dict:
        formatted_result.append(entree_dict)

    acceuil_dict = manage_accueil_accessibility_information(cleaned_data)
    if acceuil_dict:
        formatted_result.append(acceuil_dict)

    sanitaire_dict = manage_sanitaire_accessibility_information(cleaned_data)
    if sanitaire_dict:
        formatted_result.append(sanitaire_dict)

    if len(formatted_result) == 0:
        return create_no_accessibility_information_response(building_uuid)

    return ORJSONResponse(formatted_result)
