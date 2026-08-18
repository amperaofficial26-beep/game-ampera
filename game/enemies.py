"""Jenis dan generator musuh untuk setiap wave."""

from dataclasses import dataclass


@dataclass
class Enemy:
    name: str
    hp: int
    reward: int
    base_damage: int
    is_boss: bool = False


ENEMY_TYPES = {
    "scout": {"name": "Scout", "hp_multiplier": 0.75, "reward_multiplier": 0.8},
    "normal": {"name": "Raider", "hp_multiplier": 1.0, "reward_multiplier": 1.0},
    "tank": {"name": "Tank", "hp_multiplier": 1.8, "reward_multiplier": 1.5},
    "boss": {"name": "Siege Boss", "hp_multiplier": 4.0, "reward_multiplier": 3.0},
}


def create_wave_enemy(wave: int) -> Enemy:
    """Membuat satu representasi musuh utama untuk prototype per-wave."""
    if wave < 1:
        raise ValueError("Wave harus dimulai dari angka 1.")

    if wave % 5 == 0:
        enemy_type = "boss"
    elif wave % 3 == 0:
        enemy_type = "tank"
    elif wave % 2 == 0:
        enemy_type = "scout"
    else:
        enemy_type = "normal"

    data = ENEMY_TYPES[enemy_type]
    base_hp = 50 + (wave * 35)
    hp = int(base_hp * data["hp_multiplier"])
    reward = int((40 + wave * 15) * data["reward_multiplier"])

    return Enemy(
        name=data["name"],
        hp=hp,
        reward=reward,
        base_damage=max(10, hp // 4),
        is_boss=enemy_type == "boss",
    )
