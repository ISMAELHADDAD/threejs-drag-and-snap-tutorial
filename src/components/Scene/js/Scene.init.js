import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragAcrossPlaneControls } from '@/three-lib/DragAcrossPlaneControls.js'

const OBJECT_LAYER = 2
const CONN_POINTS_LAYER = 3

class SceneInit {
  constructor({ rootEl }) {
    this.canvas = document.createElement('canvas')

    this.root = rootEl
    this.width = rootEl.clientWidth
    this.height = rootEl.clientHeight

    this.background = '#fefefe'

    this.objects = []

    this.isAddObjectMode = false

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
    this.initAddObjectModeRaycaster()
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
    this.camera.layers.enable(CONN_POINTS_LAYER)
    this.orbitControls.enabled = false
    event.object.children[0].material.emissive.set('#444400')
    this.selectedDraggableObject = event.object
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  onDragEnd = (event) => {
    this.camera.layers.set(0)
    this.snapObjects()
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

  snapObjects() {
    const selectedObjectPoints = this.selectedDraggableObject.children[0].children.map(
      (connPoint) => connPoint
    )
    this.objects
      .filter((object) => object.uuid !== this.selectedDraggableObject.uuid)
      .forEach((object) => {
        object.children[0].children.forEach((connPoint) => {
          selectedObjectPoints.forEach((sConnPoint) => {
            const s = new THREE.Vector3()
            const d = new THREE.Vector3()
            connPoint.getWorldPosition(d)
            sConnPoint.getWorldPosition(s)
            if (s.distanceTo(d) < 0.2) {
              // Position difference between connection points in WORLD coords
              // Move object that difference
              const differenceWorld = new THREE.Vector3().subVectors(d, s)
              const objectPosWorld = new THREE.Vector3()
              this.selectedDraggableObject.getWorldPosition(objectPosWorld)
              const moveWorld = new THREE.Vector3().addVectors(
                objectPosWorld,
                differenceWorld
              )
              this.selectedDraggableObject.position.set(
                moveWorld.x,
                moveWorld.y,
                moveWorld.z
              )
            }
          })
        })
      })
  }

  initAddObjectModeRaycaster() {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  }

  buildSceneGeometry() {
    this.buildPlane()
    this.buildMarker()
  }

  buildPlane() {
    const planeGeometry = new THREE.PlaneBufferGeometry(150, 150)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: '#eee',
    })
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
    this.plane.rotation.x -= Math.PI * 0.5
    this.scene.add(this.plane)
  }

  buildMarker() {
    this.marker = new THREE.Object3D()

    const geometryTorus = new THREE.TorusBufferGeometry(0.1, 0.02, 2, 100)
    const materialTorus = new THREE.MeshBasicMaterial({ color: '#5b3cc4' })
    const torus = new THREE.Mesh(geometryTorus, materialTorus)
    torus.rotation.x -= Math.PI * 0.5
    torus.position.y += 0.01
    this.marker.add(torus)

    const geometryCircle = new THREE.CircleBufferGeometry(0.08, 32)
    const materialCircle = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.5,
    })
    const circle = new THREE.Mesh(geometryCircle, materialCircle)
    circle.rotation.x -= Math.PI * 0.5
    circle.position.y += 0.01
    this.marker.add(circle)

    this.scene.add(this.marker)
  }

  instantiateObject() {
    if (!this.isAddObjectMode) return

    const geometry = new THREE.BoxGeometry(1, 0.5, 0.5)
    const material = new THREE.MeshLambertMaterial({
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.layers.enable(OBJECT_LAYER)
    const object = new THREE.Object3D()
    object.add(cube)
    object.position.copy(this.marker.position)
    object.position.y += 0.25

    // Generate connecting points
    const connectionPoints = [
      { x: -0.5, y: 0, z: 0 },
      { x: 0.5, y: 0, z: 0 },
      { x: 0, y: 0, z: 0.25 },
    ]
    connectionPoints.forEach((point) => {
      const sphereGeometry = new THREE.SphereBufferGeometry(0.1)
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(point.x, point.y, point.z)
      sphere.layers.set(CONN_POINTS_LAYER)
      object.children[0].add(sphere)
    })

    this.scene.add(object)
    this.objects.push(object)
  }

  planePointer() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects([this.plane], true)
    if (intersects.length > 0) {
      this.marker.visible = true
      this.marker.position.copy(intersects[0].point)
    } else {
      this.marker.visible = false
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  update() {
    requestAnimationFrame(() => this.update())

    this.orbitControls.update()

    if (this.isAddObjectMode) {
      this.planePointer()
      this.dragControl.enabled = false
    } else {
      this.marker.visible = false
      this.dragControl.enabled = true
    }

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

  onDocumentMouseMove = (event) => {
    event.preventDefault()
    this.mouse.x = (event.clientX / this.width) * 2 - 1
    this.mouse.y = -(event.clientY / this.height) * 2 + 1
  }

  onDocumentMouseDown = (event) => {
    if (event.target.localName === 'canvas' && event.button === 0)
      this.instantiateObject()
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize)
    this.canvas.addEventListener('mousemove', this.onDocumentMouseMove, false)
    this.canvas.addEventListener('mousedown', this.onDocumentMouseDown, false)
  }
}

const sceneInit = (args) => new SceneInit(args)

export default sceneInit
