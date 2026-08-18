"""Perhitungan hasil pertarungan antara menara dan satu wave musuh."""

from dataclasses import dataclass

from .enemies import Enemy
from .tower import Tower


@dataclass
class BattleResult:
    won: bool
    damage_dealt: int
    enemy_hp: int
    credits_earned: int
    base_damage: int
    used_fusion: bool
    summary: str


def resolve_battle(tower: Tower, enemy: Enemy) -> BattleResult:
    """Menghitung pertarungan ringkas satu wave.

    Pada versi berikutnya, fungsi ini dapat dikembangkan menjadi simulasi
    beberapa musuh, cooldown, target, slow, chain lightning, dan efek area.
    """
    damage = tower.total_damage
    used_fusion = tower.fusion_ready

    # Bonus awal Fusion: 50% damage. Detail ultimate dapat ditambah nanti.
    if used_fusion:
        damage = int(damage * 1.5)

    if damage >= enemy.hp:
        fusion_text = " dengan bonus Fusion Beam" if used_fusion else ""
        return BattleResult(
            won=True,
            damage_dealt=damage,
            enemy_hp=enemy.hp,
            credits_earned=enemy.reward,
            base_damage=0,
            used_fusion=used_fusion,
            summary=(
                f"🏆 {enemy.name} dikalahkan{fusion_text}! "
                f"Damage: {damage} / HP musuh: {enemy.hp}."
            ),
        )

    # Bila musuh lolos, damage base bertambah sesuai sisa HP.
    overflow_damage = enemy.base_damage + (enemy.hp - damage)
    return BattleResult(
        won=False,
        damage_dealt=damage,
        enemy_hp=enemy.hp,
        credits_earned=0,
        base_damage=overflow_damage,
        used_fusion=used_fusion,
        summary=(
            f"💥 {enemy.name} lolos dari pertahanan. "
            f"Damage menara: {damage} / HP musuh: {enemy.hp}."
        ),
    )
