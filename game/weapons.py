"""Data dan fungsi dasar untuk semua senjata tower."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Weapon:
    key: str
    name: str
    icon: str
    damage: int
    cost: int
    description: str
    effect: str


WEAPONS: dict[str, Weapon] = {
    "cannon": Weapon(
        key="cannon",
        name="Cannon",
        icon="💣",
        damage=30,
        cost=50,
        description="Damage besar untuk satu target.",
        effect="single_target",
    ),
    "tesla": Weapon(
        key="tesla",
        name="Tesla",
        icon="⚡",
        damage=18,
        cost=60,
        description="Listrik cepat yang nantinya dapat memantul.",
        effect="chain",
    ),
    "freeze": Weapon(
        key="freeze",
        name="Freeze",
        icon="❄️",
        damage=8,
        cost=45,
        description="Damage kecil dengan efek perlambatan.",
        effect="slow",
    ),
    "rocket": Weapon(
        key="rocket",
        name="Roket",
        icon="🚀",
        damage=45,
        cost=80,
        description="Ledakan kuat untuk sekelompok musuh.",
        effect="area_damage",
    ),
    "laser": Weapon(
        key="laser",
        name="Laser",
        icon="🔆",
        damage=25,
        cost=70,
        description="Sinar fokus yang efektif melawan target besar.",
        effect="pierce",
    ),
}


def get_weapon(key: str) -> Weapon:
    """Mengambil data senjata dan memberi error jelas jika key tidak valid."""
    try:
        return WEAPONS[key]
    except KeyError as error:
        raise ValueError(f"Senjata '{key}' tidak tersedia.") from error


def weapon_keys() -> list[str]:
    """Mengembalikan daftar key senjata dalam urutan tampilan game."""
    return list(WEAPONS.keys())
