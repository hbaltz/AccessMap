from geoalchemy2 import Geometry
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    String,
)
from sqlalchemy.orm import declarative_base, relationship

meta = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(column_0_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)
Base = declarative_base(metadata=meta)


class Building(Base):
    __tablename__ = "building"
    uuid = Column(
        String(36),
        unique=True,
        primary_key=True,
        index=True,
    )
    name = Column(String(256))
    postal_code = Column(Integer)
    num_street = Column(String(256))
    street = Column(String(256))
    city = Column(String(256))
    contact_url = Column(String(256))
    website_url = Column(String(256))
    gps_coord = Column(Geometry("POINT", spatial_index=False))
    activity_id = Column(Integer, ForeignKey("activity.id"), index=True)

    activity = relationship("Activity")  # type: ignore
    accessibility = relationship("Accessibility", back_populates="building")  # type: ignore


# We add index manually so it's well detected by Alembic
Index("idx_centre_gps_coord", Building.__table__.c.gps_coord, postgresql_using="gist")


class Activity(Base):
    __tablename__ = "activity"
    id = Column(Integer, primary_key=True, autoincrement=True, unique=True, index=True)
    name = Column(
        String(256),
        unique=True,
    )
    icon_name = Column(String(256))

    buildings = relationship(  # type: ignore
        "Building", viewonly=True
    )


class Accessibility(Base):
    __tablename__ = "accessibility"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    building_id = Column(
        String,
        ForeignKey("building.uuid"),
        unique=True,
        index=True,
    )
    transport_station_presence = Column(Boolean, nullable=True)
    stationnement_presence = Column(Boolean, nullable=True)
    stationnement_pmr = Column(Boolean, nullable=True)
    stationnement_ext_presence = Column(Boolean, nullable=True)
    stationnement_ext_pmr = Column(Boolean, nullable=True)
    cheminement_ext_presence = Column(Boolean, nullable=True)
    cheminement_ext_terrain_stable = Column(Boolean, nullable=True)
    cheminement_ext_plain_pied = Column(Boolean, nullable=True)
    cheminement_ext_ascenseur = Column(Boolean, nullable=True)
    cheminement_ext_nombre_marches = Column(Integer, nullable=True)
    cheminement_ext_reperage_marches = Column(Boolean, nullable=True)
    cheminement_ext_sens_marches = Column(String(50), nullable=True)
    cheminement_ext_main_courante = Column(Boolean, nullable=True)
    cheminement_ext_rampe = Column(String(50), nullable=True)
    cheminement_ext_pente_presence = Column(Boolean, nullable=True)
    cheminement_ext_pente_degre_difficulte = Column(String(50), nullable=True)
    cheminement_ext_pente_longueur = Column(String(50), nullable=True)
    cheminement_ext_devers = Column(String(50), nullable=True)
    cheminement_ext_bande_guidage = Column(Boolean, nullable=True)
    cheminement_ext_retrecissement = Column(Boolean, nullable=True)
    entree_reperage = Column(Boolean, nullable=True)
    entree_vitree = Column(Boolean, nullable=True)
    entree_vitree_vitrophanie = Column(Boolean, nullable=True)
    entree_plain_pied = Column(Boolean, nullable=True)
    entree_ascenseur = Column(Boolean, nullable=True)
    entree_marches = Column(Integer, nullable=True)
    entree_marches_reperage = Column(Boolean, nullable=True)
    entree_marches_main_courante = Column(Boolean, nullable=True)
    entree_marches_rampe = Column(String(50), nullable=True)
    entree_marches_sens = Column(String(50), nullable=True)
    entree_dispositif_appel = Column(Boolean, nullable=True)
    entree_dispositif_appel_type = Column(JSON, nullable=True)
    entree_balise_sonore = Column(Boolean, nullable=True)
    entree_aide_humaine = Column(Boolean, nullable=True)
    entree_largeur_mini = Column(Integer, nullable=True)
    entree_pmr = Column(Boolean, nullable=True)
    entree_porte_presence = Column(Boolean, nullable=True)
    entree_porte_manoeuvre = Column(String(50), nullable=True)
    entree_porte_type = Column(String(50), nullable=True)
    accueil_visibilite = Column(Boolean, nullable=True)
    accueil_personnels = Column(String(50), nullable=True)
    accueil_audiodescription_presence = Column(Boolean, nullable=True)
    accueil_audiodescription = Column(JSON, nullable=True)
    accueil_equipements_malentendants_presence = Column(Boolean, nullable=True)
    accueil_equipements_malentendants = Column(JSON, nullable=True)
    accueil_cheminement_plain_pied = Column(Boolean, nullable=True)
    accueil_cheminement_ascenseur = Column(Boolean, nullable=True)
    accueil_cheminement_nombre_marches = Column(Integer, nullable=True)
    accueil_cheminement_reperage_marches = Column(Boolean, nullable=True)
    accueil_cheminement_main_courante = Column(Boolean, nullable=True)
    accueil_cheminement_rampe = Column(String(50), nullable=True)
    accueil_cheminement_sens_marches = Column(String(50), nullable=True)
    accueil_chambre_nombre_accessibles = Column(Integer, nullable=True)
    accueil_chambre_douche_plain_pied = Column(Boolean, nullable=True)
    accueil_chambre_douche_siege = Column(Boolean, nullable=True)
    accueil_chambre_douche_barre_appui = Column(Boolean, nullable=True)
    accueil_chambre_sanitaires_barre_appui = Column(Boolean, nullable=True)
    accueil_chambre_sanitaires_espace_usage = Column(Boolean, nullable=True)
    accueil_chambre_numero_visible = Column(Boolean, nullable=True)
    accueil_chambre_equipement_alerte = Column(Boolean, nullable=True)
    accueil_chambre_accompagnement = Column(Boolean, nullable=True)
    accueil_retrecissement = Column(Boolean, nullable=True)
    sanitaires_presence = Column(Boolean, nullable=True)
    sanitaires_adaptes = Column(Boolean, nullable=True)
    labels = Column(JSON, nullable=True)
    labels_familles_handicap = Column(JSON, nullable=True)
    conformite = Column(Boolean, nullable=True)

    building = relationship(  # type: ignore
        "Building", back_populates="accessibility", overlaps="accessibility"
    )
