//CONSTANTS

//Entire game area including resource UI
var GAME_BOARD_WIDTH = 800;
var GAME_BOARD_HEIGHT = 600;

//Title Screen
var TITLE_SCREEN = "images/space/TitleScreen.jpg";

//Playable area
var PLAY_ARENA_WIDTH = 700;
var PLAY_ARENA_HEIGHT = 500;
var PLAY_AREA_ORIGIN_X = 50;
var PLAY_AREA_ORIGIN_Y = 50;
var GAME_ARENA_START_IMG = "images/space/Area1-1.jpg"

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
var CRYSTAL_UI_X = 300;

//UI Food
var VEG_ICON_UI_IMG = "images/space/VegetationIcon.png"
var VEG_UI_Y = 10;
var VEG_UI_X = 400;
var VEG_PICKUP_IMG = "images/space/VegetationPickup.png"

//UI carapaces
var SHELL_ICON_UI_IMG = "images/space/ShellIcon.png"
var SHELL_UI_Y = 10;
var SHELL_UI_X = 500;
var SHELL_DROP_IMG = "images/space/ShellPickup.png"
var SHELL_DROP_WIDTH = 25;
var SHELL_DROP_HEIGHT = 25;

//Laser details
var LASER_SHOT_IMG = "images/space/Shot.png";
var LASER_SHOT_WIDTH = 6;
var LASER_SHOT_HEIGHT = 6;
var LASER_SHOT_SPEED = 8;

//UI energy bar
var ENERGY_BAR_UI_IMG = "images/space/EnergyBar.png"
var ENERGY_BAR_UI_Y = 10;
var ENERGY_BAR_UI_X = 60;
var ENERGY_BAR_UI_WIDTH = 200
var ENERGY_BAR_UI_HEIGHT = 30;

//monster details
var SURFACE_MONSTER_IMGS = ["images/space/SurfaceCreature1.png", "images/space/SurfaceCreature2.png",
                            "images/space/SurfaceCreature3.png", "images/space/SurfaceCreature4.png"];
var SURFACE_MONSTER_WIDTH = 30;
var SURFACE_MONSTER_HEIGHT = 25;
var SURFACE_MONSTER_IMG_UPDATE_FREQ = 20;
//maximum speed the surface monster will move at
var SURFACE_MONSTER_SPEED = 0.5;

//cave monster details
var CAVE_MONSTER_IMGS = ["images/space/CaveCreature1.png","images/space/CaveCreature2.png",
                            "images/space/CaveCreature3.png","images/space/CaveCreature4.png"];
var CAVE_MONSTER_WIDTH = 50;
var CAVE_MONSTER_HEIGHT = 30;
var CAVE_MONSTER_IMG_UPDATE_FREQ = 40;
var CAVE_MONSTER_SPEED = 1;

//player details
var PLAYER_BACK_IMGS = ["images/space/PlayerBack1.png","images/space/PlayerBack2.png","images/space/PlayerBack3.png"];
var PLAYER_FRONT_IMGS = ["images/space/PlayerFront1.png","images/space/PlayerFront2.png","images/space/PlayerFront3.png"];
var PLAYER_RIGHT_IMGS = ["images/space/PlayerRight1.png","images/space/PlayerRight2.png","images/space/PlayerRight3.png"];
var PLAYER_LEFT_IMGS = ["images/space/PlayerLeft1.png","images/space/PlayerLeft2.png","images/space/PlayerLeft3.png"];
var PLAYER_HEIGHT = 50;
var PLAYER_WIDTH = 20;
var PLAYER_WALK_SPEED = 3;
//larger value causes the image to update less frequently
var PLAYER_WALK_FREQUENCY = 8;

//fonts 
var font1 = "fonts/CHECKBK0.TTF"
var font2 = "fonts/TABU TRIAL____.otf"


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


