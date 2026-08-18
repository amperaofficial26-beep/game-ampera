"""Model menara lima lantai dan aturan fusion."""

from dataclasses import dataclass, field

from .weapons import WEAPONS, Weapon, get_weapon

MAX_FLOORS = 5


@dataclass
class Tower:
    floors: list[str] = field(default_factory=list)

    @property
    def is_full(self) -> bool:
        return len(self.floors) >= MAX_FLOORS

    @property
    def total_damage(self) -> int:
        return sum(get_weapon(weapon_key).damage for weapon_key in self.floors)

    @property
    def fusion_ready(self) -> bool:
        """Fusion aktif bila lima lantai terisi dengan lima senjata berbeda."""
        return self.is_full and len(set(self.floors)) == MAX_FLOORS

    @property
    def fusion_name(self) -> str | None:
        if self.fusion_ready:
            return "Fusion Beam"
        return None

    def add_floor(self, weapon_key: str) -> Weapon:
        """Menambah satu lantai dan mengembalikan data senjatanya."""
        if self.is_full:
            raise ValueError("Menara sudah penuh. Maksimal lima lantai.")
        weapon = get_weapon(weapon_key)
        self.floors.append(weapon.key)
        return weapon

    def remove_top_floor(self) -> str:
        if not self.floors:
            raise ValueError("Belum ada lantai untuk dihapus.")
        return self.floors.pop()

    def floor_weapon(self, floor_number: int) -> Weapon | None:
        """Nomor lantai dimulai dari 1 (lantai paling bawah)."""
        if floor_number < 1 or floor_number > MAX_FLOORS:
            raise ValueError(f"Nomor lantai harus antara 1 dan {MAX_FLOORS}.")
        if floor_number > len(self.floors):
            return None
        return get_weapon(self.floors[floor_number - 1])

    def weapon_counts(self) -> dict[str, int]:
        return {key: self.floors.count(key) for key in WEAPONS}
