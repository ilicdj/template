import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import testVertex from './shaders/testVertex.glsl'
import testFragment from './shaders/testFragment.glsl'

export default class Sketch {

  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.width, this.height)
    document.querySelector('#container').appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10)
    this.camera.position.z = 2

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.scene = new THREE.Scene()

    this.addMesh()

    this.time = 0

    this.render()
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  addMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      vertexShader: testVertex,
      fragmentShader: testFragment,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  render() {
    this.time++
    this.controls.update()
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.02
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }

  handleResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

}

new Sketch()