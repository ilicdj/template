import * as THREE from 'three'
import { REVISION } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import GUI from 'lil-gui'
import gsap from 'gsap'
import testVertex from './shaders/testVertex.glsl'
import testFragment from './shaders/testFragment.glsl'
// import gltf from '/face.glb?url'

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

    // Load with DRACO
    // const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
    // const manager = new THREE.LoadingManager()
    // this.dracoLoader = new DRACOLoader(manager)
    // this.dracoLoader.setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`)
    // Load with GLTFLoader
    // this.gltfLoader = new GLTFLoader()
    // this.gltfLoader.setDRACOLoader(this.dracoLoader)
    // this.gltfLoader.load(gltf, (gltf) => { })

    this.isPlaying = true


    this.setupSettings()
    this.addObjects()
    this.render()
    this.resize()
  }

  setupSettings() {
    this.settings = {
      progress: 0
    }
    this.gui = new GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.01)
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
    
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({ dom: document.querySelector('#container') })