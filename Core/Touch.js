
Game.touch = {x: 0, y: 0, isMoving: false};

Game.canvas.ontouchmove = function (e) {
    if (Game.touch.isMoving) {            
        var position = Game.convertToCanvas(
                         e.changedTouches[0].pageX - Game.canvas.offsetLeft,
                         e.changedTouches[0].pageY - Game.canvas.offsetTop
                      );

        Game.touch.x = position.x;
        Game.touch.y = position.y;

        Game.mouse.x = Game.touch.x;
        Game.mouse.y = Game.touch.y;

    }
}

Game.canvas.ontouchstart = function (e) {
    Game.touch.isMoving = true;

    Game.canvas.ontouchmove (e);

    if (Game.onTouchStart) {
        Game.onTouchStart(); // CALLBACK
    }
}

Game.canvas.ontouchend = function (e) {
    Game.touch.isMoving = false;

    if (Game.onTouchEnd) {
        Game.onTouchEnd(); // CALLBACK
    }
}

Game.convertToCanvas = function (xTouch, yTouch) {
    return {
        x: Game.canvas.width * xTouch / Game.canvas.offsetWidth,
        y: Game.canvas.height * yTouch / Game.canvas.offsetHeight
    }
}

Game.updateMouseTouch = function () {
    Game.mouse.x = Game.touch.x;
    Game.mouse.y = Game.touch.y;
}
