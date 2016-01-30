var assetsToLoader = ["desyrel.fnt"];
 
// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);
 
// use callback
loader.onComplete = onAssetsLoaded;
 
//begin load
loader.load();
 
function onAssetsLoaded()
{
     var bitmapFontText = new PIXI.BitmapText("bitmap fonts are\n now supported!", {font: "35px Desyrel", align: "right"});
 
     bitmapFontText.position.x = 620 - bitmapFontText.width - 20;
     bitmapFontText.position.y = 20;
 
     stage.addChild(bitmapFontText);
}