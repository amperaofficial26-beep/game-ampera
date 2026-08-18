"""State permainan tingkat tinggi yang menggabungkan tower dan battle."""

from dataclasses import dataclass, field

from .balance import STARTING_BASE_HP, STARTING_CREDITS
from .battle import BattleResult, resolve_battle
from .enemies import Enemy, create_wave_enemy
from .tower import Tower
from .weapons import get_weapon


@dataclass
class GameState:
    money: int = STARTING_CREDITS
    wave: int = 1
    base_hp: int = STARTING_BASE_HP
    tower: Tower = field(default_factory=Tower)
    message: str = "Bangun menara pertamamu untuk menghadapi wave 1."

    @property
    def is_game_over(self) -> bool:
        return self.base_hp <= 0

    def build_floor(self, weapon_key: str) -> str:
        if self.is_game_over:
            return "Game over. Reset permainan untuk membangun lagi."

        weapon = get_weapon(weapon_key)
        if self.money < weapon.cost:
            return f"Kredit kurang. {weapon.name} membutuhkan {weapon.cost} kredit."

        try:
            self.tower.add_floor(weapon_key)
        except ValueError as error:
            return str(error)

        self.money -= weapon.cost
        self.message = f"Lantai {len(self.tower.floors)}: {weapon.name} berhasil dibangun."
        return self.message

    def current_enemy(self) -> Enemy:
        return create_wave_enemy(self.wave)

    def play_wave(self) -> BattleResult | None:
        if self.is_game_over:
            self.message = "Game over. Reset permainan untuk mencoba lagi."
            return None
        if not self.tower.floors:
            self.message = "Bangun minimal satu lantai sebelum memulai wave."
            return None

        enemy = self.current_enemy()
        result = resolve_battle(self.tower, enemy)
        if result.won:
            self.money += result.credits_earned
        else:
            self.base_hp = max(0, self.base_hp - result.base_damage)

        self.wave += 1
        self.message = result.summary
        return result
