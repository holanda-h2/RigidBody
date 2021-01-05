
Game.onMouseDown = function () {
    Game.c1 = new Circle(new Vector2D(Game.mouse.x, Game.mouse.y),
        Math.random() * 20 + 10, Math.random() * 30, Math.random() * 1, Math.random() * 1);
    Game.c1.isDown = true;
    Game.world.addBody(Game.c1);
}

Game.onMouseUp = function () {
    Game.c1.isDown = false;
    Game.c1.velocity.y = (Game.c1.center.y - Game.mouse.y) * 5;
    Game.c1.velocity.x = (Game.c1.center.x - Game.mouse.x) * 5;
}

Game.init = function () {

    var r1 = new Rectangle(new Vector2D(500, 200), 400, 20, 0, 0.3, 0);
    r1.rotate(2.8);
    var r2 = new Rectangle(new Vector2D(200, 400), 400, 20, 0, 1, 0.5);
    var r3 = new Rectangle(new Vector2D(100, 200), 200, 20, 0);
    var r4 = new Rectangle(new Vector2D(10, 360), 20, 100, 0, 0, 1);

    Game.world.addBody(r1);
    Game.world.addBody(r2);
    Game.world.addBody(r3);
    Game.world.addBody(r4);

    var t1 = new Rectangle(new Vector2D(100, 100), 30, 30, 0, 0, 1);
    Game.world.addBody(t1);

    var t2 = new Polygon(new Vector2D(490, 130), 60, 60, 0.5, 0, 1);
    Game.world.addBody(t2);

    var vs = [];
    vs[3] = new Vector2D(460, 100);
    vs[4] = new Vector2D(500, 100);
    vs[0] = new Vector2D(520, 140);
    vs[1] = new Vector2D(480, 170);
    vs[2] = new Vector2D(460, 160);
    t2.updateVertices(vs);

    var r5 = new Rectangle(new Vector2D(600, 300), 40, 40, 0, 0.3, 1);
    Game.world.addBody(r5);

    var r6 = new Rectangle(new Vector2D(600, 400), 40, 40, 1, 0.3, 1);
    Game.world.addBody(r6);

    var t31 = new Polygon(new Vector2D(400, 110), 60, 60, 1, 0, 1);
    Game.world.addBody(t31);
    t31.updateSides(30, 8, 0);


    for (var i = 0; i < 5; i++) {
        var r1 = new Rectangle(new Vector2D(Math.random() * Game.width, Math.random() * Game.height / 2),
            Math.random() * 50 + 10, Math.random() * 50 + 10, Math.random() * 30, Math.random() * 1, Math.random() * 1);
        r1.velocity = new Vector2D(Math.random() * 60 - 30, Math.random() * 60 - 30);
        Game.world.addBody(r1);

        var r1 = new Circle(new Vector2D(Math.random() * Game.width, Math.random() * Game.height / 2),
            Math.random() * 20 + 10, Math.random() * 30, Math.random() * 1, Math.random() * 1);
        r1.velocity = new Vector2D(Math.random() * 60 - 30, Math.random() * 60 - 30);
        Game.world.addBody(r1);

        var t1 = new Triangle(new Vector2D(Math.random() * Game.width, Math.random() * Game.height / 2),
            Math.random() * 30 + 10, Math.random() * 30, Math.random() * 1, Math.random() * 1);
        Game.world.addBody(t1);

        t1.velocity = new Vector2D(Math.random() * 60 - 30, Math.random() * 60 - 30);
    }

}

Game.configuration = function () {
    Game.gravity = new Vector2D(0, 20);
    Game.world = new World(Game.context);
}

Game.start = function () {
    Game.world.turnOn();
}

Game.stop = function () {
    Game.world.turnOff();
}

window.onload = function () {
    Game.configuration();
    Game.init();
    Game.start();
  //  Game.stop();
}
