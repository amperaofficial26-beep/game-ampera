import streamlit as st

# ------------------------------------------------------------
# Tower Fusion — prototype Streamlit dalam satu file.
# Logika game akan dipindah ke file/folder terpisah pada tahap berikutnya.
# ------------------------------------------------------------

WEAPONS = {
    "Cannon": {
        "icon": "💣",
        "damage": 30,
        "cost": 50,
        "description": "Damage besar untuk satu target.",
    },
    "Tesla": {
        "icon": "⚡",
        "damage": 18,
        "cost": 60,
        "description": "Listrik cepat yang nantinya dapat memantul.",
    },
    "Freeze": {
        "icon": "❄️",
        "damage": 8,
        "cost": 45,
        "description": "Damage kecil, tetapi memperlambat musuh.",
    },
    "Roket": {
        "icon": "🚀",
        "damage": 45,
        "cost": 80,
        "description": "Ledakan damage tinggi untuk area musuh.",
    },
    "Laser": {
        "icon": "🔆",
        "damage": 25,
        "cost": 70,
        "description": "Sinar fokus yang kuat melawan musuh besar.",
    },
}


def new_game() -> None:
    """Membuat data permainan awal di session Streamlit."""
    st.session_state.money = 200
    st.session_state.wave = 1
    st.session_state.base_hp = 100
    st.session_state.floors = []
    st.session_state.message = "Bangun menara pertamamu untuk menghadapi wave 1."


def ensure_game_state() -> None:
    if "money" not in st.session_state:
        new_game()


def total_damage() -> int:
    return sum(WEAPONS[weapon]["damage"] for weapon in st.session_state.floors)


def build_floor(weapon: str) -> None:
    if len(st.session_state.floors) >= 5:
        st.session_state.message = "⚠️ Menara sudah penuh: maksimal 5 lantai."
        return

    cost = WEAPONS[weapon]["cost"]
    if st.session_state.money < cost:
        st.session_state.message = f"❌ Uang kurang. {weapon} membutuhkan {cost} kredit."
        return

    st.session_state.money -= cost
    st.session_state.floors.append(weapon)
    st.session_state.message = f"✅ Lantai {len(st.session_state.floors)}: {weapon} berhasil dibangun."


def start_wave() -> None:
    if not st.session_state.floors:
        st.session_state.message = "⚠️ Bangun minimal satu lantai sebelum memulai wave."
        return

    current_wave = st.session_state.wave
    enemy_hp = 50 + (current_wave * 35)
    damage = total_damage()

    if damage >= enemy_hp:
        reward = 40 + (current_wave * 15)
        st.session_state.money += reward
        st.session_state.message = (
            f"🏆 Wave {current_wave} menang! Damage menara {damage} mengalahkan "
            f"musuh dengan {enemy_hp} HP. Kamu mendapat {reward} kredit."
        )
    else:
        base_damage = enemy_hp - damage
        st.session_state.base_hp = max(0, st.session_state.base_hp - base_damage)
        st.session_state.message = (
            f"💥 Wave {current_wave} menembus pertahanan. Base menerima "
            f"{base_damage} damage."
        )

    st.session_state.wave += 1


st.set_page_config(page_title="Tower Fusion", page_icon="🏰", layout="wide")
ensure_game_state()

st.title("🏰 Tower Fusion")
st.caption("Bangun menara 5 lantai. Pilih senjata yang tepat untuk bertahan dari setiap wave.")

with st.sidebar:
    st.header("📖 Cara bermain")
    st.write("1. Pilih senjata untuk lantai baru.")
    st.write("2. Bangun hingga maksimal 5 lantai.")
    st.write("3. Mulai wave dan dapatkan kredit saat menang.")
    st.info("Versi ini adalah prototype. Efek combo dan upgrade per senjata akan ditambahkan berikutnya.")
    if st.button("🔄 Reset permainan", use_container_width=True):
        new_game()
        st.rerun()

stat1, stat2, stat3, stat4 = st.columns(4)
stat1.metric("💰 Kredit", st.session_state.money)
stat2.metric("🌊 Wave berikutnya", st.session_state.wave)
stat3.metric("❤️ Base HP", st.session_state.base_hp)
stat4.metric("🎯 Total damage", total_damage())

st.divider()
left, right = st.columns([1.1, 1])

with left:
    st.subheader("🏗️ Menara kamu")

    for floor_number in range(5, 0, -1):
        if floor_number <= len(st.session_state.floors):
            weapon = st.session_state.floors[floor_number - 1]
            data = WEAPONS[weapon]
            st.success(
                f"Lantai {floor_number} — {data['icon']} **{weapon}** "
                f"| Damage: {data['damage']}"
            )
        else:
            st.write(f"Lantai {floor_number} — ⬜ Kosong")

    if len(st.session_state.floors) == 5:
        unique_weapons = len(set(st.session_state.floors))
        if unique_weapons == 5:
            st.balloons()
            st.success("⚡ FUSION READY: Kelima jenis senjata sudah terkumpul!")
        else:
            st.info("Menara lengkap. Coba kombinasi lima senjata berbeda nanti untuk Fusion Ultimate.")

with right:
    st.subheader("🔧 Bangun lantai")
    weapon_name = st.selectbox("Pilih senjata", options=list(WEAPONS.keys()))
    selected = WEAPONS[weapon_name]

    st.markdown(f"### {selected['icon']} {weapon_name}")
    st.write(selected["description"])
    price, dmg = st.columns(2)
    price.metric("Harga", f"{selected['cost']} kredit")
    dmg.metric("Damage", selected["damage"])

    if st.button("➕ Bangun lantai", type="primary", use_container_width=True):
        build_floor(weapon_name)
        st.rerun()

    st.divider()
    if st.button("⚔️ Mulai wave", use_container_width=True):
        start_wave()
        st.rerun()

if st.session_state.base_hp <= 0:
    st.error("☠️ Base hancur. Tekan Reset permainan untuk mencoba lagi.")
else:
    st.info(st.session_state.message)

st.divider()
st.caption("Tower Fusion prototype • Dibuat dengan Streamlit")
