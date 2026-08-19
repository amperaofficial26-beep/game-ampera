# Tower Fusion 3D Web

Game tower defense 3D ringan berbasis **HTML, CSS, JavaScript, dan Three.js**. Tidak memerlukan Node.js, Python, atau engine game untuk dijalankan.

## Menjalankan

Karena memakai JavaScript module, buka dengan server lokal (misalnya ekstensi **Live Server** di VS Code) atau deploy ke GitHub Pages. Jangan membuka `index.html` langsung dengan `file://`.

## Deploy GitHub Pages

1. Upload isi folder `web3d/` ke repository khusus, atau jadikan folder ini sebagai root Pages.
2. Di GitHub: **Settings → Pages**.
3. Pada *Build and deployment*, pilih **Deploy from a branch**.
4. Pilih branch `main`, lalu folder `/web3d` (jika tersedia) atau `/root` bila file dipindahkan ke root.
5. Simpan dan tunggu link GitHub Pages muncul.

Three.js diambil dari CDN ketika game dibuka, sehingga ukuran repository tetap kecil.
