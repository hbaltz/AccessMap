import orjson
import pytest
from fastapi.responses import ORJSONResponse

from accesmap.app.api.formatters.formatter_accessibility import (
    AllowedAccessibilityCategories,
    create_category_dict,
    create_no_accessibility_information_response,
    format_build_accessibility_response,
    format_negation,
    has_at_least_one_key,
    manage_accueil_accessibility_information,
    manage_chemin_accessibility_information,
    manage_entree_accessibility_information,
    manage_sanitaire_accessibility_information,
    manage_stationnement_accessibility_information,
    manage_transport_accessibility_information,
)


@pytest.mark.parametrize(
    "category_name, expected_dict_output",
    [
        (
            "transport",
            {
                "label": "Transport",
                "icon": "bus",
                "accesbility_information": [],
            },
        ),
        (
            "stationnement",
            {
                "label": "Stationnement",
                "icon": "square-parking",
                "accesbility_information": [],
            },
        ),
        (
            "chemin",
            {
                "label": "Cheminement",
                "icon": "route",
                "accesbility_information": [],
            },
        ),
        (
            "acceuil",
            {
                "label": "Accueil et équipement",
                "icon": "user",
                "accesbility_information": [],
            },
        ),
        (
            "entree",
            {
                "label": "Entrée",
                "icon": "door-open",
                "accesbility_information": [],
            },
        ),
        (
            "sanitaire",
            {
                "label": "Sanitaire",
                "icon": "toilet",
                "accesbility_information": [],
            },
        ),
    ],
)
def test_create_category_dict(
    category_name: AllowedAccessibilityCategories, expected_dict_output: dict
) -> None:
    """
    It should return a dictionary with the category label, icon and accessibility information.
    """
    assert create_category_dict(category_name) == expected_dict_output


def test_create_category_dict_raiserror() -> None:
    """
    It should raise a ValueError if the category is not valid.
    """
    with pytest.raises(ValueError):
        create_category_dict("invalid_category")  # type: ignore[arg-type]


def test_has_at_least_one_key_true() -> None:
    """
    It should return True if at least one key is present in the dictionary.
    """
    assert has_at_least_one_key({"a": 1, "b": 2}, ["b", "c"]) is True


def test_has_at_least_one_key_false() -> None:
    """
    It should return False if no key is present in the dictionary.
    """
    assert has_at_least_one_key({"a": 1, "b": 2}, ["c", "d"]) is False


@pytest.mark.parametrize(
    "message, expected_negation_message",
    [
        (
            "Abc",
            "Pas d'abc",
        ),
        (
            "efg",
            "Pas d'efg",
        ),
        (
            "Ijk",
            "Pas d'ijk",
        ),
        (
            "opq",
            "Pas d'opq",
        ),
        (
            "uvw",
            "Pas d'uvw",
        ),
        (
            "é",
            "Pas d'é",
        ),
        (
            "è",
            "Pas d'è",
        ),
        (
            "ê",
            "Pas d'ê",
        ),
        (
            "à",
            "Pas d'à",
        ),
        ("Test", "Pas de test"),
    ],
)
def test_format_negation(message: str, expected_negation_message: str) -> None:
    """
    It should return the negation of the message.
    """
    assert format_negation(message) == expected_negation_message


def test_manage_transport_accessibility_information() -> None:
    """
    It should return a dictionary with the transport accessibility information.
    """
    row = {"transport_station_presence": True, "other_test": True}
    result = manage_transport_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Transport"
    assert result["icon"] == "bus"
    assert result["accesbility_information"] == ["Station de transport à l'extérieur"]


def test_manage_transport_accessibility_information_empty() -> None:
    """
    It should return None if no transport accessibility information is present.
    """
    result = manage_transport_accessibility_information({})
    assert result is None


def test_manage_stationnement_accessibility_information() -> None:
    """
    It should return a dictionary with the parking accessibility information.
    """
    row = {
        "stationnement_presence": True,
        "stationnement_pmr": True,
        "stationnement_ext_presence": False,
        "stationnement_ext_pmr": False,
        "other_test": True,
    }
    result = manage_stationnement_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Stationnement"
    assert result["icon"] == "square-parking"
    assert result["accesbility_information"] == [
        "Stationnement à l'intérieur de l'établissement",
        "Stationnement adapté aux PMR à l'intérieur de l'établissement",
        "Pas de stationnement à l'extérieur de l'établissement",
        "Pas de stationnement adapté aux PMR à l'extérieur de l'établissement",
    ]


