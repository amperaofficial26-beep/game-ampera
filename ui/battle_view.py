"""Tampilan informasi musuh dan tombol memulai wave."""

import streamlit as st

from game.state import GameState


def render_battle_panel(game: GameState) -> bool:
    """Render panel battle dan memainkan wave bila tombol ditekan.

    Mengembalikan True apabila battle telah diproses.
    """
    st.subheader("⚔️ Pertempuran")

    if not game.is_game_over:
        enemy = game.current_enemy()
        st.write(f"Musuh wave {game.wave}: **{'👑 ' if enemy.is_boss else '👾 '}{enemy.name}**")
        stat1, stat2 = st.columns(2)
        stat1.metric("HP musuh", enemy.hp)
        stat2.metric("Hadiah menang", f"{enemy.reward} kredit")

    if st.button(
        "⚔️ Mulai wave",
        use_container_width=True,
        disabled=not game.tower.floors or game.is_game_over,
    ):
        game.play_wave()
        return True

    return False


def render_game_message(game: GameState) -> None:
    """Menampilkan pesan hasil aksi terbaru dengan gaya sesuai kondisi game."""
    if game.is_game_over:
        st.error(f"☠️ Base hancur. {game.message}")
    elif game.message.startswith("🏆"):
        st.success(game.message)
    elif game.message.startswith("💥") or "kurang" in game.message.lower():
        st.warning(game.message)
    else:
        st.info(game.message)
