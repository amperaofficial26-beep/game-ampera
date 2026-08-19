from game.battle import resolve_battle
from game.enemies import Enemy, create_wave_enemy
from game.tower import Tower


def test_normal_wave_one_enemy_is_created():
    enemy = create_wave_enemy(1)

    assert enemy.name == "Raider"
    assert enemy.hp == 85
    assert enemy.reward == 55
    assert enemy.is_boss is False


def test_every_fifth_wave_is_a_boss():
    enemy = create_wave_enemy(5)

    assert enemy.name == "Siege Boss"
    assert enemy.is_boss is True
    assert enemy.hp > create_wave_enemy(4).hp


def test_tower_wins_when_damage_reaches_enemy_hp():
    tower = Tower(["rocket", "rocket"])
    enemy = Enemy(name="Test enemy", hp=80, reward=99, base_damage=20)

    result = resolve_battle(tower, enemy)

    assert result.won is True
    assert result.damage_dealt == 90
    assert result.credits_earned == 99
    assert result.base_damage == 0


def test_enemy_damages_base_when_tower_loses():
    tower = Tower(["freeze"])
    enemy = Enemy(name="Test enemy", hp=100, reward=99, base_damage=20)

    result = resolve_battle(tower, enemy)

    assert result.won is False
    assert result.credits_earned == 0
    assert result.base_damage == 112


def test_fusion_applies_damage_bonus():
    tower = Tower(["cannon", "tesla", "freeze", "rocket", "laser"])
    enemy = Enemy(name="Test boss", hp=180, reward=200, base_damage=50)

    result = resolve_battle(tower, enemy)

    assert result.used_fusion is True
    assert result.damage_dealt == 189
    assert result.won is True
