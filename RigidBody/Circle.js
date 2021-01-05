
function Circle(center, radius, mass, friction, restitution) {
    Body.call(this, center, mass, friction, restitution);

    this.radius = radius;
    this.startPoint = new Vector2D(center.x, center.y - radius); 
    this.boundRadius = radius;

    this.updateInertia();
}

Circle.prototype = Object.create(Body.prototype);
Circle.parent = Body.prototype;
Circle.prototype.constructor = Circle;

Circle.prototype.updatePosition = function () {
    Circle.parent.updatePosition.call(this);

    var dt = Game.world.dt;
    var v = this.velocity.scale(dt);
    this.startPoint = this.startPoint.add(v);
}

Circle.prototype.addPosition = function (v) {
    Circle.parent.addPosition.call(this, v);
    this.startPoint = this.startPoint.add(v);
}

Circle.prototype.rotate = function (angle) {
    this.angle += angle;
    this.startPoint = this.startPoint.rotate(this.center, angle);
}

Circle.prototype.updateInertia = function () {
    if (this.invMass === 0) {
        this.inertia = 0;
    } else {
        this.inertia = (this.mass) * (this.radius * this.radius) / 12;
    }
}

Circle.prototype.draw = function (context) {
    context.strokeStyle = 'green';
    context.beginPath();

    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true);

    context.moveTo(this.startPoint.x, this.startPoint.y);
    context.lineTo(this.center.x, this.center.y);

    context.closePath();
    context.stroke();

    if (this.isDown) {
        context.beginPath();
        context.moveTo(this.center.x, this.center.y);
        context.lineTo(Game.mouse.x, Game.mouse.y);
        context.stroke();
        context.closePath();
    }
}