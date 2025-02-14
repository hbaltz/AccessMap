import textwrap

from accesmap.app.api.sql_query_builder.sql_accessibility import (
    build_sql_query_building_accessibility,
)


def test_build_sql_query_building_accessibility() -> None:
    query = build_sql_query_building_accessibility()

    expected_query = """
        SELECT 
            transport_station_presence,
            stationnement_presence,
            stationnement_pmr,
            stationnement_ext_presence,
            stationnement_ext_pmr,
            cheminement_ext_presence,
            cheminement_ext_terrain_stable,
            cheminement_ext_plain_pied,
            cheminement_ext_ascenseur,
            cheminement_ext_nombre_marches,
            cheminement_ext_reperage_marches,
            cheminement_ext_sens_marches,
            cheminement_ext_main_courante,
            cheminement_ext_rampe,
            cheminement_ext_pente_presence,
            cheminement_ext_pente_degre_difficulte,
            cheminement_ext_pente_longueur,
            cheminement_ext_devers,
            cheminement_ext_bande_guidage,
            cheminement_ext_retrecissement,
            entree_reperage,
            entree_vitree,
            entree_vitree_vitrophanie,
            entree_plain_pied,
            entree_ascenseur,
            entree_marches,
            entree_marches_reperage,
            entree_marches_main_courante,
            entree_marches_rampe,
            entree_marches_sens,
            entree_dispositif_appel,
            entree_dispositif_appel_type,
            entree_balise_sonore,
            entree_aide_humaine,
            entree_largeur_mini,
            entree_pmr,
            entree_porte_presence,
            entree_porte_manoeuvre,
            entree_porte_type,
            accueil_visibilite,
            accueil_personnels,
            accueil_audiodescription_presence,
            accueil_audiodescription,
            accueil_equipements_malentendants_presence,
            accueil_equipements_malentendants,
            accueil_cheminement_plain_pied,
            accueil_cheminement_ascenseur,
            accueil_cheminement_nombre_marches,
            accueil_cheminement_reperage_marches,
            accueil_cheminement_main_courante,
            accueil_cheminement_rampe,
            accueil_cheminement_sens_marches,
            accueil_chambre_nombre_accessibles,
            accueil_chambre_douche_plain_pied,
            accueil_chambre_douche_siege,
            accueil_chambre_douche_barre_appui,
            accueil_chambre_sanitaires_barre_appui,
            accueil_chambre_sanitaires_espace_usage,
            accueil_chambre_numero_visible,
            accueil_chambre_equipement_alerte,
            accueil_chambre_accompagnement,
            accueil_retrecissement,
            sanitaires_presence,
            sanitaires_adaptes          
        FROM 
            accessibility 
        WHERE
            building_id = $1;
    """

    # Using textwrap.dedent to normalize indentation
    query = textwrap.dedent(query).strip()
    expected_query = textwrap.dedent(expected_query).strip()

    assert query == expected_query
