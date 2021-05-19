let Application = PIXI.Application,
  loader = PIXI.loader,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle;

let app = new Application({
  width: 480,
  height: 480,
  antialias: true,
  transparent: false,
  resolution: 1,
});

document.body.appendChild(app.view);

loader.add(["images/castle.png", "images/princess.png"]).load(setup);

let dungeon, princess;

function setup() {
  let dungeonTexture = TextureCache["images/castle.png"];
  let dungeonRectangle = new Rectangle(32, 64, 32, 32);
  dungeonTexture.frame = dungeonRectangle;

  for (let i = 0; i < 225; i++) {
    dungeon = new Sprite(dungeonTexture);
    dungeon.x = (i % 15) * 32;
    dungeon.y = parseInt(i / 15) * 32;
    app.stage.addChild(dungeon);
  }

  let princessTexture = TextureCache["images/princess.png"];
  let princessRectangle = new Rectangle(3, 8, 25, 50);
  princessTexture.frame = princessRectangle;
  princess = new Sprite(princessTexture);
  princess.vx = 0;
  princess.vy = 0;
  princess.x = 120;
  princess.y = 120;
  app.stage.addChild(princess);

  let left = keyBoard(37),
    up = keyBoard(38),
    right = keyBoard(39),
    down = keyBoard(40);

  left.press = () => {
    princessRectangle = new Rectangle(3, 72, 25, 50);
    princessTexture.frame = princessRectangle;
    princess.texture = princessTexture;
    princess.vx = -5;
    princess.vy = 0;
  };

  left.release = () => {
    princess.vx = 0;
  };

  up.press = () => {
    princessRectangle = new Rectangle(3, 200, 25, 50);
    princessTexture.frame = princessRectangle;
    princess.texture = princessTexture;
    princess.vy = -5;
    princess.vx = 0;
  };

  up.release = () => {
    princess.vy = 0;
  };

  right.press = () => {
    princessRectangle = new Rectangle(3, 136, 25, 50);
    princessTexture.frame = princessRectangle;
    princess.texture = princessTexture;
    princess.vx = 5;
    princess.vy = 0;
  };

  right.release = () => {
    princess.vx = 0;
  };

  down.press = () => {
    princessRectangle = new Rectangle(3, 8, 25, 50);
    princessTexture.frame = princessRectangle;
    princess.texture = princessTexture;
    princess.vx = 0;
    princess.vy = 5;
  };

  down.release = () => {
    princess.vy = 0;
  };

  app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
  princess.x += princess.vx;
  princess.y += princess.vy;

  if (princess.x <= 0) princess.x = 0;
  if (princess.y <= 0) princess.y = 0;
  if (princess.x >= 455) princess.x = 455;
  if (princess.y >= 430) princess.y = 430;
}

function keyBoard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isUp = true;
  key.isDown = false;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = (event) => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  key.upHandler = (event) => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  window.addEventListener("keydown", key.downHandler.bind(key), false);

  window.addEventListener("keyup", key.upHandler.bind(key), false);

  return key;
}
