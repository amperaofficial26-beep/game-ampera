# 🏰 Tower Fusion

Prototype game **tower defense** berbasis [Streamlit](https://streamlit.io/). Pemain membangun satu menara hingga lima lantai dan menentukan senjata pada setiap lantainya untuk menghadapi wave musuh.

> Status: tahap awal / prototype. Saat ini game memiliki sistem membangun lantai, ekonomi sederhana, wave musuh, dan perhitungan damage dasar.

## Konsep permainan

- Menara memiliki maksimal **5 lantai**.
- Setiap lantai dapat menggunakan satu dari lima senjata:
  - 💣 **Cannon** — damage besar untuk satu target.
  - ⚡ **Tesla** — nantinya dapat menyerang berantai.
  - ❄️ **Freeze** — nantinya memperlambat musuh.
  - 🚀 **Roket** — nantinya memberi damage area.
  - 🔆 **Laser** — nantinya kuat untuk target besar.
- Kalahkan wave untuk mendapatkan kredit dan membangun lantai baru.
- Tahap berikutnya akan menambahkan upgrade, combo posisi lantai, jenis musuh, dan Fusion Ultimate.

## Menjalankan secara lokal

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/tower-fusion.git
cd tower-fusion
```

### 2. Buat dan aktifkan virtual environment (opsional, disarankan)

```bash
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

### 3. Install dependency

```bash
pip install -r requirements.txt
```

### 4. Jalankan game

```bash
streamlit run app.py
```

Buka alamat yang muncul di terminal, biasanya `http://localhost:8501`.

## Deploy ke Streamlit Community Cloud

1. Upload/push project ini ke repository GitHub.
2. Buka [share.streamlit.io](https://share.streamlit.io/).
3. Login dengan GitHub dan pilih **Create app**.
4. Pilih repository, branch `main`, lalu isi **Main file path** dengan `app.py`.
5. Tekan **Deploy**.

Streamlit akan membaca `requirements.txt` dan meng-install dependency secara otomatis.

## Struktur awal project

```text
tower-fusion/
├── app.py
├── requirements.txt
├── README.md
└── .gitignore
```

Pada tahap selanjutnya, logika akan dipisahkan ke folder seperti `game/`, antarmuka ke `ui/`, dan gambar/suara ke `assets/`.
