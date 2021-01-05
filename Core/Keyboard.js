
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ESPACE = 32;
var KEY_ENTER = 13;

Game.keyboard = {keysPressed:[], keysFired:[]};
Game.onKeyFired = []; // CALLBACK

Game.keyboard.pressed = function(key) {
   return Game.keyboard.keysPressed[key];
}

document.onkeydown = function(event) {
   var key = event.keyCode;  
   Game.keyboard.keysPressed[key] = true;

   if (Game.onKeyFired[key] && !Game.keyboard.keysFired[key]) {
       Game.keyboard.keysFired[key] = true;
       Game.onKeyFired[key]();
   }
}

document.onkeyup = function(event) {
   var key = event.keyCode;
   Game.keyboard.keysPressed[key] = false;
   Game.keyboard.keysFired[key] = false;
}

