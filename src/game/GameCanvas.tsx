import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { audio } from './audio';
import { NPCS, MISSIONS, COLLECTIBLES } from './gameState';
import { CharacterRig, createStylizedHumanMesh, updateCharacterAnimation } from './characterModels';
import { buildCompleteIndianWorld, WorldObjects, InteractiveMesh, getGroundHeight } from './worldBuilder';
import { GameProgress, PlayerCustomization, NPCData } from '../types';

interface GameCanvasProps {
  progress: GameProgress;
  playerCustomization: PlayerCustomization;
  onUpdateProgress: (newProgress: Partial<GameProgress>) => void;
  onInteractNPC: (npc: NPCData) => void;
  onOpenRangoli: () => void;
  onOpenPottery: () => void;
  onCompleteGame: () => void;
  onSetInteractionPrompt: (prompt: { text: string; action: () => void } | null) => void;
  onZoneChange: (zone: string) => void;
  onPlayerPositionChange?: (pos: { x: number; y: number; z: number }, rotY: number) => void;
  onDailyObjectiveProgress?: (type: string, targetId?: string, targetPos?: [number, number, number]) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  progress,
  playerCustomization,
  onUpdateProgress,
  onInteractNPC,
  onOpenRangoli,
  onOpenPottery,
  onCompleteGame,
  onSetInteractionPrompt,
  onZoneChange,
  onPlayerPositionChange,
  onDailyObjectiveProgress
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const worldRef = useRef<WorldObjects | null>(null);
  const playerRigRef = useRef<CharacterRig | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const cameraAngleRef = useRef({ theta: 0, phi: 0.35, distance: 7.5 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Physics state
  const playerPosRef = useRef(new THREE.Vector3(-14, 0, 16)); // Start in village square
  const playerVelRef = useRef(new THREE.Vector3(0, 0, 0));
  const isGroundedRef = useRef(true);

  // Proximity interact action cache
  const nearestInteractRef = useRef<InteractiveMesh | null>(null);

  // Handle resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfde68a); // Warm Indian golden sky
    scene.fog = new THREE.FogExp2(0xfde68a, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // =====================================
    // LIGHTING: Warm Indian Golden Hour Sun
    // =====================================
    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x451a03, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Build complete Indian 3D World
    const world = buildCompleteIndianWorld(scene);
    worldRef.current = world;

    // Spawn Player Rig
    const playerRig = createStylizedHumanMesh({
      isPlayer: true,
      customization: playerCustomization
    });
    playerRig.root.position.copy(playerPosRef.current);
    scene.add(playerRig.root);
    playerRigRef.current = playerRig;

    // Setup input listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      audio.resume();

      if (e.code === 'KeyE') {
        triggerNearestInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      cameraAngleRef.current.theta -= deltaX * 0.006;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(1.2, cameraAngleRef.current.phi + deltaY * 0.005));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraAngleRef.current.distance = Math.max(
        4.0,
        Math.min(14.0, cameraAngleRef.current.distance + e.deltaY * 0.008)
      );
    };

    // Touch controls for mobile/tablets
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        cameraAngleRef.current.theta -= deltaX * 0.008;
        cameraAngleRef.current.phi = Math.max(0.1, Math.min(1.2, cameraAngleRef.current.phi + deltaY * 0.007));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // =====================================
    // MAIN GAME LOOP (60 FPS)
    // =====================================
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentZone = 'village';

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const now = performance.now();

      // 1. Process Player Movement & Input
      const keys = keysRef.current;

      // Camera POV Key Controls (Q/E for continuous angle rotation)
      if (keys['KeyQ']) {
        cameraAngleRef.current.theta -= 2.0 * delta;
      }
      if (keys['KeyE'] && !keys['KeyW'] && !keys['KeyS'] && !keys['KeyA'] && !keys['KeyD']) {
        // If not moving, allow E to rotate view if no interaction prompt is active
      }

      const isRunning = keys['ShiftLeft'] || keys['ShiftRight'];
      const speed = isRunning ? 9.5 : 5.2;

      let moveX = 0;
      let moveZ = 0;

      if (keys['KeyW'] || keys['ArrowUp']) moveZ -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) moveZ += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;

      const isMoving = moveX !== 0 || moveZ !== 0;

      if (isMoving) {
        // Move relative to camera azimuth angle
        const cameraAngle = cameraAngleRef.current.theta;

        const forward = new THREE.Vector3(Math.sin(cameraAngle), 0, Math.cos(cameraAngle));
        const right = new THREE.Vector3(Math.cos(cameraAngle), 0, -Math.sin(cameraAngle));

        const moveDir = new THREE.Vector3()
          .addScaledVector(forward, -moveZ)
          .addScaledVector(right, moveX)
          .normalize();

        playerPosRef.current.x += moveDir.x * speed * delta;
        playerPosRef.current.z += moveDir.z * speed * delta;

        // Rotate player mesh toward movement direction
        const targetRotY = Math.atan2(moveDir.x, moveDir.z);
        const curRig = playerRigRef.current;
        if (curRig && curRig.root) {
          curRig.root.rotation.y = THREE.MathUtils.lerp(
            curRig.root.rotation.y,
            targetRotY,
            0.2
          );
        }

        // Footsteps SFX
        if (isGroundedRef.current) {
          const currentSurface = currentZone === 'temple' || currentZone === 'stepwell' ? 'stone' : 'grass';
          audio.playFootstep(currentSurface);
        }
      }

      // Dynamic Elevation & Surface Snapping (Temple, Stairs, Bridges, Chabutra)
      const groundY = getGroundHeight(playerPosRef.current.x, playerPosRef.current.z);

      // Jump Physics
      if (keys['Space'] && isGroundedRef.current) {
        playerVelRef.current.y = 7.2;
        isGroundedRef.current = false;
        audio.playJump();
      }

      // Ground Snap & Gravity
      if (isGroundedRef.current) {
        // Smoothly adjust player Y to terrain slope / stairs when walking
        const heightDiff = groundY - playerPosRef.current.y;
        if (Math.abs(heightDiff) < 1.6) {
          playerPosRef.current.y = THREE.MathUtils.lerp(playerPosRef.current.y, groundY, 0.4);
          if (Math.abs(playerPosRef.current.y - groundY) < 0.02) {
            playerPosRef.current.y = groundY;
          }
        } else if (heightDiff < -0.3) {
          // Walked off an edge, start falling
          isGroundedRef.current = false;
          playerVelRef.current.y = 0;
        }
      } else {
        // In the air (jumping or falling)
        playerVelRef.current.y -= 18.0 * delta;
        playerPosRef.current.y += playerVelRef.current.y * delta;

        if (playerPosRef.current.y <= groundY) {
          playerPosRef.current.y = groundY;
          playerVelRef.current.y = 0;
          isGroundedRef.current = true;
        }
      }

      // Boundary clamping
      playerPosRef.current.x = Math.max(-52, Math.min(52, playerPosRef.current.x));
      playerPosRef.current.z = Math.max(-62, Math.min(48, playerPosRef.current.z));

      // Update Player Rig Position & Skeletal Animation
      const activePlayerRig = playerRigRef.current;
      if (activePlayerRig) {
        activePlayerRig.root.position.copy(playerPosRef.current);
        activePlayerRig.animState.isMoving = isMoving;
        activePlayerRig.animState.isRunning = isRunning;
        activePlayerRig.animState.isJumping = !isGroundedRef.current;
        updateCharacterAnimation(activePlayerRig, delta);
      }

      // Update NPC Skeletal Animations & Look at Player
      world.npcRigs.forEach(npcRig => {
        updateCharacterAnimation(npcRig, delta);
        // If player is close, turn head toward player gently
        const distToPlayer = npcRig.root.position.distanceTo(playerPosRef.current);
        if (distToPlayer < 7.0 && npcRig.head) {
          const angle = Math.atan2(
            playerPosRef.current.x - npcRig.root.position.x,
            playerPosRef.current.z - npcRig.root.position.z
          );
          npcRig.head.rotation.y = THREE.MathUtils.lerp(
            npcRig.head.rotation.y,
            angle - npcRig.root.rotation.y,
            0.1
          );
        }
      });

      // Update Particles and Water Ripples
      world.particleSystems.forEach(ps => ps.update(delta));
      world.waterMeshes.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(now * 0.002 + idx) * 0.001;
      });

      // Rotate Grand Sun Wheel on Altar
      if (world.grandAltarWheel) {
        world.grandAltarWheel.rotation.z += 0.005;
      }

      // 2. Camera Orbit & Follow
      const { theta, phi, distance } = cameraAngleRef.current;
      const camTarget = playerPosRef.current.clone().add(new THREE.Vector3(0, 1.6, 0));

      const camX = camTarget.x + Math.sin(theta) * Math.cos(phi) * distance;
      const camY = Math.max(1.0, camTarget.y + Math.sin(phi) * distance);
      const camZ = camTarget.z + Math.cos(theta) * Math.cos(phi) * distance;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(camTarget);

      // 3. Zone Detection & Position Streaming
      let detectedZone = 'village';
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      const pz = playerPosRef.current.z;

      if (pz < -16 && px < 0) {
        detectedZone = 'stepwell';
      } else if (pz < -8 && px >= 0) {
        detectedZone = 'forest';
      } else if (px >= 10) {
        detectedZone = 'temple';
      } else {
        detectedZone = 'village';
      }

      if (detectedZone !== currentZone) {
        currentZone = detectedZone;
        onZoneChange(detectedZone);
        audio.updateZoneAtmosphere(detectedZone as any);
      }

      // Stream player position & facing rotation for real-time mini-map & daily exploration
      const activeRotY = playerRigRef.current ? playerRigRef.current.root.rotation.y : 0;
      if (onPlayerPositionChange) {
        onPlayerPositionChange({ x: px, y: py, z: pz }, activeRotY);
      }

      // Check proximity to potential daily quest exploration milestones
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('reach_location', undefined, [px, py, pz]);
      }

      // 4. Proximity & Interaction Checking
      let closestObj: InteractiveMesh | null = null;
      let minDistance = 3.8;

      world.interactiveObjects.forEach(obj => {
        const dist = playerPosRef.current.distanceTo(obj.position);
        if (dist < minDistance) {
          minDistance = dist;
          closestObj = obj;
        }
      });

      nearestInteractRef.current = closestObj;

      if (closestObj) {
        onSetInteractionPrompt({
          text: (closestObj as InteractiveMesh).promptText,
          action: () => triggerInteraction(closestObj as InteractiveMesh)
        });
      } else {
        onSetInteractionPrompt(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Player customization on change
  useEffect(() => {
    const scene = sceneRef.current;
    if (playerRigRef.current && scene) {
      // Rebuild player mesh if customization changes
      const oldRotY = playerRigRef.current.root.rotation.y;
      scene.remove(playerRigRef.current.root);

      const newRig = createStylizedHumanMesh({
        isPlayer: true,
        customization: playerCustomization
      });
      newRig.root.position.copy(playerPosRef.current);
      newRig.root.rotation.y = oldRotY;
      scene.add(newRig.root);
      playerRigRef.current = newRig;
    }
  }, [playerCustomization]);

  // Execute interactive object logic
  const triggerInteraction = (obj: InteractiveMesh) => {
    if (!obj) return;
    audio.playClick();

    if (obj.type === 'npc') {
      const npc = obj.data as NPCData;
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('interact_npc', npc.id);
      }
      // If talking to potter and player has clay
      if (npc.id === 'potter_madhav' && progress.currentMissionIndex === 0) {
        if (progress.inventory.filter(i => i.includes('Clay')).length >= 3) {
          onUpdateProgress({
            completedMissions: [...progress.completedMissions, 'mission_village_potter'],
            currentMissionIndex: 1,
            badges: Array.from(new Set([...progress.badges, 'badge_potter_apprentice'])),
            inventory: [...progress.inventory, 'Terracotta Cooling Vessel']
          });
          audio.playMissionComplete();
        }
      }
      onInteractNPC(npc);
    } else if (obj.type === 'collectible') {
      const col = obj.data;
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('collect_item', col.name);
      }
      if (!progress.inventory.includes(col.name)) {
        // Collect item
        obj.mesh.visible = false;
        audio.playCollectSound();

        const updatedInventory = [...progress.inventory, col.name];
        const update: Partial<GameProgress> = { inventory: updatedInventory };

        if (col.type === 'clay') {
          const clayCount = updatedInventory.filter(i => i.includes('Clay')).length;
          // Update mission count
          const curM = MISSIONS[0];
          curM.currentCount = clayCount;
        } else if (col.type === 'waste') {
          const wasteCount = (progress.wasteCollectedCount || 0) + 1;
          update.wasteCollectedCount = wasteCount;
          const curM = MISSIONS[2];
          curM.currentCount = wasteCount;

          if (wasteCount >= 5) {
            update.completedMissions = [...progress.completedMissions, 'mission_forest_conservation'];
            update.currentMissionIndex = 3;
            update.badges = Array.from(new Set([...progress.badges, 'badge_nature_guardian']));
            update.inventory = [...updatedInventory, 'Water Divining Talisman'];
            audio.playMissionComplete();
          }
        } else if (col.type === 'key') {
          update.inventory = [...updatedInventory, 'Brass Key of the Rashtrakutas'];
          update.templeDoorUnlocked = true;
          audio.playMissionComplete();
        }

        onUpdateProgress(update);
      }
    } else if (obj.type === 'pillar') {
      const pIdx = obj.data?.index ?? 0;
      const newPillars = [...progress.pillarsAligned];
      newPillars[pIdx] = true;

      // Glow pillar glyph
      const pilMesh = worldRef.current?.pillarMeshes.find(p => p.index === pIdx);
      if (pilMesh) {
        pilMesh.glyph.scale.set(1.4, 1.4, 1.4);
      }
      audio.playTempleBell();

      const allAligned = newPillars.every(Boolean);
      const update: Partial<GameProgress> = { pillarsAligned: newPillars };

      if (allAligned && !progress.templeDoorUnlocked) {
        update.templeDoorUnlocked = true;
        update.completedMissions = [...progress.completedMissions, 'mission_temple_sanctum'];
        update.currentMissionIndex = 2;
        update.badges = Array.from(new Set([...progress.badges, 'badge_temple_scholar']));
        update.inventory = [...progress.inventory, 'Brass Key of the Rashtrakutas'];
        audio.playMissionComplete();

        // Slide open secret door
        if (worldRef.current?.templeSecretDoor) {
          worldRef.current.templeSecretDoor.position.x += 2.5;
        }
      }

      onUpdateProgress(update);
    } else if (obj.type === 'chest') {
      if (progress.inventory.some(i => i.includes('Brass Key'))) {
        audio.playMissionComplete();
        onUpdateProgress({
          stepwellChestOpened: true,
          completedMissions: [...progress.completedMissions, 'mission_stepwell_treasure'],
          currentMissionIndex: 4,
          badges: Array.from(new Set([...progress.badges, 'badge_stepwell_master'])),
          inventory: [...progress.inventory, 'Royal Ashokan Seal Fragment']
        });
      } else {
        audio.playClick();
      }
    } else if (obj.type === 'bell') {
      audio.playTempleBell();
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('ring_bell', 'temple_bell');
      }
    } else if (obj.type === 'rangoli_station') {
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('reach_location', 'rangoli_station');
      }
      onOpenRangoli();
    } else if (obj.type === 'altar') {
      if (onDailyObjectiveProgress) {
        onDailyObjectiveProgress('reach_location', 'grand_altar');
      }
      // Assemble all pieces for Grand Final Discovery!
      if (progress.badges.length >= 4 || progress.currentMissionIndex >= 4) {
        onUpdateProgress({
          finalArtifactFound: true,
          completedMissions: [...progress.completedMissions, 'mission_grand_discovery'],
          badges: Array.from(new Set([...progress.badges, 'badge_itihva_champion']))
        });
        onCompleteGame();
      } else {
        audio.playClick();
      }
    }
  };

  const triggerNearestInteraction = () => {
    if (nearestInteractRef.current) {
      triggerInteraction(nearestInteractRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing outline-none"
    />
  );
};
