"""Halaman utama Streamlit untuk Tower Fusion.

File ini hanya menghubungkan state game, komponen UI, dan aset.
Logika permainan berada di folder game/, sedangkan tampilan berada di ui/.
"""

from pathlib import Path

import streamlit as st

from game.state import GameState
from ui.battle_view import render_battle_panel, render_game_message
from ui.sidebar import render_sidebar
from ui.styles import apply_global_styles
from ui.tower_view import render_build_panel, render_tower


st.set_page_config(
    page_title="Tower Fusion",
    page_icon="🏰",
    layout="wide",
    initial_sidebar_state="expanded",
)


def get_game() -> GameState:
    """Mengambil state game dari Streamlit atau memulai game baru."""
    if "game_state" not in st.session_state:
        st.session_state.game_state = GameState()
    return st.session_state.game_state


def reset_game() -> None:
    """Mengganti seluruh state permainan dengan permainan baru."""
    st.session_state.game_state = GameState()


def render_game_stats(game: GameState) -> None:
    """Menampilkan statistik penting di bagian atas halaman."""
    stat1, stat2, stat3, stat4 = st.columns(4)
    stat1.metric("💰 Kredit", game.money)
    stat2.metric("🌊 Wave berikutnya", game.wave)
    stat3.metric("❤️ Base HP", game.base_hp)
    stat4.metric("🎯 Total damage", game.tower.total_damage)


def render_svg(asset_path: str, max_width: int | None = None) -> None:
    """Menampilkan SVG inline tanpa MediaFileStorage Streamlit.

    Path dihitung dari lokasi app.py, bukan working directory deployment.
    Jika aset belum ikut ter-push ke GitHub, game tetap berjalan tanpa gambar.
    """
    project_root = Path(__file__).resolve().parent
    svg_file = project_root / asset_path

    if not svg_file.is_file():
        # Jangan sampai aset opsional menghentikan seluruh game di Streamlit Cloud.
        return

    svg = svg_file.read_text(encoding="utf-8")
    style = "width: 100%;" if max_width is None else f"width: min(100%, {max_width}px);"
    st.markdown(
        f'<div style="{style} margin: 0 auto;">{svg}</div>',
        unsafe_allow_html=True,
    )


def main() -> None:
    apply_global_styles()
    game = get_game()

    # Sidebar dapat meminta game dimulai ulang.
    if render_sidebar(game):
        reset_game()
        st.rerun()

    logo_col, title_col = st.columns([1, 3])
    with logo_col:
        render_svg("assets/images/logo.svg")
    with title_col:
        st.title("🏰 Tower Fusion")
        st.caption(
            "Bangun menara lima lantai, gabungkan senjata, "
            "dan lindungi base dari gelombang musuh."
        )

    render_game_stats(game)
    st.divider()

    tower_col, action_col = st.columns([1.15, 1])
    with tower_col:
        render_tower(game)
        render_svg("assets/images/tower.svg", max_width=280)

    with action_col:
        state_changed = render_build_panel(game)
        st.divider()
        battle_started = render_battle_panel(game)

    # Setelah aksi diproses, lakukan rerun agar semua angka dan UI terbaru tampil.
    if state_changed or battle_started:
        if game.tower.fusion_ready and state_changed:
            st.balloons()
        st.rerun()

    st.divider()
    render_game_message(game)

    with st.expander("ℹ️ Tentang prototype ini"):
        st.write(
            "Versi awal ini memakai perhitungan battle per-wave. "
            "Tahap pengembangan berikutnya dapat menambahkan upgrade pilihan, "
            "efek slow, chain lightning, damage area, jenis musuh lebih banyak, "
            "dan sinergi berdasarkan urutan lantai."
        )

    st.caption("Tower Fusion prototype • Dibuat dengan Python dan Streamlit")


if __name__ == "__main__":
    main()
