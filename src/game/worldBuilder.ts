import * as THREE from 'three';
import { NPCS, COLLECTIBLES } from './gameState';
import { CharacterRig, createStylizedHumanMesh } from './characterModels';

export interface WorldObjects {
  scene: THREE.Scene;
  colliders: THREE.Box3[];
  interactiveObjects: InteractiveMesh[];
  npcRigs: CharacterRig[];
  waterMeshes: THREE.Mesh[];
  particleSystems: { update: (delta: number) => void }[];
  templeSecretDoor: THREE.Group | null;
  pillarMeshes: { group: THREE.Group; index: number; aligned: boolean; glyph: THREE.Mesh }[];
  stepwellChest: THREE.Group | null;
  grandAltarWheel: THREE.Group | null;
}

export interface InteractiveMesh {
  id: string;
  name: string;
  type: 'npc' | 'collectible' | 'pillar' | 'chest' | 'bell' | 'rangoli_station' | 'altar';
  position: THREE.Vector3;
  mesh: THREE.Object3D;
  promptText: string;
  data?: any;
}

// Materials Cache
const mats = {
  stone: new THREE.MeshStandardMaterial({ color: 0xc89d7c, roughness: 0.85, metalness: 0.05 }),
  redSandstone: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8, metalness: 0.05 }),
  darkStone: new THREE.MeshStandardMaterial({ color: 0x574338, roughness: 0.9 }),
  terracotta: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 }),
  thatch: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }),
  polishedWood: new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.7 }),
  grass: new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9 }),
  path: new THREE.MeshStandardMaterial({ color: 0xd6b896, roughness: 0.95 }),
  soil: new THREE.MeshStandardMaterial({ color: 0x593d25, roughness: 0.95 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.82
  }),
  leafGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }),
  gulmoharRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.75 }),
  marigold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }),
  clothRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7 }),
  clothYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.7 }),
  clothBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.7 }),
  glowGlow: new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.8,
    roughness: 0.3
  })
};

