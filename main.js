import * as THREE from 'three';

import 'normalize.css'
import './style.css'
import { Flow } from 'three/addons/modifiers/CurveModifier.js';
import { materials, textures, loadingFinished } from './materials/materials.js'

import { loadPaths, createTunnel } from './utils/paths';
import { createSprite } from './utils/sprites';
import { createComposer } from './shaders/postprocessing.js';
import { width, height, pixelDensity, zOffset } from './config'

let person

let autoFlow = true

let scene,
  camera,
  renderer,
  composer,
  flow

let chosenCurve;

init().then(animate);

async function init() {

  scene = new THREE.Scene();
  await loadingFinished;

  const paths = await loadPaths('/paths/paths.svg', {
    editPoint: ({ point, index, shape, id }) => {
      point.z = index * zOffset; // offset the depth of the tube
      return point
    }
  });

  Object.values(paths).forEach(curve => {
    const tunnel = createTunnel(curve, {
      map: textures.stroke
    })
    tunnel.position.set(0, 0, -zOffset * 10);
    scene.add(tunnel);
  })


  camera = new THREE.OrthographicCamera(
    0, width,
    0, height,
    -2000, 2000
  );

  person = createSprite(materials.person, 50, 200);

  chosenCurve = paths['path1'];
  flow = new Flow(person);
  flow.updateCurve(0, chosenCurve);
  scene.add(flow.object3D);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(pixelDensity);
  renderer.setSize(width, height);
  document.querySelector('#app').appendChild(renderer.domElement);

  scene.add(new THREE.AxesHelper(25));

  composer = createComposer(renderer, scene, camera)



  let timeout

  window.addEventListener('pointermove', (e) => {
    const x = e.clientX / window.innerWidth;
    flow.uniforms.pathOffset.value = x
    clearTimeout(timeout);
    autoFlow = false
    setTimeout(() => autoFlow = true, 1000)
  }, false);
}

function animate() {

  requestAnimationFrame(animate);

  if (autoFlow) {
    const curveLength = chosenCurve.getLength();
    const speed = 3

    flow.uniforms.pathOffset.value += speed / curveLength
    flow.uniforms.pathOffset.value %= 1
  };

  composer.render();
}