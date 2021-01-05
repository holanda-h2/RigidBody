
function Body(center, mass = 1, friction = 0.8, restitution = 0.2) {
    Particle.call(this, mass);

    this.position = center; // The center of the object 

    this.angle = 0;      // The rotation angle of the rigid shape has a default value of 0
    this.angularVelocity = 0;
    this.angularAcceleration = 0;


    this.inertia = 0;
    this.invInertia = 0;

    this.friction = friction;
    this.restitution = restitution;

    if (this.mass !== 0) {
        this.acceleration = Game.gravity;
    }

    this.boundRadius = 0; // This is the radius of the bounding circle for the rigid shape.

    this.isDown = false;
}

Body.prototype = Object.create(Particle.prototype);
Body.parent = Particle.prototype;
Body.prototype.constructor = Body;


Object.defineProperty(Body.prototype, 'center', {
    get: function () { return this.position; },
    set: function (v) { this.position = v; }
});

Object.defineProperty(Body.prototype, 'ra', {
    get: function () { return this.angle; },
    set: function (v) { this.angle = v; }
});


Body.prototype.updateMass = function (delta) {
    this.mass += delta;
    if (this.mass <= 0) {
        this.invMass = 0;
        this.velocity = new Vector2D(0, 0);
        this.acceleration = new Vector2D(0, 0);
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.invMass = 0;
        this.inertia = 0
        this.invInertia = 0
    } else {
        this.invMass = 1 / this.mass;
        this.acceleration = Game.gravity;
    }

    this.updateAcceleration();
    this.updateInertia();
};

Body.prototype.updateInertia = function () {
    if (this.inertia > 0) {
        this.invInertia = 1 / this.inertia;
    } else {
        this.invInertia = 0;
    }
};

Body.prototype.update = function () {
    var dt = Game.world.dt;
    this.updateVelocity();
    this.updatePosition();

    this.angularVelocity += this.angularAcceleration * dt;
    this.rotate(this.angularVelocity * dt);

    var width = Game.width;
    var height = Game.height;
    if (this.center.x + this.boundRadius < 0 || this.center.x - this.boundRadius > width ||
        this.center.y + this.boundRadius < 0 || this.center.y - this.boundRadius > height) {
        this.isDeleted = true;
    }
};

Body.prototype.updateAcceleration = function () {
    this.acceleration = Game.gravity.scale(this.invMass);
};

Body.prototype.updateVelocity = function () {
    var dt = Game.world.dt;
    this.velocity = this.velocity.add(this.acceleration.scale(dt)); //v += a*t
};

Body.prototype.updatePosition = function () {
    var dt = Game.world.dt;
    var v = this.velocity.scale(dt);
    this.center = this.center.add(v); //s += v*t
};

Body.prototype.addPosition = function (v) {
    this.center = this.center.add(v);
};

Body.prototype.draw = function (context) {
};

Body.prototype.rotate = function (angle) {
    this.angle += angle;
};

Body.prototype.checkBound = function (otherShape) {
    var vFrom1to2 = otherShape.center.subtract(this.center);
    var rSum = this.boundRadius + otherShape.boundRadius;
    var dist = vFrom1to2.length();
    return (dist <= rSum);
};

Body.prototype.checkCollision = function (otherShape, collisionInfo) {
    return false;
};

Body.prototype.collidedWithPoint = function (point) {
    var vFrom1to2 = this.center.subtract(point);
    var rSum = this.boundRadius;
    var dist = vFrom1to2.length();
    if (dist > rSum) {
        return false;
    }
    return true;
};
