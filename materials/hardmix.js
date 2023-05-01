import * as THREE from 'three';

const fragmentShader = /*glsl*/`
varying vec2 vUv;
uniform sampler2D map;
uniform vec3 color;
#define threshold 4.0

void main() {
  vec4 texelColor = texture2D(map, vUv);
  vec3 gray = abs((texelColor.xyz - 0.5) * threshold);
  texelColor.a *= (gray.x + gray.y + gray.z) / 3.0;

  // tint with color
  texelColor.rgb *= color;

  gl_FragColor = texelColor;
}
`

// white texture
const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);

export class HardMixMaterial extends THREE.ShaderMaterial {
    constructor(options = {}) {
        super({
            uniforms: {
                map: { value: options.map || white },
                color: { value: options.color || new THREE.Color('white') },
            },
            defines: {
                USE_UV: true,
            },
            vertexShader: THREE.ShaderLib.basic.vertexShader,
            fragmentShader,
            transparent: true
        })

        this.map = options.map;
    }
}