def test_manage_stationnement_accessibility_information_one_information() -> None:
    """
    It should return a dictionary with the parking accessibility information, if there is at least one parking info
    """
    row = {
        "stationnement_presence": False,
        "other_test": True,
    }
    result = manage_stationnement_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Stationnement"
    assert result["icon"] == "square-parking"
    assert result["accesbility_information"] == [
        "Pas de stationnement à l'intérieur de l'établissement",
    ]


def test_manage_stationnement_accessibility_information_empty() -> None:
    """
    It should return None if no parking accessibility information is present.
    """
    result = manage_stationnement_accessibility_information({})
    assert result is None


def test_manage_chemin_accessibility_information() -> None:
    """
    It should return a dictionary with the path accessibility information.
    """
    row = {
        "cheminement_ext_presence": True,
        "cheminement_ext_terrain_stable": True,
        "cheminement_ext_plain_pied": True,
        "cheminement_ext_ascenseur": False,
        "cheminement_ext_reperage_marches": True,
        "cheminement_ext_main_courante": False,
        "cheminement_ext_pente_presence": False,
        "cheminement_ext_bande_guidage": False,
        "cheminement_ext_retrecissement": False,
        "cheminement_ext_rampe": "fixe",
        "cheminement_ext_nombre_marches": 5,
        "cheminement_ext_sens_marches": "montante",
        "cheminement_ext_pente_degre_difficulte": 5,
        "cheminement_ext_pente_longueur": 30,
        "cheminement_ext_devers": 3,
    }

    excepted_result = [
        "Chemin à l'extérieur de l'établissement",
        "Chemin sur un terrain stable",
        "Chemin de plain pied",
        "Pas d'ascenseur à l'extérieur de l'établissement",
        "Repères sur les marches",
        "Pas de main courante au niveau des marches",
        "Pas de pente dans le chemin d'accès",
        "Pas de bande de guidage le long du chemin",
        "Pas de rétrécissement le long du chemin",
        "Rampe d'accès aux marches: fixe",
        "5 marches à l'extérieur de l'établissement",
        "Marches: sens montante",
        "Degré de la pente: 5%",
        "Longueur de la pente: 30cm",
        "Dévers: 3%",
    ]

    result = manage_chemin_accessibility_information(row)

    assert result is not None
    assert result["label"] == "Cheminement"
    assert result["icon"] == "route"
    assert result["accesbility_information"] == excepted_result


def test_manage_chemin_accessibility_information_one_information() -> None:
    """
    It should return a dictionary with the path accessibility information, if there is at least one parking info
    """
    row = {
        "cheminement_ext_rampe": "aucune",
        "other_test": True,
    }
    result = manage_chemin_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Cheminement"
    assert result["icon"] == "route"
    assert result["accesbility_information"] == [
        "Rampe d'accès aux marches: aucune",
    ]


def test_manage_chemin_accessibility_information_empty() -> None:
    """
    It should return None if no path accessibility information is present.
    """
    result = manage_stationnement_accessibility_information({"other_test": True})
    assert result is None


def test_manage_entree_accessibility_information() -> None:
    """
    It should return a dictionary with the entrance accessibility information.
    """
    row = {
        "entree_porte_presence": True,
        "entree_reperage": True,
        "entree_vitree": True,
        "entree_vitree_vitrophanie": False,
        "entree_plain_pied": True,
        "entree_ascenseur": False,
        "entree_marches_reperage": True,
        "entree_marches_main_courante": False,
        "entree_balise_sonore": True,
        "entree_aide_humaine": True,
        "entree_pmr": False,
        "entree_dispositif_appel": True,
        "entree_dispositif_appel_type": ["bouton", "interphone"],
        "entree_marches": 3,
        "entree_marches_rampe": "amovible",
        "entree_marches_sens": "descendant",
        "entree_largeur_mini": 52,
        "entree_porte_manoeuvre": "battante",
        "entree_porte_type": "automatique",
    }

    excepted_result = [
        "Porte à l'entrée",
        "Repères à l'entrée",
        "Entrée vitrée",
        "Pas de vitrophanie sur l'entrée vitrée",
        "Entrée de plain-pied",
        "Pas d'ascenseur à l'entrée",
        "Repères des marches à l'entrée",
        "Pas de main courante sur les marches de l'entrée",
        "Balise sonore à l'entrée",
        "Aide humaine à l'entrée",
        "Pas d'entrée adaptée aux PMR",
        "Dispositif d'appel à l'entrée",
        "Types de dispositifs d'appel disponibles: bouton, interphone",
        "Nombre de marches à l'entrée: 3",
        "Rampe d'accès aux marches: amovible",
        "Sens des marches: descendant",
        "Largeur minimale de l'entrée: 52 cm",
        "Manœuvre de la porte d'entrée: battante",
        "Type de porte d'entrée: automatique",
    ]

    result = manage_entree_accessibility_information(row)

    assert result is not None
    assert result["label"] == "Entrée"
    assert result["icon"] == "door-open"
    assert result["accesbility_information"] == excepted_result


