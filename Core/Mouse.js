
Game.mouse = {x: 0, y: 0, isDown: false};

Game.canvas.onmousemove = function (e) {
    Game.mouse.x = e.pageX - Game.canvas.offsetLeft;
    Game.mouse.y = e.pageY - Game.canvas.offsetTop;
}

document.onmousedown = function(e) {
    if (e.which == 1) {
        Game.canvas.onmousemove (e);
        Game.mouse.isDown = true;

        if (Game.onMouseDown) {
            Game.onMouseDown(); // CALLBACK
        }
        
    }
}

document.onmouseup = function(e) { 
    if (e.which == 1) {
        Game.mouse.isDown = false;

        if (Game.onMouseUp) {
            Game.onMouseUp(); // CALLBACK
        }
    }
}