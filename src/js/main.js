import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
import { Pane } from 'tweakpane'
import gsap from 'gsap'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'

export default class Sketch {

  constructor(options) {
    this.scene = new THREE.Scene()

    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xeeeeee, 1)
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.container.appendChild(this.renderer.domElement)


    // let frastumSize = 1
    // this.camera = new THREE.OrthographicCamera(frastumSize / -2, frastumSize / 2, frastumSize / 2, frastumSize / -2, -1000, 1000)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    )
    this.camera.position.set(0, 0, 2)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.time = 0

    this.fps()
    this.setupSettings()
    this.addObjects()
    // this.setInitialResolution()
    this.resize()
    this.render()
  }

  fps() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
  }

  setupSettings() {
    this.params = {
      progress: 0
    };

    const pane = new Pane({
      title: 'Parameters',
    });

    pane.addBinding(this.params, 'progress', {
      min: 0,
      max: 1,
      step: 0.01,
    });
  }

  getMaterial() {
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { type: "f", value: 0 },
        uProgress: { type: 'f', value: 0 },
        uTexture: { type: 't', value: new THREE.TextureLoader().load('./src/images/texture.jpg') },
        // uResolution: { type: "v4", value: new THREE.Vector4() },
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

  // setInitialResolution() {
  //   this.width = this.container.offsetWidth
  //   this.height = this.container.offsetHeight

  //   // Image aspect ratio handling
  //   this.videoAspect = 1 / 1;
  //   let a1, a2
  //   if (this.height / this.width > this.videoAspect) {
  //     a1 = (this.width / this.height) * this.videoAspect
  //     a2 = 1
  //   } else {
  //     a1 = 1
  //     a2 = (this.height / this.width) / this.videoAspect
  //   }

  //   // Ensure material exists before setting uniforms
  //   if (this.material) {
  //     this.material.uniforms.uResolution.value.x = this.width
  //     this.material.uniforms.uResolution.value.y = this.height
  //     this.material.uniforms.uResolution.value.z = a1
  //     this.material.uniforms.uResolution.value.w = a2
  //   }
  // }

  handleResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height

    // Image aspect ratio handling
    // this.videoAspect = 1 / 1;
    // let a1, a2
    // if (this.height / this.width > this.videoAspect) {
    //   a1 = (this.width / this.height) * this.videoAspect
    //   a2 = 1
    // } else {
    //   a1 = 1
    //   a2 = (this.height / this.width) / this.videoAspect
    // }
    // this.material.uniforms.uResolution.value.x = this.width
    // this.material.uniforms.uResolution.value.y = this.height
    // this.material.uniforms.uResolution.value.z = a1
    // this.material.uniforms.uResolution.value.w = a2

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
    this.material.uniforms.uProgress.value = this.params.progress

    window.requestAnimationFrame(this.render.bind(this))
    this.stats.end()
    this.renderer.render(this.scene, this.camera)
  }
}

new Sketch({ dom: document.querySelector('#container') })