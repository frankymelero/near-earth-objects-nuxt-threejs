<template>
    <canvas ref="canvas"></canvas>
   
</template>

<script setup>
import { ref, onMounted} from 'vue';
import * as THREE from 'three';
import { useResize } from '~/util/useResize';


const canvasRef = ref(null);
let scene, camera, renderer, stars, starGeo;


onMounted(() => {
  canvasRef.value = document.querySelector('canvas');
  init();
  animate();

});

useResize(onWindowResize);

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    1,
    1000
  );
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value });
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight);

  starGeo = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < 6000; i++) {
    const star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    starPositions.push(star.x, star.y, star.z);
  }

  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

  const sprite = new THREE.TextureLoader().load('/assets/img/star3.png');
  const starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 1.1,
    map: sprite,
    transparent: true,
    alphaTest: 0.6,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function onWindowResize() {
  const { clientWidth, clientHeight } = canvasRef.value;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
}

function animate() {
  starGeo.attributes.position.array.forEach((position, index) => {
    const i = index % 3;
    if (i === 1) {
      // Y-coordinate
      starGeo.attributes.position.array[index] -= 0.2;
      if (position < -200) {
        starGeo.attributes.position.array[index] = 200;
      }
    }
  });

  starGeo.attributes.position.needsUpdate = true;
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
</script>

<style>


canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}


</style>
