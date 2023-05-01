import { textures } from "/materials/materials.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
/**
 * Full-screen textured quad shader
 */

const DrawingEffect = {

    uniforms: {

        'tDiffuse': { value: null },
        'tNoise': { value: null },
        'distortion': { value: 0.003 }
    },

    vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
        uniform sampler2D tNoise;
        uniform float distortion;

		varying vec2 vUv;

        #define t(j) texture2D(tNoise, j ).xy

		void main() {
            vec2 p = vUv;
            gl_FragColor = texture2D(tDiffuse, p - (t(p) - t(vec2(1., -1.))) * distortion);
		}`

};

function createComposer(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const drawingPass = new ShaderPass(DrawingEffect);
    
    drawingPass.uniforms.tNoise.value = textures.drawing;

    composer.addPass(renderPass);
    composer.addPass(drawingPass);
    
    return composer
}

export { DrawingEffect, createComposer };
