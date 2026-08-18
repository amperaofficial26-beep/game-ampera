import pytest

from game.tower import MAX_FLOORS, Tower


def test_empty_tower_has_zero_damage_and_no_fusion():
    tower = Tower()

    assert tower.total_damage == 0
    assert tower.is_full is False
    assert tower.fusion_ready is False
    assert tower.floor_weapon(1) is None


def test_tower_can_add_up_to_five_floors():
    tower = Tower()
    for weapon in ["cannon", "tesla", "freeze", "rocket", "laser"]:
        tower.add_floor(weapon)

    assert len(tower.floors) == MAX_FLOORS
    assert tower.is_full is True
    assert tower.total_damage == 126


def test_fusion_requires_five_different_weapons():
    tower = Tower()
    for weapon in ["cannon", "tesla", "freeze", "rocket", "laser"]:
        tower.add_floor(weapon)

    assert tower.fusion_ready is True
    assert tower.fusion_name == "Fusion Beam"


def test_duplicate_weapon_build_does_not_activate_fusion():
    tower = Tower()
    for weapon in ["cannon", "cannon", "cannon", "cannon", "cannon"]:
        tower.add_floor(weapon)

    assert tower.is_full is True
    assert tower.fusion_ready is False


def test_cannot_add_more_than_five_floors():
    tower = Tower()
    for _ in range(MAX_FLOORS):
        tower.add_floor("cannon")

    with pytest.raises(ValueError, match="penuh"):
        tower.add_floor("laser")


def test_floor_number_validation_and_removal():
    tower = Tower(["cannon", "laser"])

    assert tower.floor_weapon(1).name == "Cannon"
    assert tower.floor_weapon(2).name == "Laser"
    assert tower.remove_top_floor() == "laser"

    with pytest.raises(ValueError, match="antara"):
        tower.floor_weapon(6)
