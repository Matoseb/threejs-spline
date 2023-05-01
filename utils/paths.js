import * as THREE from 'three';
import * as config from '/config';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

const loader = new SVGLoader();


export function loadPaths(url, options) {

    options = {
        zStep: 0.01,
        editPoint: ({ point }) => point,
        ...options,
    }

    return new Promise((resolve, reject) => {


        loader.load(
            // resource URL
            url,
            // called when the resource is loaded
            (data) => {

                const curves = {}
                data.paths.forEach(path => {

                    let shape = path.toShapes(true)[0];
                    shape = shape.extractPoints().shape;

                    const id = path.userData.node.id
                    const curve = new THREE.CatmullRomCurve3(
                        shape.map((pos, index, shape) => options.editPoint({ point: new THREE.Vector3(pos.x, pos.y, 0), index, shape, id }))
                    );
                    curve.curveType = 'centripetal';
                    curves[id] = curve
                });

                resolve(curves)

                // scene.add(group);

            },
            // called when loading is in progresses
            (xhr) => {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            (error) => reject(error)
        );

    });


}

export function createTunnel(curve, options) {
    const points = curve.getPoints(curve.arcLengthDivisions);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new MeshLine();
    line.setGeometry(lineGeometry)

    const tubeMaterial = new MeshLineMaterial({
        lineWidth: 80 / config.height,
        sizeAttenuation: 0,
        opacity: 0.5,
        useMap: 1,
        color: new THREE.Color('white'),
        ...options
    });

    const tube = new THREE.Mesh(line, tubeMaterial);

    return tube
}