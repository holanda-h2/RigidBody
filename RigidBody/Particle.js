function Particle(mass = 1) {
    this.position = new Vector2D(0, 0);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);
    this.force = new Vector2D(0, 0);

    this.isDeleted = false;

    this.mass = mass;
    this.invMass = 0;

    this.updateInvMass();
}

Object.defineProperty(Particle.prototype, 'x', {
    get: function () {
        return this.position.x;
    },
    set: function (v) {
        this.position.x = v;
    }
})

Object.defineProperty(Particle.prototype, 'y', {
    get: function () {
        return this.position.y;
    },
    set: function (v) {
        this.position.y = v;
    }
})


Particle.prototype.updateInvMass = function () {
    this.invMass = 0;
    if (this.mass !== 0) {
        if (this.mass == 1) {
            this.invMass = 1;
        } else {
            this.invMass = 1 / this.mass;
        }
    }
}

Particle.prototype.updateForce = function () {
}


Particle.prototype.updateAcceleration = function () {
    this.acceleration = this.force.scale(this.invMass); // a = f/m
}

Particle.prototype.updateVelocity = function () {
    var dt = Game.world.dt;
    this.velocity = this.velocity.add(this.acceleration.scale(dt)); //v += a*t
}

Particle.prototype.updatePosition = function () {
    var dt = Game.world.dt;
    this.position = this.position.add(this.velocity.scale(dt)); //s += v*t

    if (this.checkEdges()) {
        this.isDeleted = true;
    }
}

Particle.prototype.update = function () {
    this.updatePosition();
    this.updateForce();
    this.updateAcceleration();
    this.updateVelocity();
}

Particle.prototype.checkEdges = function () {
    var width = Game.width;
    var height = Game.height;
    return (this.position.x + this.radius < 0 ||
        this.position.x - this.radius > width ||
        this.position.y + this.radius < 0 ||
        this.position.y - this.radius > height)
}