import {
  EventDispatcher,
  Matrix4,
  Raycaster,
  Vector2,
  Vector3,
} from 'three/build/three.module'

const DragAcrossPlaneControls = function (
  _objects,
  _camera,
  _domElement,
  _plane,
  _layer
) {
  const _raycaster = new Raycaster()
  _raycaster.layers.set(_layer)

  const _mouse = new Vector2()
  const _offset = new Vector3()
  const _intersection = new Vector3()
  const _worldPosition = new Vector3()
  const _inverseMatrix = new Matrix4()
  const _intersections = []

  let _selected = null
  let _hovered = null

  //

  const scope = this

  function activate() {
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false)
    _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false)
    _domElement.addEventListener('touchmove', onDocumentTouchMove, false)
    _domElement.addEventListener('touchstart', onDocumentTouchStart, false)
    _domElement.addEventListener('touchend', onDocumentTouchEnd, false)
  }

  function deactivate() {
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false)
    _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false)
    _domElement.removeEventListener('touchmove', onDocumentTouchMove, false)
    _domElement.removeEventListener('touchstart', onDocumentTouchStart, false)
    _domElement.removeEventListener('touchend', onDocumentTouchEnd, false)
  }

  function dispose() {
    deactivate()
  }

  function getObjects() {
    return _objects
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    const rect = _domElement.getBoundingClientRect()

    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    _raycaster.setFromCamera(_mouse, _camera)

    if (_selected && scope.enabled) {
      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(
          _intersection.sub(_offset).applyMatrix4(_inverseMatrix)
        )
      }

      scope.dispatchEvent({ type: 'drag', object: _selected })

      return
    }

    _intersections.length = 0

    _raycaster.setFromCamera(_mouse, _camera)
    _raycaster.intersectObjects(_objects, true, _intersections)

    if (_intersections.length > 0) {
      const object = _intersections[0].object

      if (_hovered !== object) {
        scope.dispatchEvent({ type: 'hoveron', object })

        _domElement.style.cursor = 'pointer'
        _hovered = object
      }
    } else if (_hovered !== null) {
      scope.dispatchEvent({ type: 'hoveroff', object: _hovered })

      _domElement.style.cursor = 'auto'
      _hovered = null
    }
  }

  function onDocumentMouseDown(event) {
    event.preventDefault()

    _intersections.length = 0

    _raycaster.setFromCamera(_mouse, _camera)
    _raycaster.intersectObjects(_objects, true, _intersections)

    if (_intersections.length > 0) {
      _selected =
        scope.transformGroup === true
          ? _objects[0]
          : _intersections[0].object.parent

      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _inverseMatrix.getInverse(_selected.parent.matrixWorld)
        _offset
          .copy(_intersection)
          .sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld))
      }

      _domElement.style.cursor = 'move'

      scope.dispatchEvent({ type: 'dragstart', object: _selected })
    }
  }

  function onDocumentMouseCancel(event) {
    event.preventDefault()

    if (_selected) {
      scope.dispatchEvent({ type: 'dragend', object: _selected })

      _selected = null
    }

    _domElement.style.cursor = _hovered ? 'pointer' : 'auto'
  }

  function onDocumentTouchMove(event) {
    event.preventDefault()
    event = event.changedTouches[0]

    const rect = _domElement.getBoundingClientRect()

    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    _raycaster.setFromCamera(_mouse, _camera)

    if (_selected && scope.enabled) {
      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(
          _intersection.sub(_offset).applyMatrix4(_inverseMatrix)
        )
      }

      scope.dispatchEvent({ type: 'drag', object: _selected })
    }
  }

  function onDocumentTouchStart(event) {
    event.preventDefault()
    event = event.changedTouches[0]

    const rect = _domElement.getBoundingClientRect()

    _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    _intersections.length = 0

    _raycaster.setFromCamera(_mouse, _camera)
    _raycaster.intersectObjects(_objects, true, _intersections)

    if (_intersections.length > 0) {
      _selected =
        scope.transformGroup === true
          ? _objects[0]
          : _intersections[0].object.parent

      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _inverseMatrix.getInverse(_selected.parent.matrixWorld)
        _offset
          .copy(_intersection)
          .sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld))
      }

      _domElement.style.cursor = 'move'

      scope.dispatchEvent({ type: 'dragstart', object: _selected })
    }
  }

  function onDocumentTouchEnd(event) {
    event.preventDefault()

    if (_selected) {
      scope.dispatchEvent({ type: 'dragend', object: _selected })

      _selected = null
    }

    _domElement.style.cursor = 'auto'
  }

  activate()

  // API

  this.enabled = true
  this.transformGroup = false

  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
  this.getObjects = getObjects
}

DragAcrossPlaneControls.prototype = Object.create(EventDispatcher.prototype)
DragAcrossPlaneControls.prototype.constructor = DragAcrossPlaneControls

export { DragAcrossPlaneControls }
