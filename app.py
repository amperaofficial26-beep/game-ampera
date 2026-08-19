<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#080d1c" />
  <title>Tower Fusion 3D</title>
  <link rel="stylesheet" href="style.css" />
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"
      }
    }
  </script>
</head>
<body>
  <main id="app">
    <canvas id="game-canvas" aria-label="Arena Tower Fusion 3D"></canvas>

    <header class="topbar">
      <div><p class="eyebrow">WEBGL TOWER DEFENSE</p><h1>⚡ TOWER FUSION <span>3D</span></h1></div>
      <div class="stats">
        <div><small>KREDIT</small><strong id="money">200</strong></div>
        <div><small>WAVE</small><strong id="wave">1</strong></div>
        <div><small>BASE HP</small><strong id="base-hp">100</strong></div>
      </div>
    </header>

    <aside class="panel build-panel">
      <p class="panel-title">BANGUN LANTAI <span id="floor-count">0/5</span></p>
      <label for="weapon-select">SENJATA</label>
      <select id="weapon-select"></select>
      <p id="weapon-info" class="weapon-info"></p>
      <button id="build-button" class="primary">＋ Bangun lantai</button>
      <div id="floor-list" class="floor-list"></div>
    </aside>

    <section class="panel combat-panel">
      <p class="panel-title">PERTEMPURAN</p>
      <p id="enemy-info">Bangun tower lalu mulai wave.</p>
      <button id="wave-button" class="primary">⚔ Mulai wave</button>
      <p id="message" class="message">Pertahankan base dari robot penyerang.</p>
    </section>

    <div class="hint">Klik dan geser untuk memutar kamera • Scroll untuk zoom</div>
  </main>
  <script type="module" src="main.js"></script>
<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a2dbfa68893a58f8',t:'MTc4NzE3MjA3Ng=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
