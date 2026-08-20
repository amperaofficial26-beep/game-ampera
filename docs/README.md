# Tower Fusion 3D — Fantasy Edition

Game tower defense 3D ringan berbasis Three.js dengan visual **stylized fantasy**: jalan batu, kastil, hutan, monster goblin, menara kristal, cahaya obor, dan pencahayaan malam magis.

## Visual dan performa

Versi ini masih hanya memakai geometri Three.js (tanpa file model 3D/texture besar), sehingga repository tetap ringan. Pencahayaan menggunakan shadow, tone mapping, fog, point lights, dan material emissive. Untuk kualitas visual tahap berikutnya, model `.glb` teroptimasi dan texture 512–1024px dapat ditambahkan ke folder `assets/`.

## Jalankan lokal

```bash
cd docs
python -m http.server 8080
```

Buka `http://localhost:8080`.
