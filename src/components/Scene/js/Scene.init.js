import * as THREE from 'three'

class SceneInit {
  constructor({ rootEl }) {
    this.canvas = document.createElement('canvas')

    this.root = rootEl
    this.width = rootEl.clientWidth
    this.height = rootEl.clientHeight

    this.background = '#fefefe'

    this.init()
    this.update()
    this.bindEvents()
  }

  init() {
    this.initScene()
    this.initLights()
    this.initCamera()
    this.initRenderer()
    this.buildSceneGeometry()

    this.root.appendChild(this.canvas)
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.background)
    this.scene.fog = new THREE.Fog(this.background, 5, 30)
  }

  initLights() {
    const hlights = new THREE.AmbientLight('#666666')
    const directionalLight = new THREE.DirectionalLight('#dfebff', 1)
    directionalLight.position.set(0, 10, 10)
    directionalLight.position.multiplyScalar(1.3)

    this.scene.add(hlights)
    this.scene.add(directionalLight)
  }

  initCamera() {
    const aspect = this.width / this.height

    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)

    this.camera.position.set(0, 4, 5)
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(this.background, 1)

    this.canvas = this.renderer.domElement
  }

  buildSceneGeometry() {
    const geometry = new THREE.BoxGeometry(4, 2, 2)
    const material = new THREE.MeshBasicMaterial({ color: '#00ff00' })
    const cube = new THREE.Mesh(geometry, material)
    this.cube = cube
    this.cube.position.set(0, 2.5, -10)
    this.scene.add(cube)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  update() {
    requestAnimationFrame(() => this.update())

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.render()
  }

  // Callbacks

  onResize = () => {
    this.width = this.root.clientWidth
    this.height = this.root.clientHeight

    this.renderer.setSize(this.width, this.height)

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize)
  }
}

const sceneInit = (args) => new SceneInit(args)

export default sceneInit