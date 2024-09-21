import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import GUI from 'lil-gui'
import gsap from 'gsap'
import testVertex from './shaders/testVertex.glsl'
import testFragment from './shaders/testFragment.glsl'

// Postprocessing
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'


// console.log(gltf)


export default class Sketch {

  constructor(options) {
    this.scene = new THREE.Scene()

    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xeeeeee, 1)
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    )
    this.camera.position.set(0, 0, 2)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.enableDamping = true
    this.time = 0

    // this.dracoLoader = new DRACOLoader()
    // this.dracoLoader.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/')
    // this.gltf = new GLTFLoader()
    // this.gltf.setDRACOLoader(this.dracoLoader)

    this.isPlaying = true


    this.setupSettings()
    this.addPost()
    this.addObjects()
    this.render()
    this.resize()
  }

  setupSettings() {
    let that = this
    this.settings = {
      progress: 0,
      bloomStrength: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
    }
    this.gui = new GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.01)
  }

  addPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      vertexShader: testVertex,
      fragmentShader: testFragment,
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: 'f', value: 0 },
      }
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)


    // Model
    // this.gltf.load('./model.glb', gltf => {
    //   this.scene.add(gltf.scene);
    //   this.model = gltf.scene.children[0];
    //   this.model.scale.set(0.1, 0.1, 0.1);
    //   this.model.geometry.center();
    // });
  }

  stop() {
    this.isPlaying = false
  }

  play() {
    if(!this.isPlaying)
    {
      this.render()
      this.isPlaying = true
    }
  }

  handleResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)

    // Postprocessing
    // this.composer.setSize(this.width, this.height)

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  resize() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  render() {
    this.time += 0.01
    this.controls.update()
    window.requestAnimationFrame(this.render.bind(this))
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.02
    // Update uniforms
    this.material.uniforms.time.value = this.time
    this.material.uniforms.progress.value = this.settings.progress
    
    // Postprocessing
    // this.composer.render()
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({ dom: document.querySelector('#container') })