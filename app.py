import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Tower Fusion 3D",
    page_icon="⚡",
    layout="wide",
)

GAME_URL = "https://amperaofficial26-beep.github.io/game-ampera/"

st.title("⚡ Tower Fusion 3D")
st.caption("Bangun tower lima lantai dan pertahankan base dari robot penyerang.")

components.iframe(
    GAME_URL,
    height=850,
    scrolling=False,
)

st.caption("Tower Fusion 3D • Three.js + WebGL • Dibuka melalui Streamlit")