export function buildCompleteIndianWorld(scene: THREE.Scene): WorldObjects {
  const colliders: THREE.Box3[] = [];
  const interactiveObjects: InteractiveMesh[] = [];
  const npcRigs: CharacterRig[] = [];
  const waterMeshes: THREE.Mesh[] = [];
  const particleSystems: { update: (delta: number) => void }[] = [];
  const pillarMeshes: { group: THREE.Group; index: number; aligned: boolean; glyph: THREE.Mesh }[] = [];

  // Helper to add collision box
  function addCollider(object: THREE.Object3D, padding = 0) {
    const box = new THREE.Box3().setFromObject(object);
    if (padding !== 0) {
      box.expandByScalar(padding);
    }
    colliders.push(box);
  }

  // ==========================================
  // 1. TERRAIN, PATHS & GROUND
  // ==========================================
  // Main Grass Landscape
  const terrainGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
  const terrain = new THREE.Mesh(terrainGeo, mats.grass);
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  scene.add(terrain);

  // Village Central Cobblestone Ground & Dirt Path
  const villagePathGeo = new THREE.CircleGeometry(24, 24);
  const villagePath = new THREE.Mesh(villagePathGeo, mats.path);
  villagePath.rotation.x = -Math.PI / 2;
  villagePath.position.set(-14, 0.02, 16);
  villagePath.receiveShadow = true;
  scene.add(villagePath);

  // Connecting path from Village to Temple
  const roadGeo = new THREE.PlaneGeometry(42, 6);
  const roadMesh = new THREE.Mesh(roadGeo, mats.path);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.position.set(6, 0.03, 14);
  roadMesh.receiveShadow = true;
  scene.add(roadMesh);

  // Path from Temple to Forest
  const forestRoadGeo = new THREE.PlaneGeometry(6, 32);
  const forestRoad = new THREE.Mesh(forestRoadGeo, mats.path);
  forestRoad.rotation.x = -Math.PI / 2;
  forestRoad.position.set(26, 0.03, -6);
  forestRoad.receiveShadow = true;
  scene.add(forestRoad);

  // ==========================================
  // 2. WORLD 1: TRADITIONAL INDIAN VILLAGE
  // ==========================================

  // Traditional Clay Houses (Mud walls, terracotta tiled roof / thatched eaves)
  function createVillageHut(x: number, z: number, rotY: number, hasTulsi = false) {
    const hut = new THREE.Group();
    hut.position.set(x, 0, z);
    hut.rotation.y = rotY;

    // Plinth platform
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 6), mats.stone);
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    hut.add(plinth);

    // Mud Walls
    const wall = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 5), mats.terracotta);
    wall.position.y = 1.9;
    wall.castShadow = true;
    wall.receiveShadow = true;
    hut.add(wall);

    // Terracotta Tiled Roof (Pyramid / Gable roof)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2.2, 4), mats.redSandstone);
    roof.position.y = 4.4;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(0.9, 1, 1.15);
    roof.castShadow = true;
    hut.add(roof);

    // Wooden Veranda Pillars
    for (let p of [-2.4, 2.4]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 2.8, 8), mats.wood);
      pillar.position.set(p, 1.6, 2.8);
      pillar.castShadow = true;
      hut.add(pillar);
    }

    // Wooden Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.15), mats.wood);
    door.position.set(0, 1.3, 2.52);
    hut.add(door);

    // Tulsi Vrindavan (Sacred Basil pot in courtyard)
    if (hasTulsi) {
      const tulsiBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.8), mats.terracotta);
      tulsiBase.position.set(0, 0.45, 4.2);
      tulsiBase.castShadow = true;
      hut.add(tulsiBase);

      const tulsiPlant = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), mats.leafGreen);
      tulsiPlant.position.set(0, 1.1, 4.2);
      hut.add(tulsiPlant);
    }

    scene.add(hut);
    addCollider(wall, 0.2);
    return hut;
  }

  createVillageHut(-24, 26, 0.2, true);
  createVillageHut(-32, 14, Math.PI / 3);
  createVillageHut(-18, 36, -Math.PI / 6);
  createVillageHut(-30, 34, 0.8);
  createVillageHut(-8, 38, -0.4, true);

  // Great Sacred Banyan Tree (Vatavriksha) in Village Center
  const banyan = new THREE.Group();
  banyan.position.set(-4, 0, 8);

  // Raised Circular Stone Platform (Chabutra)
  const chabutra = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.8, 0.6, 16), mats.stone);
  chabutra.position.y = 0.3;
  chabutra.receiveShadow = true;
  chabutra.castShadow = true;
  banyan.add(chabutra);

  // Huge Banyan Trunk with twists
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 5.5, 10), mats.wood);
  trunk.position.y = 3.0;
  trunk.castShadow = true;
  banyan.add(trunk);

  // Sprawling Canopy
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const branchDist = 2.8 + Math.random() * 1.5;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), mats.leafGreen);
    leaf.position.set(Math.cos(angle) * branchDist, 5.5 + (i % 3) * 0.8, Math.sin(angle) * branchDist);
    leaf.castShadow = true;
    banyan.add(leaf);

    // Aerial prop roots hanging down
    const aerialRoot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.5, 6), mats.wood);
    aerialRoot.position.set(Math.cos(angle) * 3.5, 2.4, Math.sin(angle) * 3.5);
    aerialRoot.castShadow = true;
    banyan.add(aerialRoot);
  }

  // Little Diya / Oil Lamp on Platform
  const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.1, 8), mats.terracotta);
  diya.position.set(1.5, 0.65, 1.2);
  banyan.add(diya);

  const diyaFlame = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 6), mats.glowGlow);
  diyaFlame.position.set(1.5, 0.77, 1.2);
  banyan.add(diyaFlame);

  scene.add(banyan);
  addCollider(trunk, 0.4);

  // Village Well (Traditional stone well with wooden pulley)
  const well = new THREE.Group();
  well.position.set(-14, 0, 22);

  const wellStone = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.2, 16), mats.stone);
  wellStone.position.y = 0.6;
  wellStone.castShadow = true;
  well.add(wellStone);

  const wellWater = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), mats.water);
  wellWater.rotation.x = -Math.PI / 2;
  wellWater.position.y = 0.4;
  well.add(wellWater);

  // Well Arch & Pulley
  const wellPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6), mats.wood);
  wellPost1.position.set(-1.2, 1.5, 0);
  const wellPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6), mats.wood);
  wellPost2.position.set(1.2, 1.5, 0);
  const wellBeam = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.12), mats.wood);
  wellBeam.position.set(0, 2.6, 0);
  well.add(wellPost1, wellPost2, wellBeam);

  // Terracotta Pots around well
  for (let i = 0; i < 4; i++) {
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), mats.terracotta);
    pot.scale.set(1, 1.2, 1);
    pot.position.set(1.6 + (i % 2) * 0.5, 0.35, -0.6 + i * 0.4);
    pot.castShadow = true;
    well.add(pot);
  }

  scene.add(well);
  addCollider(wellStone, 0.3);

  // Village Farming Fields (Millets, Wheat & Sugarcane rows)
  const fieldGroup = new THREE.Group();
  fieldGroup.position.set(-26, 0, 10);
  const fieldSoil = new THREE.Mesh(new THREE.BoxGeometry(14, 0.1, 10), mats.soil);
  fieldSoil.position.y = 0.05;
  fieldSoil.receiveShadow = true;
  fieldGroup.add(fieldSoil);

  // Crops rows (Millet stalks with golden heads)
  for (let r = -4; r <= 4; r += 1.8) {
    for (let c = -6; c <= 6; c += 1.2) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.4, 5), mats.leafGreen);
      stalk.position.set(c, 0.7, r);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), mats.marigold);
      head.position.set(c, 1.4, r);
      stalk.castShadow = true;
      fieldGroup.add(stalk, head);
    }
  }
  scene.add(fieldGroup);

  // Village Potter Area (Stall, wheel, stacks of clay pots)
  const potterStall = new THREE.Group();
  potterStall.position.set(-10, 0, 24);

  const wheelPlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.25, 16), mats.darkStone);
  wheelPlinth.position.y = 0.125;
  potterStall.add(wheelPlinth);

  const potterWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 16), mats.terracotta);
  potterWheel.position.y = 0.3;
  potterStall.add(potterWheel);

  // Stacks of finished pottery
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), mats.terracotta);
    p.position.set(-1.2 - (i % 3) * 0.45, 0.3 + Math.floor(i / 3) * 0.45, 0.6 + (i % 2) * 0.4);
    p.castShadow = true;
    potterStall.add(p);
  }

  scene.add(potterStall);

  // Village Marketplace Stalls (Spices, marigold garlands, textiles)
  function createMarketStall(x: number, z: number, rotY: number, clothMat: THREE.Material) {
    const stall = new THREE.Group();
    stall.position.set(x, 0, z);
    stall.rotation.y = rotY;

    // Wooden table
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.2), mats.wood);
    table.position.y = 0.4;
    table.castShadow = true;
    stall.add(table);

    // Awning Canopy
    for (let px of [-1.1, 1.1]) {
      for (let pz of [-0.5, 0.5]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), mats.wood);
        pole.position.set(px, 1.1, pz);
        stall.add(pole);
      }
    }

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.4), clothMat);
    canopy.position.y = 2.2;
    canopy.rotation.x = 0.15;
    canopy.castShadow = true;
    stall.add(canopy);

    // Goods on table (Bowls of saffron/turmeric, garlands)
    for (let b of [-0.6, 0, 0.6]) {
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.12, 8), mats.brass);
      bowl.position.set(b, 0.86, 0);
      stall.add(bowl);
    }

    scene.add(stall);
    addCollider(table, 0.2);
    return stall;
  }

  createMarketStall(-18, 4, 0.3, mats.clothRed);
  createMarketStall(-14, 0, -0.2, mats.clothYellow);
  createMarketStall(-20, -2, 0.8, mats.clothBlue);

  // Interactive Rangoli Sacred Platform in Village Center
  const rangoliStation = new THREE.Group();
  rangoliStation.position.set(-4, 0.05, 8);
  const rangoliPad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.06, 16), mats.darkStone);
  rangoliStation.add(rangoliPad);

  // Lotus Flower Inlay on Rangoli Pad
  const lotusCenter = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), mats.glowGlow);
  lotusCenter.rotation.x = -Math.PI / 2;
  lotusCenter.position.y = 0.04;
  rangoliStation.add(lotusCenter);
  scene.add(rangoliStation);

  interactiveObjects.push({
    id: 'interactive_rangoli',
    name: 'Sacred Rangoli Mandala Station',
    type: 'rangoli_station',
    position: new THREE.Vector3(-4, 0.5, 8),
    mesh: rangoliStation,
    promptText: 'Create Traditional Rangoli / Kolam Art'
  });

  // ==========================================
  // 3. WORLD 2: ANCIENT MAHAMANDAPA TEMPLE
  // ==========================================
  const temple = new THREE.Group();
  temple.position.set(28, 0, 12);

  // Multi-tiered Stone Plinth (Jagati)
  const jagatiBase = new THREE.Mesh(new THREE.BoxGeometry(26, 1.4, 22), mats.redSandstone);
  jagatiBase.position.y = 0.7;
  jagatiBase.receiveShadow = true;
  jagatiBase.castShadow = true;
  temple.add(jagatiBase);

  // Grand Entrance Steps
  const steps = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 5), mats.stone);
  steps.position.set(-13.5, 0.4, 0);
  steps.receiveShadow = true;
  temple.add(steps);

  // Carved Pillars (Stambhas with Dravidian / Nagara lotus corbels)
  const pillarCountX = 6;
  const pillarCountZ = 4;
  for (let ix = 0; ix < pillarCountX; ix++) {
    for (let iz = 0; iz < pillarCountZ; iz++) {
      const px = (ix - (pillarCountX - 1) / 2) * 4.2;
      const pz = (iz - (pillarCountZ - 1) / 2) * 4.4;

      // Skip center so courtyard is open
      if (Math.abs(px) < 5 && Math.abs(pz) < 4) continue;

      const pGroup = new THREE.Group();
      pGroup.position.set(px, 1.4, pz);

      const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), mats.darkStone);
      pBase.position.y = 0.2;
      const pShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 4.2, 10), mats.redSandstone);
      pShaft.position.y = 2.3;
      pShaft.castShadow = true;
      const pCapital = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), mats.gold);
      pCapital.position.y = 4.4;

      pGroup.add(pBase, pShaft, pCapital);
      temple.add(pGroup);
    }
  }

  // Temple Shikhara / Vimana (Multi-Tiered Stepped Pyramid Tower)
  const shikhara = new THREE.Group();
  shikhara.position.set(8, 5.8, 0);

  const tiers = [
    { w: 10, h: 2.2 },
    { w: 8.2, h: 2.0 },
    { w: 6.5, h: 1.8 },
    { w: 4.8, h: 1.6 },
    { w: 3.2, h: 1.4 },
    { w: 1.8, h: 1.2 }
  ];

  let curY = 0;
  tiers.forEach((t, i) => {
    const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.w), mats.redSandstone);
    tierMesh.position.y = curY + t.h / 2;
    tierMesh.castShadow = true;
    tierMesh.receiveShadow = true;
    shikhara.add(tierMesh);
    curY += t.h;
  });

  // Amalaka (Ribbed Stone Disc) & Kalasha (Golden Finial) on top
  const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.8, 16), mats.stone);
  amalaka.position.y = curY + 0.4;
  shikhara.add(amalaka);

  const kalasha = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.6, 10), mats.gold);
  kalasha.position.y = curY + 1.6;
  kalasha.castShadow = true;
  shikhara.add(kalasha);

  temple.add(shikhara);

  // Mandapa Roof
  const roofMandapa = new THREE.Mesh(new THREE.BoxGeometry(24, 0.8, 20), mats.redSandstone);
  roofMandapa.position.set(-2, 5.8, 0);
  roofMandapa.castShadow = true;
  temple.add(roofMandapa);

  // Sacred Temple Brass Bell (Ghanti at entrance that player can ring!)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(-11, 4.6, 0);

  const bellChain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6), mats.brass);
  bellChain.position.y = 0.6;
  const bellDome = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.5, 12), mats.brass);
  bellDome.position.y = 0;
  bellGroup.add(bellChain, bellDome);
  temple.add(bellGroup);

  interactiveObjects.push({
    id: 'temple_bell',
    name: 'Sacred Temple Bell (Ghanti)',
    type: 'bell',
    position: new THREE.Vector3(17, 3.5, 12),
    mesh: bellGroup,
    promptText: 'Ring Sacred Bell (Purifies Atmosphere)'
  });

  // 3 Sacred Interactive Alignment Pillars (Dharma, Satya, Ahimsa)
  const pillarData = [
    { title: 'Dharma Chakra Pillar', x: 22, z: 8, index: 0 },
    { title: 'Satya Lotus Pillar', x: 22, z: 12, index: 1 },
    { title: 'Ahimsa Knot Pillar', x: 22, z: 16, index: 2 }
  ];

  pillarData.forEach(p => {
    const pilGroup = new THREE.Group();
    pilGroup.position.set(p.x, 1.4, p.z);

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), mats.darkStone);
    base.position.y = 0.25;

    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 3.2, 12), mats.redSandstone);
    column.position.y = 1.9;
    column.castShadow = true;

    // Glowing Sanskrit / Vedic Emblem Glyph
    const glyphGeo = new THREE.TorusGeometry(0.32, 0.06, 8, 16);
    const glyphMesh = new THREE.Mesh(glyphGeo, mats.gold);
    glyphMesh.position.set(0, 2.0, 0.42);
    glyphMesh.rotation.x = Math.PI / 6;

    pilGroup.add(base, column, glyphMesh);
    scene.add(pilGroup);

    pillarMeshes.push({
      group: pilGroup,
      index: p.index,
      aligned: false,
      glyph: glyphMesh
    });

    interactiveObjects.push({
      id: `pillar_${p.index}`,
      name: p.title,
      type: 'pillar',
      position: new THREE.Vector3(p.x, 2, p.z),
      mesh: pilGroup,
      promptText: `Align ${p.title}`,
      data: { index: p.index }
    });
  });

  // Secret Sanctum Chamber Door (Carved Stone Relief)
  const secretDoorGroup = new THREE.Group();
  secretDoorGroup.position.set(37, 1.4, 12);

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 3.4), mats.darkStone);
  doorFrame.position.y = 2.1;
  secretDoorGroup.add(doorFrame);

  const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 2.6), mats.gold);
  doorSlab.position.set(0, 1.8, 0);
  doorSlab.castShadow = true;
  secretDoorGroup.add(doorSlab);

  scene.add(secretDoorGroup);
  addCollider(doorFrame, 0.3);

  // Grand Central Sun Altar in Courtyard
  const altarGroup = new THREE.Group();
  altarGroup.position.set(32, 1.4, 12);

  const altarPlinth = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16), mats.darkStone);
  altarPlinth.position.y = 0.3;
  altarGroup.add(altarPlinth);

  // Konark Sun Wheel on Altar (Rotates smoothly during celebration)
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(0, 1.6, 0);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 12, 24), mats.gold);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16), mats.gold);
  hub.rotation.x = Math.PI / 2;
  wheelGroup.add(rim, hub);

  for (let s = 0; s < 8; s++) {
    const angle = (s / 8) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 8), mats.gold);
    spoke.position.set(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0);
    spoke.rotation.z = angle + Math.PI / 2;
    wheelGroup.add(spoke);
  }

  altarGroup.add(wheelGroup);
  scene.add(altarGroup);

  interactiveObjects.push({
    id: 'grand_altar',
    name: 'Altar of the Surya Chakra',
    type: 'altar',
    position: new THREE.Vector3(32, 2, 12),
    mesh: altarGroup,
    promptText: 'Assemble Ancient Heritage Seals'
  });

  scene.add(temple);
  // Add collision for back shikhara structure
  addCollider(shikhara, 0.2);

  // ==========================================
  // 4. WORLD 3: NARMADA RIVER, FOREST & WATERFALL
  // ==========================================
  // River Bed & Flowing Water
  const riverGeo = new THREE.PlaneGeometry(16, 90, 24, 24);
  const river = new THREE.Mesh(riverGeo, mats.water);
  river.rotation.x = -Math.PI / 2;
  river.position.set(22, 0.08, -35);
  river.receiveShadow = true;
  scene.add(river);
  waterMeshes.push(river);

  // Forest Mountain Backing & Cliff
  const cliffGeo = new THREE.BoxGeometry(45, 14, 18);
  const cliff = new THREE.Mesh(cliffGeo, mats.darkStone);
  cliff.position.set(24, 7, -68);
  cliff.castShadow = true;
  cliff.receiveShadow = true;
  scene.add(cliff);
  addCollider(cliff, 0.5);

  // Multi-tiered Cascading Waterfall
  const waterfallGeo = new THREE.PlaneGeometry(10, 15, 16, 16);
  const waterfall = new THREE.Mesh(waterfallGeo, mats.water);
  waterfall.position.set(22, 7.5, -59);
  waterfall.castShadow = true;
  scene.add(waterfall);
  waterMeshes.push(waterfall);

  // Waterfall Basin Rocks
  for (let i = 0; i < 14; i++) {
    const rockGeo = new THREE.DodecahedronGeometry(0.8 + Math.random() * 1.2, 1);
    const rock = new THREE.Mesh(rockGeo, mats.darkStone);
    rock.position.set(
      15 + Math.random() * 14,
      0.6 + Math.random() * 0.8,
      -52 + Math.random() * 8
    );
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    rock.castShadow = true;
    scene.add(rock);
    addCollider(rock, 0.1);
  }

  // Rustic Wooden Bridge across the River
  const bridge = new THREE.Group();
  bridge.position.set(22, 0.4, -14);

  const bridgePlank = new THREE.Mesh(new THREE.BoxGeometry(18, 0.3, 4.5), mats.wood);
  bridgePlank.receiveShadow = true;
  bridgePlank.castShadow = true;
  bridge.add(bridgePlank);

  // Bridge Rails
  for (let bz of [-2.1, 2.1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(18, 0.12, 0.12), mats.wood);
    rail.position.set(0, 0.9, bz);
    bridge.add(rail);

    for (let bx of [-7, -3.5, 0, 3.5, 7]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 6), mats.wood);
      post.position.set(bx, 0.45, bz);
      bridge.add(post);
    }
  }
  scene.add(bridge);

  // Sacred Forest Trees (Neem, Peepal, Mango, flowering Gulmohar)
  function createTree(x: number, z: number, scale = 1, isGulmohar = false) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4.5, 8), mats.wood);
    trunk.position.y = 2.25;
    trunk.castShadow = true;
    tree.add(trunk);

    const canopyMat = isGulmohar ? mats.gulmoharRed : mats.leafGreen;
    for (let c = 0; c < 3; c++) {
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.8 - c * 0.3, 8, 8), canopyMat);
      foliage.position.set((Math.random() - 0.5) * 0.8, 4.2 + c * 1.1, (Math.random() - 0.5) * 0.8);
      foliage.castShadow = true;
      tree.add(foliage);
    }

    scene.add(tree);
    addCollider(trunk, 0.3);
    return tree;
  }

  // Populate Forest
  const treeCoords = [
    { x: 12, z: -20, scale: 1.2 },
    { x: 34, z: -18, scale: 1.4, gulmohar: true },
    { x: 16, z: -32, scale: 1.1 },
    { x: 32, z: -36, scale: 1.3 },
    { x: 10, z: -44, scale: 1.5, gulmohar: true },
    { x: 38, z: -48, scale: 1.2 },
    { x: 8, z: -12, scale: 1.0 },
    { x: 42, z: -26, scale: 1.3, gulmohar: true }
  ];

  treeCoords.forEach(t => createTree(t.x, t.z, t.scale, t.gulmohar));

  // ==========================================
  // 5. WORLD 4: SUBTERRANEAN STEPWELL (BAOLI)
  // ==========================================
  const baoli = new THREE.Group();
  baoli.position.set(-16, 0, -32);

  // Stepped geometric courtyard descending downwards
  const baoliWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 18), mats.darkStone);
  baoliWall.position.y = 2.25;
  baoli.add(baoliWall);

  // Stepped Stone Corridors
  for (let s = 0; s < 5; s++) {
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(16 - s * 2.4, 0.4, 16 - s * 2.4), mats.redSandstone);
    stepMesh.position.y = 0.2 + s * 0.4;
    stepMesh.receiveShadow = true;
    baoli.add(stepMesh);
  }

  // Ancient Arched Pavilion in Stepwell
  for (let px of [-4, 4]) {
    for (let pz of [-4, 4]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.6), mats.stone);
      col.position.set(px, 1.6, pz);
      baoli.add(col);
    }
  }

  // Ancient Mystery Stone Chest in the Stepwell
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 1.4, 0);

  const chestBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.8), mats.wood);
  chestBase.position.y = 0.35;
  chestBase.castShadow = true;

  const chestLid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.22, 12, 1, false, 0, Math.PI), mats.wood);
  chestLid.rotation.z = Math.PI / 2;
  chestLid.position.set(0, 0.7, 0);
  chestLid.castShadow = true;

  const brassLock = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.1), mats.gold);
  brassLock.position.set(0, 0.5, 0.42);

  chestGroup.add(chestBase, chestLid, brassLock);
  baoli.add(chestGroup);

  scene.add(baoli);
  addCollider(baoliWall, 0.3);

  interactiveObjects.push({
    id: 'stepwell_chest',
    name: 'Ancient Heritage Chest of the Baoli',
    type: 'chest',
    position: new THREE.Vector3(-16, 1.8, -32),
    mesh: chestGroup,
    promptText: 'Unlock Ancient Heritage Chest (Requires Brass Key)'
  });

  // ==========================================
  // 6. SPAWN NPCS & DIALOGUE RIGS
  // ==========================================
  NPCS.forEach(npc => {
    const rig = createStylizedHumanMesh({ npcData: npc });
    rig.root.position.set(...npc.position);
    rig.root.rotation.y = npc.rotation;
    scene.add(rig.root);
    npcRigs.push(rig);

    // Floating interaction prompt anchor
    interactiveObjects.push({
      id: npc.id,
      name: npc.name,
      type: 'npc',
      position: new THREE.Vector3(...npc.position),
      mesh: rig.root,
      promptText: `Talk to ${npc.name} (${npc.role})`,
      data: npc
    });
  });

  // ==========================================
  // 7. SPAWN COLLECTIBLES & QUEST ITEMS
  // ==========================================
  COLLECTIBLES.forEach(c => {
    const colGroup = new THREE.Group();
    colGroup.position.set(...c.position);

    if (c.type === 'clay') {
      // 3 terracotta clay mounds
      const clayMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 1), mats.terracotta);
      clayMesh.castShadow = true;
      colGroup.add(clayMesh);
    } else if (c.type === 'waste') {
      // Discarded litter to clean
      const wasteMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.3), mats.clothRed);
      wasteMesh.castShadow = true;
      colGroup.add(wasteMesh);
    } else if (c.type === 'sapling') {
      // Green sapling
      const saplingMesh = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 6), mats.leafGreen);
      saplingMesh.position.y = 0.35;
      colGroup.add(saplingMesh);
    } else if (c.type === 'key') {
      // Glowing brass key
      const keyMesh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 6, 12), mats.gold);
      keyMesh.rotation.x = Math.PI / 2;
      colGroup.add(keyMesh);
    }

    // Glowing subtle aura
    const aura = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.55, 16), mats.glowGlow);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.02;
    colGroup.add(aura);

    scene.add(colGroup);

    interactiveObjects.push({
      id: c.id,
      name: c.name,
      type: 'collectible',
      position: new THREE.Vector3(...c.position),
      mesh: colGroup,
      promptText: `Collect ${c.name}`,
      data: c
    });
  });

  // ==========================================
  // 8. ATMOSPHERIC PARTICLES & LIGHTING
  // ==========================================
  // Floating Golden Dust Motes / Fireflies
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 120;
    particlePositions[i + 1] = 1 + Math.random() * 12;
    particlePositions[i + 2] = (Math.random() - 0.5) * 120;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.18,
    transparent: true,
    opacity: 0.75
  });

  const particleCloud = new THREE.Points(particleGeo, particleMat);
  scene.add(particleCloud);

  particleSystems.push({
    update: (delta: number) => {
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
      particleGeo.attributes.position.needsUpdate = true;
    }
  });

  return {
    scene,
    colliders,
    interactiveObjects,
    npcRigs,
    waterMeshes,
    particleSystems,
    templeSecretDoor: secretDoorGroup,
    pillarMeshes,
    stepwellChest: chestGroup,
    grandAltarWheel: wheelGroup
  };
}

