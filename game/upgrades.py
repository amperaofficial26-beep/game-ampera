"""Definisi upgrade roguelite. Belum dipasang ke antarmuka Streamlit."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Upgrade:
    key: str
    name: str
    description: str
    weapon_key: str | None
    damage_bonus: int = 0
    cost: int = 0


UPGRADES: dict[str, Upgrade] = {
    "heavy_shells": Upgrade(
        key="heavy_shells",
        name="Heavy Shells",
        description="Cannon mendapat +12 damage.",
        weapon_key="cannon",
        damage_bonus=12,
        cost=70,
    ),
    "chain_coil": Upgrade(
        key="chain_coil",
        name="Chain Coil",
        description="Tesla mendapat +8 damage. Efek pantulan akan ditambahkan.",
        weapon_key="tesla",
        damage_bonus=8,
        cost=75,
    ),
    "deep_freeze": Upgrade(
        key="deep_freeze",
        name="Deep Freeze",
        description="Freeze mendapat +6 damage dan slow lebih kuat nanti.",
        weapon_key="freeze",
        damage_bonus=6,
        cost=60,
    ),
    "warhead": Upgrade(
        key="warhead",
        name="Warhead Plus",
        description="Roket mendapat +20 damage.",
        weapon_key="rocket",
        damage_bonus=20,
        cost=100,
    ),
    "focus_lens": Upgrade(
        key="focus_lens",
        name="Focus Lens",
        description="Laser mendapat +15 damage.",
        weapon_key="laser",
        damage_bonus=15,
        cost=90,
    ),
}


def get_upgrade(key: str) -> Upgrade:
    try:
        return UPGRADES[key]
    except KeyError as error:
        raise ValueError(f"Upgrade '{key}' tidak tersedia.") from error
