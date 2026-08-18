"""Sidebar informasi, instruksi, dan tombol reset."""

import streamlit as st

from game.state import GameState


def render_sidebar(game: GameState) -> bool:
    """Render sidebar. Mengembalikan True jika pemain meminta reset."""
    with st.sidebar:
        st.header("📖 Cara bermain")
        st.write("1. Pilih senjata untuk lantai baru.")
        st.write("2. Bangun menara hingga lima lantai.")
        st.write("3. Lawan wave untuk mendapatkan kredit.")
        st.write("4. Isi lima lantai dengan lima senjata berbeda untuk Fusion Beam.")

        st.divider()
        st.subheader("📊 Status menara")
        st.write(f"Lantai terisi: **{len(game.tower.floors)}/5**")
        st.write(f"Fusion: **{'Siap ⚡' if game.tower.fusion_ready else 'Belum siap'}**")

        st.divider()
        st.caption("Prototype: efek slow, chain, area, dan upgrade akan ditampilkan pada tahap berikutnya.")
        return st.button("🔄 Reset permainan", use_container_width=True)
