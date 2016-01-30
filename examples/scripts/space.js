//CONSTANTS

//Entire game area including resource UI
var GAME_BOARD_WIDTH = 800;
var GAME_BOARD_HEIGHT = 600;

//Playable area
var PLAY_ARENA_WIDTH = 700;
var PLAY_ARENA_HEIGHT = 500;
var PLAY_AREA_ORIGIN_X = 50;
var PLAY_AREA_ORIGIN_Y = 50;

//Crashed ship details
var SHIP_IMG = "images/space/ship.jpeg"
var SHIP_POSITION_Y = 250;
var SHIP_POSITION_X = 350;
var SHIP_WIDTH = 120;
var SHIP_HEIGHT = 120;

//Player details
var PLAYER_IMG = "images/cat.png"
var PLAYER_START_Y = 350;
var PLAYER_START_X = 450;

//UI crystal
var CRYSTAL_ICON_UI_IMG = "images/space/CrystalIcon.png"
var CRYSTAL_UI_Y = 10;
var CRYSTAL_UI_X = 200;

//UI Food
var VEG_ICON_UI_IMG = "images/space/VegetationIcon.png"
var VEG_UI_Y = 10;
var VEG_UI_X = 300;

//UI carapaces
var SHELL_ICON_UI_IMG = "images/space/ShellIcon.png"
var SHELL_UI_Y = 10;
var SHELL_UI_X = 400;

//Laser details
var LASER_SHOT_IMG = "images/cat.png";
var LASER_SHOT_WIDTH = 16;
var LASER_SHOT_HEIGHT = 6;
var LASER_SHOT_SPEED = 4;


//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
document.body.appendChild(renderer.view);

loader
  .add("images/treasureHunter.json")
  .add(SHIP_IMG)
  .add(CRYSTAL_ICON_UI_IMG)
  .add(VEG_ICON_UI_IMG)
  .add(SHELL_ICON_UI_IMG)
  .add(LASER_SHOT_IMG)
  .load(setup);

//Define variables that might be used in more
//than one function
var state, explorer, treasure, monsters, chimes, exit, player, dungeon,
    door, healthBar, message, gameScene, gameOverScene, enemies, id,
    ship, crystalUi, vegUi, shellUi, laserShots, lastMove;

