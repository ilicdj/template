import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'

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

    this.fps()
    this.setupSettings()
    this.addObjects()
    this.resize()
    this.render()
  }

  fps() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
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

  getMaterial() {
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { type: "f", value: 0 },
        uProgress: { type: 'f', value: 0 },
        uTexture: { type: 't', value: new THREE.TextureLoader().load('./src/images/texture.jpg') }
      },
      // transparent: true,
      // wireframe: true
    })
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    this.material = this.getMaterial()

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
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
    this.stats.begin()
    this.time += 0.01
    this.controls.update()
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.02
    // Update uniforms
    this.material.uniforms.uTime.value = this.time
    this.material.uniforms.uProgress.value = this.settings.progress

    window.requestAnimationFrame(this.render.bind(this))
    this.stats.end()
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({ dom: document.querySelector('#container') })