const tiers = (stats) => stats.map(([cost, damage, cooldown, title]) => ({ cost, damage, cooldown, title }));

export const WEAPONS = {
  cannon: { name:'Cannon', icon:'💣', color:0xff784d, projectile:'shell', description:'Benteng dwarf dengan meriam naga api.', tiers:tiers([[50,28,.85,'Meriam Kayu'],[75,48,.76,'Meriam Batu'],[120,76,.66,'Forge Cannon'],[180,116,.55,'Twin Siege Cannon'],[280,178,.43,'Dragonfire Citadel']]) },
  tesla: { name:'Tesla', icon:'⚡', color:0x65cfff, projectile:'lightning', description:'Menara rune yang menguasai badai petir.', tiers:tiers([[60,17,.55,'Rune Totem'],[90,29,.48,'Lightning Shrine'],[140,47,.40,'Storm Spire'],[205,73,.33,'Chain Coil Tower'],[310,112,.25,'Celestial Tempest']]) },
  freeze: { name:'Freeze', icon:'❄️', color:0x83f6ff, projectile:'freeze', description:'Kuil es yang membekukan monster.', tiers:tiers([[45,8,.62,'Kristal Es'],[70,15,.55,'Pilar Frost'],[105,27,.48,'Glacier Tower'],[165,43,.39,'Ice Fortress'],[250,68,.30,'Winter Palace']]) },
  rocket: { name:'Roket', icon:'🚀', color:0xffc95c, projectile:'rocket', description:'Pelontar api dengan ledakan area.', tiers:tiers([[80,42,1.3,'Pelontar Api'],[115,68,1.15,'Fireball Kiln'],[165,106,1.0,'Wyvern Launcher'],[240,158,.82,'Siege Bombard'],[360,235,.64,'Dragon Siege Citadel']]) },
  laser: { name:'Laser', icon:'🔆', color:0xd68bff, projectile:'laser', description:'Observatorium kristal dengan sinar arcane.', tiers:tiers([[70,23,.35,'Arcane Orb'],[105,39,.31,'Mage Observatory'],[150,63,.27,'Prism Tower'],[220,98,.22,'Astral Spire'],[330,148,.17,'Sun Crystal Sanctum']]) },
};
export function getTier(key, level=1) { return WEAPONS[key].tiers[Math.max(0, Math.min(4, level - 1))]; }
