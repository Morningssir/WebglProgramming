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
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
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

  update() {
    const { object, objectContainer } = this.props;
    let moveX, moveY;
    if (this.dragging) {
      moveX = this.mouse.x - this.prevMouse.x;
      moveY = this.mouse.y - this.prevMouse.y;
      objectContainer.rotation.y += moveX * 0.01;
      objectContainer.rotation.x += moveY * 0.01;
    }
    this.prevMouse.copy(this.mouse);
  }
}
