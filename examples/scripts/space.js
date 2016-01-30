//constants
var GAME_BOARD_WIDTH = 800;
var GAME_BOARD_HEIGHT = 600;

var PLAY_ARENA_WIDTH = 700;
var PLAY_ARENA_HEIGHT = 500;

var SHIP_IMG = "images/space/ship.jpeg"
var SHIP_POSITION_Y = 250;
var SHIP_POSITION_X = 350;
var SHIP_WIDTH = 120;
var SHIP_HEIGHT = 120;

var PLAYER_IMG = "images/cat.png"
var PLAYER_START_Y = 350;
var PLAYER_START_X = 450;

var CRYSTAL_ICON_UI_IMG = "images/space/CrystalIcon.png"
var CRYSTAL_UI_Y = 10;
var CRYSTAL_UI_X = 100;



//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
document.body.appendChild(renderer.view);

loader
  .add(PLAYER_IMG)
  .add(SHIP_IMG)
  .add(CRYSTAL_ICON_UI_IMG)
  .load(setup);

//Define any variables that are used in more than one function
var player, ship, state, box, message, crystalUi, laser;

function setup() {

//Create the box
  box = new PIXI.Graphics();
  box.beginFill(0xCCFF99);
  box.drawRect(0, 0, PLAY_ARENA_WIDTH, PLAY_ARENA_HEIGHT);
  box.endFill();
  box.x = 50;
  box.y = 50;
  stage.addChild(box);

  laser = new PIXI.Graphics();
  laser.beginFill(0x0000ff);
  laser.drawRect(0, 0, 4, 4)
  laser.endFill();

  //Create the `cat` sprite
  player = new Sprite(resources[PLAYER_IMG].texture);
  player.y = PLAYER_START_Y;
  player.x = PLAYER_START_X;
  player.vx = 0;
  player.vy = 0;

  ship = new Sprite(resources[SHIP_IMG].texture)
  ship.y = SHIP_POSITION_Y;
  ship.x = SHIP_POSITION_X;
  ship.width = SHIP_WIDTH;
  ship.height = SHIP_HEIGHT;
  ship.vx = 0;
  ship.vy = 0;
  
  crystalUi = new Sprite(resources[CRYSTAL_ICON_UI_IMG].texture)
  crystalUi.y = CRYSTAL_UI_Y;
  crystalUi.x = CRYSTAL_UI_X;
  
    //Create the text sprite
      message = new PIXI.Text(
        "No collision...",
        {font: "18px sans-serif", fill: "white"}
      );
      message.position.set(8, 8);
      stage.addChild(message);

  stage.addChild(ship);
  stage.addChild(player);
  stage.addChild(crystalUi);
  stage.addChild(laser);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
      shoot = keyboard(32);

  //Left arrow key `press` method
  left.press = function() {
    //Change the cat's velocity when the key is pressed
    player.vx = -5;
    player.vy = 0;
  };
  //Left arrow key `release` method
  left.release = function() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  shoot.press = function() {
    laser.x = player.x;
    laser.y = player.y;
    laser.vx = 1;
    laser.vy = 1;
  };

  //Up
  up.press = function() {
    player.vy = -5;
    player.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  //Right
  right.press = function() {
    player.vx = 5;
    player.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  //Down
  down.press = function() {
    player.vy = 5;
    player.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
}

function gameLoop(){

  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  //Update the current game state
  state();

  //Render the stage
  renderer.render(stage);
}

function play() {

  //Use the cat's velocity to make it move
  player.x += player.vx;
  player.y += player.vy

  //check for a collision between the cat and the box
    if (hitTestRectangle(player, box)) {

      //if there's a collision, change the message text
      //and tint the box red
      message.text = "hit!";
      box.tint = 0xff3300;
    } else {

      //if there's no collision, reset the message
      //text and the box's color
      message.text = "No collision...";
      box.tint = 0xccff99;
    }
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}