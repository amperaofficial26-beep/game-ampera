import pytest

from game.weapons import WEAPONS, get_weapon, weapon_keys


def test_game_has_exactly_five_base_weapons():
    assert len(WEAPONS) == 5
    assert weapon_keys() == ["cannon", "tesla", "freeze", "rocket", "laser"]


def test_each_weapon_has_positive_cost_and_damage():
    for weapon in WEAPONS.values():
        assert weapon.cost > 0
        assert weapon.damage > 0
        assert weapon.name
        assert weapon.description


def test_get_weapon_returns_correct_weapon():
    weapon = get_weapon("rocket")

    assert weapon.name == "Roket"
    assert weapon.damage == 45


def test_get_weapon_rejects_unknown_weapon():
    with pytest.raises(ValueError, match="tidak tersedia"):
        get_weapon("plasma")
