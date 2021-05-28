import { RotateMatrix } from "../src/Tool3d.js";

export class MouseEvent {
  constructor(props) {
    this.props = props;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.init();
  }

  init() {
    this.dragging = false;
    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);
    this.target = new THREE.Vector2(0, 0);
    this.matrix = new THREE.Matrix4();
    this.addListeners();
  }

  addListeners() {
    const { domElement } = this.props;
    domElement.addEventListener("mousedown", this.handleMouseDown, false);
    domElement.addEventListener("mousemove", this.handleMouseMove, false);
    domElement.addEventListener("mouseup", this.handleMouseUp, false);
    domElement.addEventListener("mouseout", this.handleMouseOut, false);
    domElement.addEventListener("mouseleave", this.handleMouseOut, false);
  }

  setMouse(e) {
    const { innerWidth, innerHeight } = window;
    this.mouse.x = (e.clientX / innerWidth) * 2 - 1;
    this.mouse.y = 1 - (e.clientY / innerHeight) * 2;
  }

  setDragging(flag) {
    this.dragging = flag;
  }

  handleMouseDown(e) {
    this.setMouse(e);
    this.setDragging(true);
  }

  handleMouseMove(e) {
    this.setMouse(e);
  }

  handleMouseUp(e) {
    this.setMouse(e);
    this.setDragging(false);
  }

  handleMouseOut() {
    this.setDragging(false);
  }

  update(delta) {
    const {
      object,
      objectContainer,
      easing,
      maxRotationX,
      rotateSpeed,
      autoRotateSpeed,
    } = this.props;
    let moveX = 0,
      moveY = 0;
    if (this.dragging) {
      moveX = this.mouse.x - this.prevMouse.x;
      moveY = this.mouse.y - this.prevMouse.y;
      this.target.y = Math.max(
        -maxRotationX,
        Math.min(0.6 * maxRotationX, this.target.y - moveY)
      );
    }
    this.target.x += (moveX - this.target.x) * easing;
    objectContainer.rotation.x +=
      (this.target.y + 0.3 - objectContainer.rotation.x) * easing;
    RotateMatrix(object, this.target.x * rotateSpeed, this.matrix);
    if (!this.dragging) {
      RotateMatrix(object, delta * autoRotateSpeed, this.matrix);
    }
    this.prevMouse.copy(this.mouse);
  }
}
