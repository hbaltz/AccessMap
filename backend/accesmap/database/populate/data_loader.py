import numpy as np
import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from accesmap.app.models.building import Accessibility, Activity, Building
from accesmap.database.populate.mapping_activity_icon import mapping_activity_icon

# Define the URL of the CSV file
DEFAULT_URL = (
    "https://www.data.gouv.fr/fr/datasets/r/93ae96a7-1db7-4cb4-a9f1-6d778370b640"
)
url = "data.csv"


class DataLoader:
    """charge les donnees necessaire pour les différents outils
    dans la base de données depuis des données CSV"""

    def __init__(self, session: AsyncSession) -> None:
        self.sa_session = session

    def read_csv(self, filepath: str, sep: str = ",") -> pd.DataFrame:
        print(f"Reading file {filepath} ...", end="")
        data = pd.read_csv((filepath), sep=sep)
        data = data.replace({np.nan: None})
        print("Done")
        return data

    async def populate_activity(self, data: pd.DataFrame) -> dict[str, int]:
        uniq_activities = data["activite"].unique()

        activity_params = []

        for activity in uniq_activities:
            activity_params.append(
                {
                    "name": activity,
                    "icon_name": mapping_activity_icon.get(activity, "question"),
                }
            )

        result = await self.sa_session.execute(
            insert(Activity)
            .on_conflict_do_nothing(index_elements=["name"])
            .returning(Activity.id, Activity.name),
            params=activity_params,
        )

        # We recover this activity dict for the building creation (building contain activity id)
        rows = result.fetchall()
        activity_name_id_dict = {row.name: row.id for row in rows}
        return activity_name_id_dict

    async def populate_building_and_accessibility(
        self, data: pd.DataFrame, activity_name_id_dict: dict[str, int]
    ) -> None:
        params_building = []
        params_accessibility = []

        for _index, row in data.iterrows():
            params_building.append(
                {
                    "uuid": row["id"],
                    "name": row["name"],
                    "postal_code": row["postal_code"],
                    "num_street": row["numero"],
                    "street": row["voie"],
                    "city": row["commune"],
                    "website_url": row["site_internet"],
                    "contact_url": row["contact_url"],
                    "gps_coord": f"POINT({row['longitude']} {row['latitude']})",
                    "activity_id": activity_name_id_dict.get(row["activite"]),
                }
            )

            params_accessibility.append(
                {
                    "building_id": row["id"],
                    "transport_station_presence": row["transport_station_presence"],
                    "stationnement_presence": row["stationnement_presence"],
                    "stationnement_pmr": row["stationnement_pmr"],
                    "stationnement_ext_presence": row["stationnement_ext_presence"],
                    "stationnement_ext_pmr": row["stationnement_ext_pmr"],
                    "cheminement_ext_presence": row["cheminement_ext_presence"],
                    "cheminement_ext_terrain_stable": row[
                        "cheminement_ext_terrain_stable"
                    ],
                    "cheminement_ext_plain_pied": row["cheminement_ext_plain_pied"],
                    "cheminement_ext_ascenseur": row["cheminement_ext_ascenseur"],
                    "cheminement_ext_nombre_marches": row[
                        "cheminement_ext_nombre_marches"
                    ],
                    "cheminement_ext_reperage_marches": row[
                        "cheminement_ext_reperage_marches"
                    ],
                    "cheminement_ext_sens_marches": row["cheminement_ext_sens_marches"],
                    "cheminement_ext_main_courante": row["cheminement_ext_main_courante"],
                    "cheminement_ext_rampe": row["cheminement_ext_rampe"],
                    "cheminement_ext_pente_presence": row[
                        "cheminement_ext_pente_presence"
                    ],
                    "cheminement_ext_pente_degre_difficulte": row[
                        "cheminement_ext_pente_degre_difficulte"
                    ],
                    "cheminement_ext_pente_longueur": row[
                        "cheminement_ext_pente_longueur"
                    ],
                    "cheminement_ext_devers": row["cheminement_ext_devers"],
                    "cheminement_ext_bande_guidage": row["cheminement_ext_bande_guidage"],
                    "cheminement_ext_retrecissement": row[
                        "cheminement_ext_retrecissement"
                    ],
                    "entree_reperage": row["entree_reperage"],
                    "entree_vitree": row["entree_vitree"],
                    "entree_vitree_vitrophanie": row["entree_vitree_vitrophanie"],
                    "entree_plain_pied": row["entree_plain_pied"],
                    "entree_ascenseur": row["entree_ascenseur"],
                    "entree_marches": row["entree_marches"],
                    "entree_marches_reperage": row["entree_marches_reperage"],
                    "entree_marches_main_courante": row["entree_marches_main_courante"],
                    "entree_marches_rampe": row["entree_marches_rampe"],
                    "entree_marches_sens": row["entree_marches_sens"],
                    "entree_dispositif_appel": row["entree_dispositif_appel"],
                    "entree_dispositif_appel_type": row["entree_dispositif_appel_type"],
                    "entree_balise_sonore": row["entree_balise_sonore"],
                    "entree_aide_humaine": row["entree_aide_humaine"],
                    "entree_largeur_mini": row["entree_largeur_mini"],
                    "entree_pmr": row["entree_pmr"],
                    "entree_porte_presence": row["entree_porte_presence"],
                    "entree_porte_manoeuvre": row["entree_porte_manoeuvre"],
                    "entree_porte_type": row["entree_porte_type"],
                    "accueil_visibilite": row["accueil_visibilite"],
                    "accueil_personnels": row["accueil_personnels"],
                    "accueil_audiodescription_presence": row[
                        "accueil_audiodescription_presence"
                    ],
                    "accueil_audiodescription": row["accueil_audiodescription"],
                    "accueil_equipements_malentendants_presence": row[
                        "accueil_equipements_malentendants_presence"
                    ],
                    "accueil_equipements_malentendants": row[
                        "accueil_equipements_malentendants"
                    ],
                    "accueil_cheminement_plain_pied": row[
                        "accueil_cheminement_plain_pied"
                    ],
                    "accueil_cheminement_ascenseur": row["accueil_cheminement_ascenseur"],
                    "accueil_cheminement_nombre_marches": row[
                        "accueil_cheminement_nombre_marches"
                    ],
                    "accueil_cheminement_reperage_marches": row[
                        "accueil_cheminement_reperage_marches"
                    ],
                    "accueil_cheminement_main_courante": row[
                        "accueil_cheminement_main_courante"
                    ],
                    "accueil_cheminement_rampe": row["accueil_cheminement_rampe"],
                    "accueil_cheminement_sens_marches": row[
                        "accueil_cheminement_sens_marches"
                    ],
                    "accueil_chambre_nombre_accessibles": row[
                        "accueil_chambre_nombre_accessibles"
                    ],
                    "accueil_chambre_douche_plain_pied": row[
                        "accueil_chambre_douche_plain_pied"
                    ],
                    "accueil_chambre_douche_siege": row["accueil_chambre_douche_siege"],
                    "accueil_chambre_douche_barre_appui": row[
                        "accueil_chambre_douche_barre_appui"
                    ],
                    "accueil_chambre_sanitaires_barre_appui": row[
                        "accueil_chambre_sanitaires_barre_appui"
                    ],
                    "accueil_chambre_sanitaires_espace_usage": row[
                        "accueil_chambre_sanitaires_espace_usage"
                    ],
                    "accueil_chambre_numero_visible": row[
                        "accueil_chambre_numero_visible"
                    ],
                    "accueil_chambre_equipement_alerte": row[
                        "accueil_chambre_equipement_alerte"
                    ],
                    "accueil_chambre_accompagnement": row[
                        "accueil_chambre_accompagnement"
                    ],
                    "accueil_retrecissement": row["accueil_retrecissement"],
                    "sanitaires_presence": row["sanitaires_presence"],
                    "sanitaires_adaptes": row["sanitaires_adaptes"],
                    "labels": row["labels"],
                    "labels_familles_handicap": row["labels_familles_handicap"],
                    "conformite": row["conformite"],
                }
            )

        await self.sa_session.execute(
            insert(Building).on_conflict_do_nothing(index_elements=["uuid"]),
            params=params_building,
        )

        await self.sa_session.execute(
            insert(Accessibility).on_conflict_do_nothing(index_elements=["building_id"]),
            params=params_accessibility,
        )