def test_manage_entree_accessibility_information_one_information() -> None:
    """
    It should return a dictionary with the entrance accessibility information, if there is at least one parking info
    """
    row = {
        "entree_balise_sonore": False,
        "other_test": True,
    }
    result = manage_entree_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Entrée"
    assert result["icon"] == "door-open"
    assert result["accesbility_information"] == [
        "Pas de balise sonore à l'entrée",
    ]


def test_manage_entree_accessibility_information_empty() -> None:
    """
    It should return None if no entrance accessibility information is present.
    """
    result = manage_entree_accessibility_information({"other_test": True})
    assert result is None


def test_manage_accueil_accessibility_information() -> None:
    """
    It should return a dictionary with the reception accessibility information.
    """
    row = {
        "accueil_visibilite": True,
        "accueil_audiodescription_presence": False,
        "accueil_equipements_malentendants_presence": True,
        "accueil_cheminement_plain_pied": True,
        "accueil_cheminement_ascenseur": False,
        "accueil_cheminement_reperage_marches": True,
        "accueil_cheminement_main_courante": False,
        "accueil_chambre_douche_plain_pied": True,
        "accueil_chambre_douche_siege": False,
        "accueil_chambre_douche_barre_appui": True,
        "accueil_chambre_sanitaires_barre_appui": False,
        "accueil_chambre_sanitaires_espace_usage": True,
        "accueil_chambre_numero_visible": True,
        "accueil_chambre_equipement_alerte": False,
        "accueil_chambre_accompagnement": True,
        "accueil_retrecissement": False,
        "accueil_personnels": "formés",
        "accueil_audiodescription": ["avec équipement permanent"],
        "accueil_equipements_malentendants": ["bim", "lsf", "lpc"],
        "accueil_cheminement_nombre_marches": 5,
        "accueil_cheminement_rampe": "fixe",
        "accueil_cheminement_sens_marches": "montant",
        "accueil_chambre_nombre_accessibles": 3,
    }

    excepted_result = [
        "Accueil visible",
        "Pas de présence d'équipement d'audiodescription",
        "Présence d'équipements pour malentendants",
        "Cheminement de plain-pied",
        "Pas d'ascenseur dans l'établissement",
        "Repérage des marches",
        "Pas de main courante dans les escalier",
        "Douche de plain-pied",
        "Pas de siège de douche",
        "Barre d'appui dans la douche",
        "Pas de barre d'appui dans les sanitaires",
        "Espace d'usage dans les sanitaires",
        "Numéro de chambre visible",
        "Pas d'équipement d'alerte dans l'établissement",
        "Accompagnement dans l'établissement",
        "Pas de rétrécissement dans l'accueil",
        "Personnels: formés",
        "Audiodescription disponible: avec équipement permanent",
        "Équipements pour malentendants: bim, lsf, lpc",
        "Nombre de marches: 5",
        "Rampe: fixe",
        "Sens des marches: montant",
        "Nombre de chambres accessibles: 3",
    ]

    result = manage_accueil_accessibility_information(row)

    assert result is not None
    assert result["label"] == "Accueil et équipement"
    assert result["icon"] == "user"
    assert result["accesbility_information"] == excepted_result


def test_manage_accueil_accessibility_information_one_information() -> None:
    """
    It should return a dictionary with the reception accessibility information, if there is at least one parking info
    """
    row = {
        "accueil_audiodescription_presence": True,
        "other_test": True,
    }
    result = manage_accueil_accessibility_information(row)
    assert result is not None
    assert result["label"] == "Accueil et équipement"
    assert result["icon"] == "user"
    assert result["accesbility_information"] == [
        "Présence d'équipement d'audiodescription",
    ]


