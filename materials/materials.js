import * as THREE from 'three';
import { HardMixMaterial } from './hardmix';

const materials = {}
const textures = {}

const manager = new THREE.LoadingManager();

const loadingFinished = new Promise((resolve, reject) => {
    manager.onLoad = () => {
        resolve();
    };
});

const texLoader = new THREE.TextureLoader(manager);

export function loadFlipped(url) {
    const texture = texLoader.load(url)
    texture.flipY = false;
    return texture
}


const video = document.createElement('video');
video.muted = true;
video.loop = true;
video.src = '/videos/displace.mp4';
video.play();
textures.drawing = new THREE.VideoTexture(video);

textures.stroke = loadFlipped("/textures/strokeline.png")
textures.person = loadFlipped("/sprites/person.png")

materials.basic = new THREE.MeshBasicMaterial({ color: new THREE.Color('white') });
materials.wire = new THREE.MeshBasicMaterial({ color: new THREE.Color('white'), wireframe: true });
materials.sprite = new HardMixMaterial({ map: textures.sprite, transparent: true });
materials.person = new HardMixMaterial({ map: textures.person });

export { materials, textures, loadingFinished }