/**
 * Calculates the exact surface height of the terrain, platforms, steps,
 * bridges, and temple structures at any given (x, z) world coordinate.
 */
export function getGroundHeight(x: number, z: number): number {
  // 1. Ancient Mahamandapa Temple Plinth & Steps
  // Main Temple Plinth (jagati): x in [14.8, 41.2], z in [0.8, 23.2]
  if (x >= 14.8 && x <= 41.2 && z >= 0.8 && z <= 23.2) {
    return 1.4;
  }
  // Temple Entrance Steps & Grand Ramp (x in [9.5, 14.8], z in [8.0, 16.0])
  if (x >= 9.5 && x < 14.8 && z >= 8.0 && z <= 16.0) {
    const t = (x - 9.5) / (14.8 - 9.5);
    return Math.max(0, Math.min(1.4, t * 1.4));
  }
  // Extended Temple perimeter steps
  if (x >= 13.5 && x <= 42.5 && z >= -0.5 && z <= 24.5) {
    return 1.4;
  }

  // 2. Wooden River Bridge across Narmada (x in [11.5, 32.5], z in [-16.5, -11.5])
  if (x >= 11.5 && x <= 32.5 && z >= -16.5 && z <= -11.5) {
    if (x < 14.0) {
      const t = (x - 11.5) / 2.5;
      return t * 0.55;
    } else if (x > 30.0) {
      const t = (32.5 - x) / 2.5;
      return t * 0.55;
    }
    return 0.55;
  }

  // 3. Village Banyan Tree Chabutra (Circle at x: -4, z: 8, radius 4.8)
  const dxB = x - (-4);
  const dzB = z - 8;
  const distB = Math.sqrt(dxB * dxB + dzB * dzB);
  if (distB <= 4.8) {
    if (distB > 4.2) {
      const t = (4.8 - distB) / 0.6;
      return t * 0.6;
    }
    return 0.6;
  }

  // 4. Default ground elevation
  return 0.0;
}
