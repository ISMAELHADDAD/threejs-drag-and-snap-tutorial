import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragAcrossPlaneControls } from '@/three-lib/DragAcrossPlaneControls.js'

const OBJECT_LAYER = 2

class SceneInit {
  constructor({ rootEl }) {
    this.canvas = document.createElement('canvas')

    this.root = rootEl
    this.width = rootEl.clientWidth
    this.height = rootEl.clientHeight

    this.background = '#fefefe'

    this.objects = []

    this.init()
    this.update()
    this.bindEvents()
  }

  init() {
    this.initScene()
    this.initLights()
    this.initCamera()
    this.initRenderer()
    this.initOrbitControls()
    this.initDragControls()
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

  initOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.canvas)

    this.orbitControls.maxPolarAngle = Math.PI * 0.45

    this.orbitControls.enableDamping = true
    this.orbitControls.dampingFactor = 0.05
    this.orbitControls.screenSpacePanning = false

    this.orbitControls.maxDistance = 15
    this.orbitControls.minDistance = 3

    this.orbitControls.update()
  }

  initDragControls() {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0))
    this.dragControl = new DragAcrossPlaneControls(
      this.objects,
      this.camera,
      this.canvas,
      plane,
      OBJECT_LAYER
    )
    this.dragControl.addEventListener('dragstart', this.onDragStart)
    this.dragControl.addEventListener('dragend', this.onDragEnd)
  }

  onDragStart = (event) => {
    this.orbitControls.enabled = false
    event.object.children[0].material.emissive.set('#444400')
    this.selectedDraggableObject = event.object
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  onDragEnd = (event) => {
    this.orbitControls.enabled = true
    event.object.children[0].material.emissive.set('#000000')
    document.removeEventListener('keydown', this.onKeyDown, false)
    this.selectedDraggableObject = undefined
  }

  onKeyDown = (event) => {
    // On keypress: 'R'
    if (event.keyCode === 82) {
      this.rotateObject(this.selectedDraggableObject)
    }
  }

  rotateObject(object) {
    object.rotation.y += Math.PI * 0.5
  }

  buildSceneGeometry() {
    const geometry = new THREE.BoxGeometry(2, 1, 1)
    const material = new THREE.MeshLambertMaterial({ color: '#00ff00' })
    const cube = new THREE.Mesh(geometry, material)
    cube.layers.enable(OBJECT_LAYER)
    const group = new THREE.Group()
    group.add(cube)
    this.objects.push(group)
    this.scene.add(group)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  update() {
    requestAnimationFrame(() => this.update())

    this.orbitControls.update()

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
