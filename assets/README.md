# Assets Tower Fusion

Folder ini menyimpan aset visual dan audio untuk game.

```text
assets/
├── README.md
├── images/
│   ├── logo.svg
│   ├── tower.svg
│   └── enemy.svg
└── sounds/
    └── README.md
```

## Catatan penggunaan

- Semua gambar awal menggunakan format **SVG**, sehingga ringan, tajam di berbagai ukuran, dan aman disimpan di GitHub.
- Saat UI Streamlit diintegrasikan, gambar dapat dipanggil dengan contoh:

```python
st.image("assets/images/tower.svg")
```

- Aset audio belum ditambahkan agar repository tetap ringan. Simpan efek suara berformat `.mp3`, `.wav`, atau `.ogg` di folder `sounds/`.
- Pastikan hanya memakai aset buatan sendiri, aset berlisensi bebas, atau aset dengan lisensi yang sesuai.