def test_manage_accueil_accessibility_information_empty() -> None:
    """
    It should return None if no reception accessibility information is present.
    """
    result = manage_accueil_accessibility_information({"other_test": True})
    assert result is None


def test_manage_sanitaire_accessibility_information() -> None:
    """
    It should return a dictionary with the sanitary accessibility information.
    """
    row = {
        "sanitaires_presence": True,
        "sanitaires_adaptes": False,
    }

    excepted_result = [
        "Sanitaires dans l'établissement",
        "Pas de sanitaires adaptés aux PMR",
    ]

    result = manage_sanitaire_accessibility_information(row)

    assert result is not None
    assert result["label"] == "Sanitaire"
    assert result["icon"] == "toilet"
    assert result["accesbility_information"] == excepted_result


def test_create_no_accessibility_information_response() -> None:
    """
    It should return a ORJSONRespon with a status error 404and a message
    """
    building_uuid = "123e4567-e89b-12d3-a456-426614174000"
    response = create_no_accessibility_information_response(building_uuid)

    assert isinstance(response, ORJSONResponse)
    assert response.status_code == 404

    excepted_result = {
        "message": "Aucune information d'accesibilité renseignée pour le moment",
        "building_uuid": building_uuid,
    }

    assert orjson.loads(response.body) == excepted_result


def test_format_build_accessibility_response() -> None:
    """
    It should format a request response from the data in row
    """
    building_uuid = "123e4567-e89b-12d3-a456-426614174000"
    row = {
        "transport_station_presence": True,
        "stationnement_presence": True,
        "cheminement_ext_rampe": "aucune",
        "entree_porte_presence": True,
        "accueil_visibilite": True,
        "sanitaires_presence": True,
    }
    response = format_build_accessibility_response(row, building_uuid)
    assert response.status_code == 200

    excepted_result = [
        {
            "label": "Transport",
            "icon": "bus",
            "accesbility_information": ["Station de transport à l'extérieur"],
        },
        {
            "label": "Stationnement",
            "icon": "square-parking",
            "accesbility_information": ["Stationnement à l'intérieur de l'établissement"],
        },
        {
            "label": "Cheminement",
            "icon": "route",
            "accesbility_information": ["Rampe d'accès aux marches: aucune"],
        },
        {
            "label": "Entrée",
            "icon": "door-open",
            "accesbility_information": ["Porte à l'entrée"],
        },
        {
            "label": "Accueil et équipement",
            "icon": "user",
            "accesbility_information": ["Accueil visible"],
        },
        {
            "label": "Sanitaire",
            "icon": "toilet",
            "accesbility_information": ["Sanitaires dans l'établissement"],
        },
    ]

    assert orjson.loads(response.body) == excepted_result


def test_format_build_accessibility_response_not_all_category() -> None:
    """
    It should only keep information about category containing at least one
    """
    building_uuid = "123e4567-e89b-12d3-a456-426614174000"
    row = {
        "cheminement_ext_rampe": "aucune",
    }
    response = format_build_accessibility_response(row, building_uuid)
    assert response.status_code == 200

    excepted_result = [
        {
            "label": "Cheminement",
            "icon": "route",
            "accesbility_information": ["Rampe d'accès aux marches: aucune"],
        },
    ]

    assert orjson.loads(response.body) == excepted_result


def test_format_build_accessibility_response_none() -> None:
    """
    It should return a ORJSONRespon with a status error 404 and a message if the row is None
    """
    building_uuid = "123e4567-e89b-12d3-a456-426614174000"
    response = format_build_accessibility_response(None, building_uuid)

    assert isinstance(response, ORJSONResponse)
    assert response.status_code == 404

    excepted_result = {
        "message": "Aucune information d'accesibilité renseignée pour le moment",
        "building_uuid": building_uuid,
    }

    assert orjson.loads(response.body) == excepted_result


def test_format_build_accessibility_response_row_no_info() -> None:
    """
    It should return a ORJSONRespon with a status error 404 and a message if the row doesn't contains any useful information
    """
    building_uuid = "123e4567-e89b-12d3-a456-426614174000"
    row = {"test": True, "useless_info": "Lorem ipsum"}
    response = format_build_accessibility_response(row, building_uuid)

    assert isinstance(response, ORJSONResponse)
    assert response.status_code == 404

    excepted_result = {
        "message": "Aucune information d'accesibilité renseignée pour le moment",
        "building_uuid": building_uuid,
    }

    assert orjson.loads(response.body) == excepted_result