//add each of the images for the surface monster
SURFACE_MONSTER_IMGS.forEach(function(img) {
    loader.add(img);
});
CAVE_MONSTER_IMGS.forEach(function(img) {
    loader.add(img);
})

//load all the player images for player animations
PLAYER_BACK_IMGS.forEach(function(img) {
    loader.add(img);
});
PLAYER_FRONT_IMGS.forEach(function(img) {
    loader.add(img);
});
PLAYER_LEFT_IMGS.forEach(function(img) {
    loader.add(img);
});
PLAYER_RIGHT_IMGS.forEach(function(img) {
    loader.add(img);
});

loader
  .add("images/treasureHunter.json")
  .add(SHIP_IMG)
  .add(CRYSTAL_ICON_UI_IMG)
  .add(VEG_ICON_UI_IMG)
  .add(VEG_PICKUP_IMG)
  .add(SHELL_ICON_UI_IMG)
  .add(LASER_SHOT_IMG)
  .add(ENERGY_BAR_UI_IMG)
  .add(GAME_ARENA_START_IMG)
  .add(SHELL_DROP_IMG)
  .add(TITLE_SCREEN)
  .load(setup);

//Define variables that might be used in more
//than one function
var state, explorer, treasure, monsters, chimes, exit, player, dungeon,
    door, healthBar, message, gameScene, gameOverScene, enemies, id,
    ship, crystalUi, vegUi, shellUi, laserShots, lastMove, energyBarUi,
    monstersKilled, laserShotsFired, shotsFiredMessage, monstersKilledMessage,
	epUseSpeed, ep, epBarLength, maxEp, walkTick, playTick, playerMoving,
	caveMonsters, vegUncollect, vegCollect, vegCounter, veg, shells, shellsCollected,
	shellsCollectedMessage, titlescreen, testText, Titlemessage;

	
 // Attempted title state 
/*	
function title() {
	//Create the `gameTitle` scene
  gameTitleScene = new Container();
  stage.addChild(gameTitleScene);

	Titlemessage = new Text(
    "",
    {font: "64px Arial", fill: "white"}
  );
  Titlemessage.x = stage.width / 2 - 100;
  Titlemessage.y = stage.height / 2 - 42;
  gameTitleScene.addChild(Titlemessage);

	
 
  //Make the `gameTitle` scene invisible when the game first starts
  gameTitleScene.visible = true;

  
  //Create the text sprite and add it to the `gameOver` scene
  
    
  gameTitleScene.visible = true;
  //gameScene.visible = false;
  //gameOverScene.visible = false;
	

	testText = new Text (
    "Hello World?",
    {font: "30px Futura", fill: "green"}
  );
  testText.x = 30;
  testText.y = 30;
  gameTitleScene.addChild(testText);
	
	
	//for (var begin =0; begin <= 1; begin++) {
  titlescreen = new Sprite(resources[TITLE_SCREEN].texture);
  titlescreen.width = PLAY_ARENA_WIDTH;
  titlescreen.height = PLAY_ARENA_HEIGHT;
  titlescreen.x = PLAY_AREA_ORIGIN_X;
  titlescreen.y = PLAY_AREA_ORIGIN_Y;
  gameTitleScene.addChild(titlescreen);
  //};
	
}
*/
	
