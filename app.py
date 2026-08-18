import streamlit as st
import random

# --- Konfigurasi Awal ---
st.set_page_config(page_title="Zombie Tower Evolution", page_icon="🏰")

# --- Inisialisasi State ---
if "level" not in st.session_state: st.session_state.level = 1
if "gold" not in st.session_state: st.session_state.gold = 50
if "hp" not in st.session_state: st.session_state.hp = 100

# --- Fungsi Logika ---
def get_tower_visual(lvl):
    """Mengembalikan visual dan deskripsi berdasarkan level."""
    if lvl <= 20:
        return "🧱", "Wooden Palisade", "Pertahanan awal dari kayu, sangat rentan."
    elif lvl <= 40:
        return "🏰", "Iron Fortress", "Benteng besi yang kokoh menahan serangan zombie."
    elif lvl <= 60:
        return "⚡", "Tesla Coil Tower", "Menara listrik dengan sengatan jutaan volt."
    elif lvl <= 80:
        return "🔫", "Plasma Laser Cannon", "Meriam teknologi tinggi penghancur zombie."
    else:
        return "🚀", "GOD-TIER MECHA FORTRESS", "Benteng robot penghancur yang legendaris!"

# --- Tampilan Header ---
st.title("🧟 Zombie Tower Defense")
level = st.session_state.level
icon, name, desc = get_tower_visual(level)

# Visual Tower yang Membesar (menggunakan Markdown)
st.markdown(f"<h1 style='text-align: center; font-size: 100px;'>{icon}</h1>", unsafe_allow_html=True)
st.markdown(f"<h2 style='text-align: center;'>{name} (Lv. {level})</h2>", unsafe_allow_html=True)
st.write(f"**Deskripsi:** {desc}")

# --- Stats ---
col1, col2, col3 = st.columns(3)
col1.metric("🪙 Gold", f"{st.session_state.gold}")
col2.metric("❤️ HP Tower", f"{st.session_state.hp}")
col3.metric("📈 Damage", f"{level * 5}")

# --- Gameplay Buttons ---
st.divider()
st.subheader("Action Menu")

c1, c2 = st.columns(2)

# Tombol Upgrade
cost = 50 + (level * 10)
if c1.button(f"⬆️ Upgrade Tower ({cost} Gold)"):
    if st.session_state.gold >= cost:
        st.session_state.gold -= cost
        st.session_state.level += 1
        st.balloons()
        st.success("Tower Berevolusi!")
        st.rerun()
    else:
        st.error("Gold tidak cukup!")

# Tombol Serang Zombie
if c2.button("⚔️ Serang Gelombang Zombie"):
    gold_earn = random.randint(10, 30) + (level * 2)
    damage_taken = max(0, 10 - (level // 10)) # Semakin tinggi level, semakin sedikit damage
    
    st.session_state.gold += gold_earn
    st.session_state.hp -= damage_taken
    
    if st.session_state.hp <= 0:
        st.error("Game Over! Tower Anda hancur.")
        if st.button("Restart Game"):
            st.session_state.level = 1
            st.session_state.gold = 50
            st.session_state.hp = 100
            st.rerun()
    else:
        st.info(f"Berhasil mengalahkan zombie! Dapat {gold_earn} Gold, tapi terkena {damage_taken} damage.")
        st.rerun()

# --- Progress Bar ---
st.progress(min(st.session_state.level / 100, 1.0))