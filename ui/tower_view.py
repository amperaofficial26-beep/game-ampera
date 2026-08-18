"""Tampilan tower dan kontrol pembangunan lantai."""

import streamlit as st

from game.state import GameState
from game.weapons import WEAPONS, weapon_keys


def render_tower(game: GameState) -> None:
    """Menampilkan lima slot lantai, dari atap sampai lantai dasar."""
    st.subheader("🏗️ Menara kamu")

    for floor_number in range(5, 0, -1):
        weapon = game.tower.floor_weapon(floor_number)
        if weapon is None:
            st.markdown(
                f'<div class="tf-empty-floor">Lantai {floor_number} — ⬜ Kosong</div>',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                (
                    '<div class="tf-floor">'
                    f'Lantai {floor_number} — {weapon.icon} <b>{weapon.name}</b> '
                    f'| Damage: {weapon.damage}'
                    "</div>"
                ),
                unsafe_allow_html=True,
            )

    if game.tower.fusion_ready:
        st.success("⚡ FUSION READY — Fusion Beam memberi bonus damage 50% pada battle.")
    elif game.tower.is_full:
        st.info("Menara sudah lengkap. Gunakan lima senjata berbeda untuk mengaktifkan Fusion Beam.")


def render_build_panel(game: GameState) -> bool:
    """Menampilkan pilihan senjata dan tombol bangun.

    Mengembalikan True jika state game berubah sehingga app perlu rerun.
    """
    st.subheader("🔧 Bangun lantai")

    choices = weapon_keys()
    selected_key = st.selectbox(
        "Pilih senjata",
        choices,
        format_func=lambda key: f"{WEAPONS[key].icon} {WEAPONS[key].name}",
        disabled=game.tower.is_full or game.is_game_over,
    )
    weapon = WEAPONS[selected_key]

    st.markdown(f"### {weapon.icon} {weapon.name}")
    st.write(weapon.description)
    price, damage = st.columns(2)
    price.metric("Harga", f"{weapon.cost} kredit")
    damage.metric("Damage", weapon.damage)

    if st.button(
        "➕ Bangun lantai",
        type="primary",
        use_container_width=True,
        disabled=game.tower.is_full or game.is_game_over,
    ):
        game.build_floor(selected_key)
        return True

    return False
