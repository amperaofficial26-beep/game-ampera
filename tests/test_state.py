from game.state import GameState


def test_new_game_has_expected_starting_values():
    game = GameState()

    assert game.money == 200
    assert game.wave == 1
    assert game.base_hp == 100
    assert game.tower.floors == []
    assert game.is_game_over is False


def test_building_floor_deducts_correct_credits():
    game = GameState()
    message = game.build_floor("cannon")

    assert "berhasil" in message
    assert game.money == 150
    assert game.tower.floors == ["cannon"]


def test_cannot_build_when_credits_are_insufficient():
    game = GameState(money=10)
    message = game.build_floor("rocket")

    assert "kurang" in message.lower()
    assert game.tower.floors == []
    assert game.money == 10


def test_cannot_start_wave_without_a_floor():
    game = GameState()

    result = game.play_wave()

    assert result is None
    assert "minimal" in game.message
    assert game.wave == 1


def test_winning_wave_increases_wave_and_credits():
    game = GameState()
    game.tower.floors = ["rocket", "rocket"]
    starting_money = game.money

    result = game.play_wave()

    assert result is not None
    assert result.won is True
    assert game.wave == 2
    assert game.money == starting_money + result.credits_earned


def test_losing_wave_reduces_base_hp():
    game = GameState()
    game.tower.floors = ["freeze"]

    result = game.play_wave()

    assert result is not None
    assert result.won is False
    assert game.base_hp < 100
    assert game.wave == 2
