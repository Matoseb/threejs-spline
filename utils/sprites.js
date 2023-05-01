import * as THREE from 'three';

export function createSprite(material, w, h) {
    const { width, height } = material.map.image;
    const aspect = width / height;

    if (h === undefined) h = w / aspect

    const geometry = new THREE.PlaneGeometry(w, h, 10, 10);
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(0));
    const mesh = new THREE.Mesh(geometry, material);
    return mesh
}