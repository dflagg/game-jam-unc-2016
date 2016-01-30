//constants
var GAME_BOARD_WIDTH = 800;
var GAME_BOARD_HEIGHT = 600;

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
var CRYSTAL_UI_X = 200;

var VEG_ICON_UI_IMG = "images/space/VegetationIcon.png"
var VEG_UI_Y = 10;
var VEG_UI_X = 300;

var SHELL_ICON_UI_IMG = "images/space/ShellIcon.png"
var SHELL_UI_Y = 10;
var SHELL_UI_X = 400;



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
  .add(VEG_ICON_UI_IMG)
  .add(SHELL_ICON_UI_IMG)
  .load(setup);

//Define any variables that are used in more than one function
var player, ship, state, crystalUi, vegUi, shellUi;

function setup() {

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

  vegUi = new Sprite(resources[VEG_ICON_UI_IMG].texture)
  vegUi.y = VEG_UI_Y;
  vegUi.x = VEG_UI_X;

  shellUi = new Sprite(resources[SHELL_ICON_UI_IMG].texture)
  shellUi.y = SHELL_UI_Y;
  shellUi.x = SHELL_UI_X;  
  
  stage.addChild(ship);
  stage.addChild(player);
  stage.addChild(crystalUi);
  stage.addChild(vegUi);
  stage.addChild(shellUi);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

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
}

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