function setup() {

	//music and sound
	
  sounds.load([
	//"sounds/shoot.wav", 
	"sounds/music.wav",
	//"sounds/bounce.mp3",
	//"sounds/Scavenger.mp3",
	"sounds/laserShot.wav",
	"sounds/SurfaceCreatureDie.wav"
  ]);

  var laserShotSound = sounds["sounds/laserShot.wav"],
    SurfaceCreatureDie = sounds["SurfaceCreatureDie"],
    music = sounds["sounds/music.wav"];
	//scavenger = sounds["sounds/Scavenger.mp3"];
    //bounce = sounds["sounds/bounce.mp3"];
	
	
  //initially zero shells have been collected
  shellsCollected = 0;

  //initially the player should not be moving
  playerMoving = false;

  //walk tick animation index
  walkTick = 0;
	
  //game play tick
  playTick = 0;

  //initial number of monsters killed
  monstersKilled = 0;

  //initial value of the laser shots fired
  laserShotsFired = 0;

  //set the initial last move to right
  lastMove = "right";

  //Make the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  //Make the sprites and add them to the `gameScene`
  //Create an alias for the texture atlas frame ids
  id = resources["images/treasureHunter.json"].textures;

  //Dungeon
  dungeon = new Sprite(resources[GAME_ARENA_START_IMG].texture);
  dungeon.width = PLAY_ARENA_WIDTH;
  dungeon.height = PLAY_ARENA_HEIGHT;
  dungeon.x = PLAY_AREA_ORIGIN_X;
  dungeon.y = PLAY_AREA_ORIGIN_Y;
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(id["door.png"]);
  door.position.set(32, 0);
  //gameScene.addChild(door);

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
  crystalUi.width = 20;
  crystalUi.height = 35;
  gameScene.addChild(crystalUi);

  //veg icon
  vegUi = new Sprite(resources[VEG_ICON_UI_IMG].texture)
  vegUi.y = VEG_UI_Y;
  vegUi.x = VEG_UI_X;
  vegUi.width = 25;
  vegUi.height = 42;
  gameScene.addChild(vegUi);

  //shell icon
  shellUi = new Sprite(resources[SHELL_ICON_UI_IMG].texture)
  shellUi.y = SHELL_UI_Y;
  shellUi.x = SHELL_UI_X;
  shellUi.width = 20;
  shellUi.height = 35;
  gameScene.addChild(shellUi);
  
  //energy bar icon
  energyBarUi = new Sprite(resources[ENERGY_BAR_UI_IMG].texture)
  energyBarUi.y = ENERGY_BAR_UI_Y;
  energyBarUi.x = ENERGY_BAR_UI_X;
  energyBarUi.width = ENERGY_BAR_UI_WIDTH;
  energyBarUi.height = ENERGY_BAR_UI_HEIGHT;

  gameScene.addChild(energyBarUi);

  //Explorer
  explorer = new Sprite(resources[PLAYER_FRONT_IMGS[0]].texture);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  explorer.width = PLAYER_WIDTH;
  explorer.height = PLAYER_HEIGHT;
  gameScene.addChild(explorer);

  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  //gameScene.addChild(treasure);
 
  //array to contain veg on map
  vegUncollect = [];
  vegCollect = 0;
  var numberOfVeg = 5;
  
  //Make as many monster as there are `numberOfMonsters`
  for (var i = 0; i < numberOfVeg; i++) {

    //Make a veg
    var veg = new Sprite(resources[VEG_PICKUP_IMG].texture);
    //veg.width = ;
    //veg.height = ;

    //Space each monster horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first monster should be added
    var vegX = randomInt(100, stage.height - 100);

    //Give the monster a random y position
    var vegY = randomInt(100, stage.height - 100);

    //Set the monster's position
    veg.x = vegX;
    veg.y = vegY;

    //Push the monster into the `monsters` array
    vegUncollect.push(veg);

    //Add the monster to the `gameScene`
    gameScene.addChild(veg);
  }
  
  //Make the monsters
  var numberOfMonsters = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1,
      caveMonsterCount = 3;

  //An array to store all the monsters
  monsters = [];

  //an arrat to store the cave monsters
  caveMonsters = [];

  //array to contain all laser shots in the arena
  laserShots = [];

  //shells of dead monsters
  shells = [];

  //Make as many monster as there are `numberOfMonsters`
  for (var i = 0; i < numberOfMonsters; i++) {

    //Make a monster
    var monster = new Sprite(resources[SURFACE_MONSTER_IMGS[0]].texture);
    monster.width = SURFACE_MONSTER_WIDTH;
    monster.height = SURFACE_MONSTER_HEIGHT;

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
    monster.vx = 0;

    //Reverse the direction for the next monster
    direction *= -1;

    //Push the monster into the `monsters` array
    monsters.push(monster);

    //Add the monster to the `gameScene`
    gameScene.addChild(monster);
	
  }

  for(var i=0; i<caveMonsterCount; i++) {

    var monster = new Sprite(resources[CAVE_MONSTER_IMGS[0]].texture);
    monster.width = CAVE_MONSTER_WIDTH;
    monster.height = CAVE_MONSTER_HEIGHT;

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
    monster.vx = 0;

    //Reverse the direction for the next monster
    direction *= -1;

    //Push the monster into the `monsters` array
    caveMonsters.push(monster);

    //Add the monster to the `gameScene`
    gameScene.addChild(monster);

  }


  
  //Create the health bar
  //Set Initial ep
  maxEp = 100
  ep = 100
  rechargeRate = 0.5
  damageRate = 2
  
  //Create the energy bar
  healthBar = new Container();
  healthBar.position.set(71, 20)
  //healthBar.position.set(stage.width - 70, 6)
  gameScene.addChild(healthBar);

  //Create the red background rectangle
  var innerBar = new Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 178, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  var outerBar = new Graphics();
  outerBar.beginFill(0x00E000);
  outerBar.drawRect(0, 0, 178, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
  healthBar.inner = innerBar;

  //Create the `gameOver` scene
  gameOverScene = new Container();
  stage.addChild(gameOverScene);

  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;

  //Create the text sprite and add it to the `gameOver` scene
  message = new Text(
    "The End!",
    {font: "64px Arial", fill: "white"}
  );
  message.x = stage.width / 2 - 100;
  message.y = stage.height / 2 - 42;
  gameOverScene.addChild(message);

  //the count of shells collected
  shellsCollectedMessage = new Text(
    shellsCollected,
    {font: "30px Futura", fill: "green"}
  )
  shellsCollectedMessage.x = 550;
  shellsCollectedMessage.y = 12;
  gameScene.addChild(shellsCollectedMessage);

  //the message displaying the number of laser shots fired
  shotsFiredMessage = new Text (
    "Laser Shots: " + laserShotsFired,
    {font: "14px Futura", fill: "white"}
  );
  shotsFiredMessage.x = 650;
  shotsFiredMessage.y = 10;
  gameScene.addChild(shotsFiredMessage);

  //the message displaying the number of monsters killed
  monstersKilledMessage = new Text (
    "Monsters killed: " + monstersKilled,
    {font: "14px Futura", fill: "white"}
  );
  monstersKilledMessage.x = 650;
  monstersKilledMessage.y = 25;
  gameScene.addChild(monstersKilledMessage);
  
  
  //UI displaying number of veg collected
  vegCounter = new Text (
    vegCollect,
    {font: "30px Futura", fill: "green"}
  );
  vegCounter.x = 450;
  vegCounter.y = 12;
  gameScene.addChild(vegCounter);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      shoot = keyboard(32),
      w = keyboard(87),
      a = keyboard(65),
      s = keyboard(83),
      d = keyboard(68);
	  q = keyboard(81); 
	  e = keyboard(69);

  q.press = function() {
	  music.play();
  }
  
  e.press = function() {
	  music.pause();
  }
  
  //when space is pressed fire the lazer!
  shoot.press = function() {
    //increment the number of laser shots fired each time the space bar is pressed
    laserShotsFired += 1;
	ep = ep - 10
	laserShotSound.play();
    //update the lasers fired message
    shotsFiredMessage.text = "Laser Shots: " + laserShotsFired

    var laserShot = new Sprite(resources[LASER_SHOT_IMG].texture);

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
  //wasd to up, right ,down ,left
  w.press = function() {	
	up.press();
  };
  w.release = function() {	
	up.release();
  }; 
  a.press = function() {	
	left.press();
  };
  a.release = function() {	
	left.release();
  }; 
  s.press = function() {	
	down.press();
  };
  s.release = function() {	
	down.release();
  }; 
  d.press = function() {	
	right.press();
  };
  d.release = function() {	
	right.release();
  };

  //Left arrow key `press` method
  left.press = function() {

    //Change the explorer's velocity when the key is pressed
    explorer.vx = -PLAYER_WALK_SPEED;
    explorer.vy = 0;

    updateExplorer(PLAYER_LEFT_IMGS[0]);
    lastMove = "left";
    playerMoving = true;
  };

  //Left arrow key `release` method
  left.release = function() {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the explorer isn't moving vertically:
    //Stop the explorer
    if (!right.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
    playerMoving = false;
  };

  //Up
  up.press = function() {
    explorer.vy = -PLAYER_WALK_SPEED;
    explorer.vx = 0;

    updateExplorer(PLAYER_BACK_IMGS[0]);
    lastMove = "up";
    playerMoving = true;
  };
  up.release = function() {
    if (!down.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
    playerMoving = false;
  };

  //Right
  right.press = function() {
    explorer.vx = PLAYER_WALK_SPEED;
    explorer.vy = 0;

    updateExplorer(PLAYER_RIGHT_IMGS[0]);
    lastMove = "right";
    playerMoving =true;
  };
  right.release = function() {
    if (!left.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
    playerMoving = false;
  };

  //Down
  down.press = function() {
    explorer.vy = PLAYER_WALK_SPEED;
    explorer.vx = 0;

    updateExplorer(PLAYER_FRONT_IMGS[0]);
    lastMove = "down";
    playerMoving = true;
  };
  down.release = function() {
    if (!up.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
    playerMoving = false;
  };

  //Set the game state
  state = play;
  
  //Start the game loop
  gameLoop();
	
}



//change the image of the explorer to the new image
function updateExplorer(newImg) {
    explorer.visible = false;

    var oldExplorerX = explorer.x;
    var oldExplorerY = explorer.y;
    var oldExplorerVy = explorer.vy;
    var oldExplorerVx = explorer.vx;

    explorer = new Sprite(resources[newImg].texture);
    explorer.x = oldExplorerX;
    explorer.y = oldExplorerY;
    explorer.vx = oldExplorerVx;
    explorer.vy = oldExplorerVy;
    explorer.width = PLAYER_WIDTH;
    explorer.height = PLAYER_HEIGHT;
    gameScene.addChild(explorer);
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
	
	
  //increment the number of ticks that the game has run for
  playTick += 1;

  //use the explorer's velocity to make it move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  //check if this play tick we should update the player's image
  if(playTick % PLAYER_WALK_FREQUENCY == 0) {
    //increment the walk tick so we can show a new image
    walkTick += 1;

    //reset the walk tick if we reach the end of the walk images available
    if(walkTick >= PLAYER_BACK_IMGS.length) {
        walkTick = 0;
    }

    //if the player is moving (holding down one of the movement keys) update the image according to which direction
    //the player is moving
    if (playerMoving) {

        if(lastMove == "up") {
            updateExplorer(PLAYER_BACK_IMGS[walkTick]);
        }
        if(lastMove == "down") {
            updateExplorer(PLAYER_FRONT_IMGS[walkTick]);
        }
        if(lastMove == "left") {
            updateExplorer(PLAYER_LEFT_IMGS[walkTick]);
        }
        if(lastMove == "right") {
            updateExplorer(PLAYER_RIGHT_IMGS[walkTick]);
        }

    }
	
	

  }

  //Contain the explorer inside the area of the dungeon
  contain(explorer, {x: PLAY_AREA_ORIGIN_X, y: PLAY_AREA_ORIGIN_Y, width: PLAY_ARENA_WIDTH + PLAY_AREA_ORIGIN_X, height: PLAY_ARENA_HEIGHT + PLAY_AREA_ORIGIN_Y});
  //contain(explorer, stage);

  //Set `explorerHit` to `false` before checking for a collision
  var explorerHit = false;

  caveMonsters.forEach(function(monster) {

    //Move the monster according to their current velocity
    monster.y += monster.vy;
    monster.x += monster.vx;

    var randomIntMonsterImgIndex = randomInt(0,CAVE_MONSTER_IMG_UPDATE_FREQ);
    if(randomIntMonsterImgIndex < CAVE_MONSTER_IMGS.length) {

        //get this monster's current values so the predecessor monster can inherit these values
        var monsterX = monster.x;
        var monsterY = monster.y;

        //reset monster's velocity to zero
        var monsterVx = 0;
        var monsterVy = 0;
		

        //if the monster is to the left of the player move the monster right
        if(monster.x < explorer.x) {
            monsterVx = CAVE_MONSTER_SPEED;
        }
        //if the monster is to the right of the player move the monster left
        if(monster.x > explorer.x) {
            monsterVx = -CAVE_MONSTER_SPEED;
        }
        //if the monster is above the player move the monster down
        if(monster.y < explorer.y) {
            monsterVy = CAVE_MONSTER_SPEED;
        }
        //if the monster is below the player move the monster up
        if(monster.y > explorer.y) {
            monsterVy = -CAVE_MONSTER_SPEED;
        }

        //make the old monster invisible
        monster.visible = false;

        //remove the old monster so we can replace him with a new sprite and new image
        var oldMonsterIndex = caveMonsters.indexOf(monster);
        caveMonsters.splice(oldMonsterIndex, 1);

        //Make a new monster using the random monster image
        var newMonster = new Sprite(resources[CAVE_MONSTER_IMGS[randomIntMonsterImgIndex]].texture);
        newMonster.width = CAVE_MONSTER_WIDTH;
        newMonster.height = CAVE_MONSTER_HEIGHT;

        //Set the monster's position
        newMonster.x = monsterX;
        newMonster.y = monsterY;

        //Set the monster's vertical velocity. `direction` will be either `1` or
        //`-1`. `1` means the enemy will move down and `-1` means the monster will
        //move up. Multiplying `direction` by `speed` determines the monster's
        //vertical direction
        newMonster.vy = monsterVy; //speed * direction;
        newMonster.vx = monsterVx;

        //Push the monster into the `monsters` array
        caveMonsters.push(newMonster);

        //Add the monster to the `gameScene`
        gameScene.addChild(newMonster);

    }

    //Check the monster's screen boundaries
    var monsterHitsWall = contain(explorer, {x: PLAY_AREA_ORIGIN_X, y: PLAY_AREA_ORIGIN_Y, width: PLAY_ARENA_WIDTH + PLAY_AREA_ORIGIN_X, height: PLAY_ARENA_HEIGHT + PLAY_AREA_ORIGIN_Y});

    //If the monster hits the top or bottom of the stage, reverse
    //its direction
    if (monsterHitsWall === "top" || monsterHitsWall === "bottom") {
      monster.vy *= -CAVE_MONSTER_SPEED;
    }

    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if(hitTestRectangle(explorer, monster)) {
      explorerHit = true;
    }

  });

  //Loop through all the sprites in the `enemies` array
  monsters.forEach(function(monster) {

    //Move the monster according to their current velocity
    monster.y += monster.vy;
    monster.x += monster.vx;

    //change the monster image randomly based on the frequency set - a higher frequency makes the monster update less often
    var randomIntMonsterImgIndex = randomInt(0,SURFACE_MONSTER_IMG_UPDATE_FREQ);
    if(randomIntMonsterImgIndex < SURFACE_MONSTER_IMGS.length) {

        //get this monster's current values so the predecessor monster can inherit these values
        var monsterX = monster.x;
        var monsterY = monster.y;

        //reset monster's velocity to zero
        var monsterVx = 0;
        var monsterVy = 0;

        //if the monster is to the left of the player move the monster right
        if(monster.x < explorer.x) {
            monsterVx = SURFACE_MONSTER_SPEED;
        }
        //if the monster is to the right of the player move the monster left
        if(monster.x > explorer.x) {
            monsterVx = -SURFACE_MONSTER_SPEED;
        }
        //if the monster is above the player move the monster down
        if(monster.y < explorer.y) {
            monsterVy = SURFACE_MONSTER_SPEED;
        }
        //if the monster is below the player move the monster up
        if(monster.y > explorer.y) {
            monsterVy = -SURFACE_MONSTER_SPEED;
        }

        //make the old monster invisible
        monster.visible = false;

        //remove the old monster so we can replace him with a new sprite and new image
        var oldMonsterIndex = monsters.indexOf(monster);
        monsters.splice(oldMonsterIndex, 1);

        //Make a new monster using the random monster image
        var newMonster = new Sprite(resources[SURFACE_MONSTER_IMGS[randomIntMonsterImgIndex]].texture);
        newMonster.width = SURFACE_MONSTER_WIDTH;
        newMonster.height = SURFACE_MONSTER_HEIGHT;

        //Set the monster's position
        newMonster.x = monsterX;
        newMonster.y = monsterY;

        //Set the monster's vertical velocity. `direction` will be either `1` or
        //`-1`. `1` means the enemy will move down and `-1` means the monster will
        //move up. Multiplying `direction` by `speed` determines the monster's
        //vertical direction
        newMonster.vy = monsterVy; //speed * direction;
        newMonster.vx = monsterVx;

        //Push the monster into the `monsters` array
        monsters.push(newMonster);

        //Add the monster to the `gameScene`
        gameScene.addChild(newMonster);

    }

    //Check the monster's screen boundaries
    var monsterHitsWall = contain(explorer, {x: PLAY_AREA_ORIGIN_X, y: PLAY_AREA_ORIGIN_Y, width: PLAY_ARENA_WIDTH + PLAY_AREA_ORIGIN_X, height: PLAY_ARENA_HEIGHT + PLAY_AREA_ORIGIN_Y});


    //If the monster hits the top or bottom of the stage, reverse
    //its direction
    if (monsterHitsWall === "top" || monsterHitsWall === "bottom") {
      monster.vy *= -SURFACE_MONSTER_SPEED;
    }
	
	
    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if(hitTestRectangle(explorer, monster)) {
      explorerHit = true;
	  //bounce.play();
	  
    }
  });

  //iterate through each laser shot and update its position or hide it if it leaves the board
  laserShots.forEach(function(laser) {
    //update the position of each laser shot based on its velocity
    laser.x += laser.vx;
    laser.y += laser.vy;

    //iterate through all the monsters to look for laser hits
    monsters.forEach(function(monster) {

      //check if the laser hit the monster
      if(hitTestRectangle(laser, monster)) {

          //create a shell where the monster had been
          dropShell(monster.x, monster.y);

          //increment the number of monsters killed
          monstersKilled += 1;

          //update the monsters killed message
          monstersKilledMessage.text = "Monsters killed: " + monstersKilled;

          //stop the monster
          monster.vy = 0;
          monster.vx = 0;

          //remove the monster image
          monster.visible = false;

          //hide the laser image
          laser.visible = false;
		  
		  //SurfaceCreatureDie.play();

          //find the index of the monster we just killed so we can remove it
          var deadMonsterIndex = monsters.indexOf(monster);
          monsters.splice(deadMonsterIndex, 1);

          //find the index of the laser that hit the monster so we can remove the laser
          var expendedLaserIndex = laserShots.indexOf(laser);
          laserShots.splice(expendedLaserIndex, 1);

      }

    });

    //iterate through all the cave monsters to look for laser hits
    caveMonsters.forEach(function(monster) {

      //check if the laser hit the monster
      if(hitTestRectangle(laser, monster)) {

          //create a shell where the monster had been
          dropShell(monster.x, monster.y);

          //increment the number of monsters killed
          monstersKilled += 1;

          //update the monsters killed message
          monstersKilledMessage.text = "Monsters killed: " + monstersKilled;

          //stop the monster
          monster.vy = 0;
          monster.vx = 0;

          //remove the monster image
          monster.visible = false;

          //hide the laser image
          laser.visible = false;

          //find the index of the monster we just killed so we can remove it
          var deadMonsterIndex = caveMonsters.indexOf(monster);
          caveMonsters.splice(deadMonsterIndex, 1);

          //find the index of the laser that hit the monster so we can remove the laser
          var expendedLaserIndex = laserShots.indexOf(laser);
          laserShots.splice(expendedLaserIndex, 1);

      }

    });

    //check if the laser has left the play area on the x axis
    if(laser.x > (PLAY_ARENA_WIDTH + PLAY_AREA_ORIGIN_X) || laser.x < PLAY_AREA_ORIGIN_X) {
      laser.visible = false;
      //find the index of the laser that reached the game boundary so we can remove it from play
      var missedLaserIndex = laserShots.indexOf(laser);
      laserShots.splice(missedLaserIndex, 1);
    }
    //check if the laser has left the play area on the y axis
    if(laser.y > (PLAY_ARENA_HEIGHT + PLAY_AREA_ORIGIN_Y) || laser.y < PLAY_AREA_ORIGIN_Y) {
      laser.visible = false;
      //find the index of the laser that reached the game boundary so we can remove it from play
      var missedLaserIndex = laserShots.indexOf(laser);
      laserShots.splice(missedLaserIndex, 1);
    }
  });
	
  //energy system 
  
  healthBar.outer.width = (ep * 316 / (healthBar.inner.width))
  
  //Slowly looses energy
  epUseSpeed = .1
  
  if (1 > 0) {
	ep -= epUseSpeed;
	
  } 
  
  //Ship gives player energy
  if (hitTestRectangle(explorer,ship)) {
	ep = ep + rechargeRate;  
  }
  
  //Max health
  if (ep > maxEp){
	ep = maxEp
  }
  
  vegUncollect.forEach(function (veg) {
  
	  //Vetation collectable
	  if (hitTestRectangle(explorer, veg)) {
		  vegCollect = vegCollect + 1;
		  vegCounter.text = vegCollect;
		  veg.visible = false;
		  
		  var vegCollectIndex = vegUncollect.indexOf(veg);
			  vegUncollect.splice(vegCollectIndex, 1);
	  }
    });

  //iterate through all the shells to see if the player picks them up
  shells.forEach(function (shell) {

    //check if the player picked up the shell
    if(hitTestRectangle(explorer, shell)) {

        //incrememnt the counter for shells collected
        shellsCollected += 1;

        //update the shells collected message
        shellsCollectedMessage.text = shellsCollected;

        //hide the shell since its been picked up
        shell.visible = false;

        //remove the shell from the shells array
        var shellCollectedIndex = shells.indexOf(shell);
        shells.splice(shellCollectedIndex,1);

    }

  });
  
  //If the explorer is hit...
  if(explorerHit) {

    //Make the explorer semi-transparent
    explorer.alpha = .5;

    //Reduce the width of the health bar's inner rectangle by 1 pixel
    ep -= damageRate;

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

//create a shell from the death of a monster
function dropShell(x,y) {
    //create a shell where the monster had been
    var shell = new Sprite(resources[SHELL_DROP_IMG].texture);
    shell.width = SHELL_DROP_WIDTH;
    shell.height = SHELL_DROP_HEIGHT;
    shell.x = x;
    shell.y = y;
    shells.push(shell);
    gameScene.addChild(shell);
}

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

  