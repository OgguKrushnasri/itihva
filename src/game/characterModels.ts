import * as THREE from 'three';
import { NPCData, PlayerCustomization } from '../types';

/**
 * Procedural stylized 3D Human Character Builder
 * Creates charming, stylized 3D Indian human models with expressive features,
 * traditional clothing, and articulated limbs for realistic walk/run/idle/namaste animations.
 */

export interface CharacterRig {
  root: THREE.Group;
  head: THREE.Group;
  torso: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftShin: THREE.Group;
  rightShin: THREE.Group;
  isNpc?: boolean;
  npcData?: NPCData;
  animState: {
    walkTime: number;
    idleTime: number;
    actionTime: number;
    isMoving: boolean;
    isRunning: boolean;
    isJumping: boolean;
    isGreeting: boolean;
    isInteracting: boolean;
  };
}

// Reusable materials cache for peak performance
const materialCache = new Map<string, THREE.Material>();

function getMat(color: string | number, roughness = 0.6, metalness = 0.1): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}`;
  if (!materialCache.has(key)) {
    materialCache.set(
      key,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
      })
    );
  }
  return materialCache.get(key) as THREE.MeshStandardMaterial;
}

export function createStylizedHumanMesh(
  options: {
    skinTone?: string;
    clothingColor?: string;
    secondaryColor?: string;
    hairColor?: string;
    hairStyle?: string;
    outfit?: string;
    isPlayer?: boolean;
    npcData?: NPCData;
    customization?: PlayerCustomization;
  } = {}
): CharacterRig {
  const root = new THREE.Group();

  const skinColor = options.customization?.skinTone || options.skinTone || options.npcData?.skinTone || '#9a6b49';
  const clothColor = options.customization?.outfitColor || options.clothingColor || options.npcData?.clothingColor || '#e06d10';
  const accentColor = options.customization?.accentColor || options.secondaryColor || options.npcData?.clothingSecondary || '#1e3a8a';
  const hairCol = options.customization?.turbanColor || options.hairColor || options.npcData?.hairColor || '#27272a';
  const hairSt = options.customization?.hairStyle || options.hairStyle || options.npcData?.hairStyle || 'tied_topknot';
  const outfitType = options.customization?.outfit || options.outfit || options.npcData?.outfit || 'adventurer_kurta';

  const skinMat = getMat(skinColor, 0.7, 0.05);
  const clothMat = getMat(clothColor, 0.75, 0.05);
  const accentMat = getMat(accentColor, 0.65, 0.15);
  const hairMat = getMat(hairCol, 0.85, 0.0);
  const goldMat = getMat('#f59e0b', 0.3, 0.7); // Indian gold jewelry / borders
  const whiteClothMat = getMat('#f8fafc', 0.8, 0.0);

  // Torso / Pelvis base
  const torso = new THREE.Group();
  torso.position.y = 1.0;
  root.add(torso);

  // Chest & Upper Body
  const chestGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.5, 10);
  const chestMesh = new THREE.Mesh(chestGeo, clothMat);
  chestMesh.position.y = 0.25;
  chestMesh.castShadow = true;
  torso.add(chestMesh);

  // Angavastram / Sash / Scarf drape over shoulder
  if (outfitType === 'adventurer_kurta' || outfitType === 'priest' || outfitType === 'farmer') {
    const sashGeo = new THREE.TorusGeometry(0.28, 0.045, 8, 16, Math.PI * 1.3);
    const sashMesh = new THREE.Mesh(sashGeo, accentMat);
    sashMesh.position.set(0.04, 0.26, 0);
    sashMesh.rotation.set(0.4, 0.3, 0.8);
    sashMesh.castShadow = true;
    torso.add(sashMesh);
  }

  // Saree Pallu Drape
  if (outfitType === 'saree' || outfitType === 'traditional_saree') {
    const palluGeo = new THREE.BoxGeometry(0.18, 0.55, 0.06);
    const palluMesh = new THREE.Mesh(palluGeo, accentMat);
    palluMesh.position.set(-0.16, 0.22, 0.08);
    palluMesh.rotation.set(0.1, 0, -0.2);
    palluMesh.castShadow = true;
    torso.add(palluMesh);
  }

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.14, 8);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = 0.54;
  torso.add(neckMesh);

  // Head
  const head = new THREE.Group();
  head.position.y = 0.68;
  torso.add(head);

  // Stylized Head Mesh
  const headGeo = new THREE.SphereGeometry(0.19, 14, 12);
  headGeo.scale(1, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Cute stylized eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.035, 8, 8);
  eyeWhiteGeo.scale(1, 1.2, 0.6);
  const eyeWhiteMat = getMat('#ffffff', 0.2, 0.0);
  const pupilGeo = new THREE.SphereGeometry(0.022, 8, 8);
  const pupilMat = getMat('#18181b', 0.1, 0.0);

  // Left Eye
  const leftEye = new THREE.Group();
  leftEye.position.set(0.075, 0.02, 0.165);
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.z = 0.02;
  leftEye.add(leftEyeWhite);
  leftEye.add(leftPupil);
  head.add(leftEye);

  // Right Eye
  const rightEye = new THREE.Group();
  rightEye.position.set(-0.075, 0.02, 0.165);
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.z = 0.02;
  rightEye.add(rightEyeWhite);
  rightEye.add(rightPupil);
  head.add(rightEye);

  // Eyebrows
  const browGeo = new THREE.BoxGeometry(0.06, 0.015, 0.02);
  const leftBrow = new THREE.Mesh(browGeo, hairMat);
  leftBrow.position.set(0.075, 0.08, 0.175);
  leftBrow.rotation.z = -0.05;
  const rightBrow = new THREE.Mesh(browGeo, hairMat);
  rightBrow.position.set(-0.075, 0.08, 0.175);
  rightBrow.rotation.z = 0.05;
  head.add(leftBrow);
  head.add(rightBrow);

  // Traditional Bindi / Tilak on forehead
  if (options.npcData?.role.includes('Scholar') || options.npcData?.outfit === 'priest' || outfitType === 'saree') {
    const tilakGeo = new THREE.BoxGeometry(0.02, 0.05, 0.01);
    const tilakMat = getMat('#dc2626', 0.5, 0.0); // Vermillion Sindoor / Chandan
    const tilakMesh = new THREE.Mesh(tilakGeo, tilakMat);
    tilakMesh.position.set(0, 0.07, 0.19);
    head.add(tilakMesh);
  }

  // Nose & subtle mouth
  const noseGeo = new THREE.ConeGeometry(0.025, 0.05, 5);
  const noseMesh = new THREE.Mesh(noseGeo, skinMat);
  noseMesh.position.set(0, -0.02, 0.195);
  noseMesh.rotation.x = Math.PI / 2;
  head.add(noseMesh);

  // Hair / Turban Styles
  if (hairSt === 'turban') {
    // Pagri / Traditional Rajasthani/Punjabi Turban
    const turbanGeo = new THREE.TorusGeometry(0.18, 0.09, 10, 16);
    const turbanMesh = new THREE.Mesh(turbanGeo, accentMat);
    turbanMesh.rotation.x = Math.PI / 2;
    turbanMesh.position.set(0, 0.08, -0.01);
    turbanMesh.castShadow = true;
    head.add(turbanMesh);

    const turbanTopGeo = new THREE.SphereGeometry(0.16, 10, 8);
    const turbanTop = new THREE.Mesh(turbanTopGeo, accentMat);
    turbanTop.position.set(0, 0.12, 0);
    head.add(turbanTop);
  } else if (hairSt === 'tied_topknot') {
    // Topknot / Choti (Ancient Indian Adventurer look)
    const hairCapGeo = new THREE.SphereGeometry(0.198, 12, 10);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.02, -0.02);
    head.add(hairCap);

    const topKnotGeo = new THREE.SphereGeometry(0.075, 8, 8);
    const topKnot = new THREE.Mesh(topKnotGeo, hairMat);
    topKnot.position.set(0, 0.22, -0.08);
    head.add(topKnot);
  } else if (hairSt === 'long_braid') {
    // Traditional Indian Braid with gold hair ornament
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.198, 12, 10), hairMat);
    hairCap.position.set(0, 0.02, -0.02);
    head.add(hairCap);

    // Braid hanging down back
    const braidGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.45, 6);
    const braidMesh = new THREE.Mesh(braidGeo, hairMat);
    braidMesh.position.set(0, -0.16, -0.18);
    braidMesh.rotation.x = 0.15;
    head.add(braidMesh);

    // Gold jhumka / hair clasp
    const claspMesh = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 6, 12), goldMat);
    claspMesh.position.set(0, 0.02, -0.18);
    head.add(claspMesh);
  } else if (hairSt === 'elder_hair') {
    // Silver white bun
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), hairMat);
    hairCap.position.set(0, 0.02, -0.02);
    head.add(hairCap);

    const bunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), hairMat);
    bunMesh.position.set(0, 0.04, -0.18);
    head.add(bunMesh);
  } else {
    // Classic short groomed hair
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), hairMat);
    hairCap.position.set(0, 0.03, -0.02);
    head.add(hairCap);
  }

  // Adventurer Backpack
  if (options.isPlayer) {
    const bagGeo = new THREE.BoxGeometry(0.26, 0.32, 0.16);
    const bagMat = getMat('#78350f', 0.8, 0.05); // Leather bag
    const bagMesh = new THREE.Mesh(bagGeo, bagMat);
    bagMesh.position.set(0, 0.24, -0.18);
    bagMesh.castShadow = true;
    torso.add(bagMesh);

    // Rolled Yoga Mat / Bedroll on top
    const rollGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.28, 8);
    const rollMesh = new THREE.Mesh(rollGeo, accentMat);
    rollMesh.rotation.z = Math.PI / 2;
    rollMesh.position.set(0, 0.42, -0.18);
    torso.add(rollMesh);
  }

  // --- ARMS ---
  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(0.28, 0.42, 0);
  torso.add(leftArm);

  const leftUpperArmGeo = new THREE.CylinderGeometry(0.055, 0.048, 0.26, 8);
  const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, clothMat);
  leftUpperArm.position.y = -0.12;
  leftUpperArm.castShadow = true;
  leftArm.add(leftUpperArm);

  const leftForearm = new THREE.Group();
  leftForearm.position.y = -0.25;
  leftArm.add(leftForearm);

  const leftLowerArmGeo = new THREE.CylinderGeometry(0.048, 0.04, 0.24, 8);
  const leftLowerArm = new THREE.Mesh(leftLowerArmGeo, skinMat);
  leftLowerArm.position.y = -0.11;
  leftLowerArm.castShadow = true;
  leftForearm.add(leftLowerArm);

  // Left Hand
  const handGeo = new THREE.SphereGeometry(0.045, 6, 6);
  handGeo.scale(1, 1.3, 0.7);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.24;
  leftForearm.add(leftHand);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.28, 0.42, 0);
  torso.add(rightArm);

  const rightUpperArm = new THREE.Mesh(leftUpperArmGeo, clothMat);
  rightUpperArm.position.y = -0.12;
  rightUpperArm.castShadow = true;
  rightArm.add(rightUpperArm);

  const rightForearm = new THREE.Group();
  rightForearm.position.y = -0.25;
  rightArm.add(rightForearm);

  const rightLowerArm = new THREE.Mesh(leftLowerArmGeo, skinMat);
  rightLowerArm.position.y = -0.11;
  rightLowerArm.castShadow = true;
  rightForearm.add(rightLowerArm);

  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.24;
  rightForearm.add(rightHand);

  // --- LOWER BODY (Dhoti / Saree skirt / Pants) ---
  const lowerBodyGroup = new THREE.Group();
  lowerBodyGroup.position.y = 0;
  torso.add(lowerBodyGroup);

  // Dhoti / Kurta Lower skirt flare
  const skirtGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.42, 10);
  const skirtMesh = new THREE.Mesh(skirtGeo, clothMat);
  skirtMesh.position.y = -0.18;
  skirtMesh.castShadow = true;
  lowerBodyGroup.add(skirtMesh);

  // Golden waist sash / Patka
  const patkaGeo = new THREE.TorusGeometry(0.21, 0.03, 6, 16);
  const patkaMesh = new THREE.Mesh(patkaGeo, accentMat);
  patkaMesh.rotation.x = Math.PI / 2;
  patkaMesh.position.y = 0.02;
  lowerBodyGroup.add(patkaMesh);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.12, -0.38, 0);
  torso.add(leftLeg);

  const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.32, 8);
  const leftThigh = new THREE.Mesh(legGeo, whiteClothMat);
  leftThigh.position.y = -0.15;
  leftThigh.castShadow = true;
  leftLeg.add(leftThigh);

  const leftShin = new THREE.Group();
  leftShin.position.y = -0.32;
  leftLeg.add(leftShin);

  const shinGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.32, 8);
  const leftLowerLeg = new THREE.Mesh(shinGeo, skinMat);
  leftLowerLeg.position.y = -0.15;
  leftLowerLeg.castShadow = true;
  leftShin.add(leftLowerLeg);

  // Foot / Mojari Shoe
  const footGeo = new THREE.BoxGeometry(0.09, 0.06, 0.18);
  const shoeMat = getMat('#78350f', 0.6, 0.1); // Leather Mojari
  const leftFoot = new THREE.Mesh(footGeo, shoeMat);
  leftFoot.position.set(0, -0.31, 0.04);
  leftFoot.castShadow = true;
  leftShin.add(leftFoot);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.12, -0.38, 0);
  torso.add(rightLeg);

  const rightThigh = new THREE.Mesh(legGeo, whiteClothMat);
  rightThigh.position.y = -0.15;
  rightThigh.castShadow = true;
  rightLeg.add(rightThigh);

  const rightShin = new THREE.Group();
  rightShin.position.y = -0.32;
  rightLeg.add(rightShin);

  const rightLowerLeg = new THREE.Mesh(shinGeo, skinMat);
  rightLowerLeg.position.y = -0.15;
  rightLowerLeg.castShadow = true;
  rightShin.add(rightLowerLeg);

  const rightFoot = new THREE.Mesh(footGeo, shoeMat);
  rightFoot.position.set(0, -0.31, 0.04);
  rightFoot.castShadow = true;
  rightShin.add(rightFoot);

  return {
    root,
    head,
    torso,
    leftArm,
    rightArm,
    leftForearm,
    rightForearm,
    leftLeg,
    rightLeg,
    leftShin,
    rightShin,
    isNpc: !options.isPlayer,
    npcData: options.npcData,
    animState: {
      walkTime: Math.random() * 10,
      idleTime: Math.random() * 10,
      actionTime: 0,
      isMoving: false,
      isRunning: false,
      isJumping: false,
      isGreeting: false,
      isInteracting: false,
    },
  };
}

/**
 * Procedural Skeletal Animation Update
 * Updates character bone rotations for idle breathing, running, walking, jumping, and namaste greetings.
 */
export function updateCharacterAnimation(rig: CharacterRig, delta: number) {
  const { animState } = rig;

  if (animState.isGreeting) {
    // Namaste / Anjali Mudra pose
    animState.actionTime += delta * 3;
    rig.leftArm.rotation.set(-0.8, 0.4, -0.5);
    rig.rightArm.rotation.set(-0.8, -0.4, 0.5);
    rig.leftForearm.rotation.set(-0.9, -0.3, 0.4);
    rig.rightForearm.rotation.set(-0.9, 0.3, -0.4);
    rig.head.rotation.x = Math.sin(animState.actionTime) * 0.08 + 0.12; // Gentle polite bow
    rig.torso.position.y = 1.0;
    rig.torso.rotation.set(0, 0, 0);
    return;
  }

  if (animState.isJumping) {
    // Dynamic jump pose: legs tucked, arms outstretched
    rig.leftLeg.rotation.set(-0.5, 0, 0.1);
    rig.rightLeg.rotation.set(-0.3, 0, -0.1);
    rig.leftShin.rotation.set(0.9, 0, 0);
    rig.rightShin.rotation.set(0.8, 0, 0);
    rig.leftArm.rotation.set(-1.2, 0, -0.4);
    rig.rightArm.rotation.set(-1.2, 0, 0.4);
    rig.head.rotation.set(-0.2, 0, 0);
    rig.torso.rotation.set(0, 0, 0);
    return;
  }

  if (animState.isMoving) {
    // Walking / Running Cycle
    const speedMultiplier = animState.isRunning ? 12 : 7.5;
    animState.walkTime += delta * speedMultiplier;
    const t = animState.walkTime;

    const strideAngle = animState.isRunning ? 0.85 : 0.55;
    const armSwingAngle = animState.isRunning ? 0.95 : 0.6;

    // Legs alternate in sine wave
    rig.leftLeg.rotation.x = Math.sin(t) * strideAngle;
    rig.rightLeg.rotation.x = -Math.sin(t) * strideAngle;

    // Knee bending during backstride
    rig.leftShin.rotation.x = Math.max(0, -Math.sin(t + 0.4) * (strideAngle * 1.2));
    rig.rightShin.rotation.x = Math.max(0, Math.sin(t + 0.4) * (strideAngle * 1.2));

    // Arms swing opposite to legs
    rig.leftArm.rotation.x = -Math.sin(t) * armSwingAngle;
    rig.rightArm.rotation.x = Math.sin(t) * armSwingAngle;
    rig.leftForearm.rotation.x = -Math.abs(Math.sin(t)) * 0.35 - 0.2;
    rig.rightForearm.rotation.x = -Math.abs(Math.cos(t)) * 0.35 - 0.2;

    // Torso bounce & subtle lateral sway
    rig.torso.position.y = 1.0 + Math.abs(Math.sin(t * 2)) * (animState.isRunning ? 0.08 : 0.04);
    rig.torso.rotation.y = Math.sin(t) * 0.08;
    rig.torso.rotation.z = Math.cos(t) * 0.03;
    rig.head.rotation.x = -0.05;
    rig.head.rotation.y = -Math.sin(t) * 0.05;
  } else {
    // Idle breathing & natural fidgeting
    animState.idleTime += delta * 1.8;
    const t = animState.idleTime;

    // Chest breathing expansion
    rig.torso.position.y = 1.0 + Math.sin(t) * 0.015;
    rig.torso.rotation.set(0, 0, 0);

    // Natural resting arms
    rig.leftArm.rotation.set(Math.sin(t) * 0.04, 0, 0.08);
    rig.rightArm.rotation.set(Math.sin(t + 0.5) * 0.04, 0, -0.08);
    rig.leftForearm.rotation.set(-0.15, 0, 0);
    rig.rightForearm.rotation.set(-0.15, 0, 0);

    // Legs straight
    rig.leftLeg.rotation.set(0, 0, 0.02);
    rig.rightLeg.rotation.set(0, 0, -0.02);
    rig.leftShin.rotation.set(0, 0, 0);
    rig.rightShin.rotation.set(0, 0, 0);

    // Subtle head glance
    rig.head.rotation.y = Math.sin(t * 0.4) * 0.12;
    rig.head.rotation.x = Math.sin(t * 0.8) * 0.03;
  }
}