function setup() {

  //set the initial last move to right
  lastMove = "right";

  //Make the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  //Make the sprites and add them to the `gameScene`
  //Create an alias for the texture atlas frame ids
  id = resources["images/treasureHunter.json"].textures;

  //Dungeon
  dungeon = new Sprite(id["dungeon.png"]);
  dungeon.width = PLAY_ARENA_WIDTH;
  dungeon.height = PLAY_ARENA_HEIGHT;
  dungeon.x = PLAY_AREA_ORIGIN_X;
  dungeon.y = PLAY_AREA_ORIGIN_Y;
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(id["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  //ship
  ship = new Sprite(resources[SHIP_IMG].texture)
  ship.y = SHIP_POSITION_Y;
  ship.x = SHIP_POSITION_X;
  ship.width = SHIP_WIDTH;
  ship.height = SHIP_HEIGHT;
  gameScene.addChild(ship);

  //crystal icon
  crystalUi = new Sprite(resources[CRYSTAL_ICON_UI_IMG].texture)
  crystalUi.y = CRYSTAL_UI_Y;
  crystalUi.x = CRYSTAL_UI_X;
  gameScene.addChild(crystalUi);

  //food icon
  vegUi = new Sprite(resources[VEG_ICON_UI_IMG].texture)
  vegUi.y = VEG_UI_Y;
  vegUi.x = VEG_UI_X;
  gameScene.addChild(vegUi);

  //shell icon
  shellUi = new Sprite(resources[SHELL_ICON_UI_IMG].texture)
  shellUi.y = SHELL_UI_Y;
  shellUi.x = SHELL_UI_X;
  gameScene.addChild(shellUi);

  //Explorer
  explorer = new Sprite(id["explorer.png"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  //Make the monsters
  var numberOfMonsters = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1;

  //An array to store all the monsters
  monsters = [];

  //array to contain all laser shots in the arena
  laserShots = [];

  //Make as many monster as there are `numberOfMonsters`
  for (var i = 0; i < numberOfMonsters; i++) {

    //Make a monster
    var monster = new Sprite(id["blob.png"]);

    //Space each monster horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first monster should be added
    var x = spacing * i + xOffset;

    //Give the monster a random y position
    var y = randomInt(0, stage.height - monster.height);

    //Set the monster's position
    monster.x = x;
    monster.y = y;

    //Set the monster's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the monster will
    //move up. Multiplying `direction` by `speed` determines the monster's
    //vertical direction
    monster.vy = speed * direction;

    //Reverse the direction for the next monster
    direction *= -1;

    //Push the monster into the `monsters` array
    monsters.push(monster);

    //Add the monster to the `gameScene`
    gameScene.addChild(monster);
  }

  //Create the health bar
  healthBar = new Container();
  healthBar.position.set(stage.width - 170, 6)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  var innerBar = new Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  var outerBar = new Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  //Create the `gameOver` scene
  gameOverScene = new Container();
  stage.addChild(gameOverScene);

  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;

  //Create the text sprite and add it to the `gameOver` scene
  message = new Text(
    "The End!",
    {font: "64px Futura", fill: "white"}
  );
  message.x = 120;
  message.y = stage.height / 2 - 32;
  gameOverScene.addChild(message);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      shoot = keyboard(32);

  //when space is pressed fire the lazer!
  shoot.press = function() {
    var laserShot = new Sprite(resources[SHIP_IMG].texture);

    //use the explorer's current position as the initial position of the new laser shot
    laserShot.x = explorer.x;
    laserShot.y = explorer.y;
    laserShot.width = LASER_SHOT_WIDTH;
    laserShot.height = LASER_SHOT_HEIGHT;

    //initially the laser should have no speed in any direction until the last movement of the explorer is determined
    laserShot.vy = 0;
    laserShot.vx = 0;

    //the laser will move in the direction of the last move of the explorer
    if(lastMove == "up" || lastMove == "down") {
        laserShot.vy = -1 * (LASER_SHOT_SPEED);
    }
    if (lastMove == "down") {
        laserShot.vy = LASER_SHOT_SPEED;
    }
    if (lastMove == "right") {
        laserShot.vx = LASER_SHOT_SPEED;
    }
    if (lastMove == "left") {
        laserShot.vx = -1 * (LASER_SHOT_SPEED);
    }

    laserShots.push(laserShot);
    gameScene.addChild(laserShot);
  }

  //Left arrow key `press` method
  left.press = function() {

    //Change the explorer's velocity when the key is pressed
    explorer.vx = -5;
    explorer.vy = 0;
  };

  //Left arrow key `release` method
  left.release = function() {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the explorer isn't moving vertically:
    //Stop the explorer
    if (!right.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
    lastMove = "left";
  };

  //Up
  up.press = function() {
    explorer.vy = -5;
    explorer.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
    lastMove = "up";
  };

  //Right
  right.press = function() {
    explorer.vx = 5;
    explorer.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
    lastMove = "right";
  };

  //Down
  down.press = function() {
    explorer.vy = 5;
    explorer.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
    lastMove = "down";
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

  //use the explorer's velocity to make it move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  //Contain the explorer inside the area of the dungeon
  contain(explorer, {x: PLAY_AREA_ORIGIN_X, y: PLAY_AREA_ORIGIN_Y, width: PLAY_ARENA_WIDTH, height: PLAY_ARENA_HEIGHT});
  //contain(explorer, stage);

  //Set `explorerHit` to `false` before checking for a collision
  var explorerHit = false;

  //Loop through all the sprites in the `enemies` array
  monsters.forEach(function(monster) {

    //Move the monster
    monster.y += monster.vy;

    //Check the monster's screen boundaries
    var monsterHitsWall = contain(monster, {x: 28, y: 10, width: 488, height: 480});

    //If the monster hits the top or bottom of the stage, reverse
    //its direction
    if (monsterHitsWall === "top" || monsterHitsWall === "bottom") {
      monster.vy *= -1;
    }

    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if(hitTestRectangle(explorer, monster)) {
      explorerHit = true;
    }
  });

  //iterate through each laser shot and update its position or hide it if it leaves the board
  laserShots.forEach(function(laser) {
    //update the position of each laser shot based on its velocity
    laser.x += laser.vx;
    laser.y += laser.vy;

    //check if the laser has left the play area on the x axis
    if(laser.x > (PLAY_ARENA_WIDTH + PLAY_AREA_ORIGIN_X) || laser.x < PLAY_AREA_ORIGIN_X) {
      laser.visible = false;
    }
    //check if the laser has left the play area on the y axis
    if(laser.y > (PLAY_ARENA_HEIGHT + PLAY_AREA_ORIGIN_Y) || laser.y < PLAY_AREA_ORIGIN_Y) {
      laser.visible = false;
    }
  });

  //If the explorer is hit...
  if(explorerHit) {

    //Make the explorer semi-transparent
    explorer.alpha = 0.5;

    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.outer.width -= 1;

  } else {

    //Make the explorer fully opaque (non-transparent) if it hasn't been hit
    explorer.alpha = 1;
  }

  //Check for a collision between the explorer and the treasure
  if (hitTestRectangle(explorer, treasure)) {

    //If the treasure is touching the explorer, center it over the explorer
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  //Does the explorer have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";
  }

  //If the explorer has brought the treasure to the exit,
  //end the game and display "You won!"
  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = "You won!";
  }
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

/* Helper functions */

function contain(sprite, container) {

  var collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
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


//The `randomInt` helper function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

//end new code