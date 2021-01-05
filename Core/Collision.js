
function Collision() {
    this.mPositionalCorrectionFlag = true;
    this.mRelaxationCount = 12;
    this.mPosCorrectionRate = 0.80;
}

Collision.prototype.positionalCorrection = function (s1, s2, collisionInfo) {
    var s1InvMass = s1.invMass;
    var s2InvMass = s2.invMass;

    var num = collisionInfo.depth / (s1InvMass + s2InvMass) * this.mPosCorrectionRate;
    var correctionAmount = collisionInfo.normal.scale(num);

    s1.addPosition(correctionAmount.scale(-s1InvMass));
    s2.addPosition(correctionAmount.scale(s2InvMass));

}

Collision.prototype.resolveCollision = function (s1, s2, collisionInfo) {

    if ((s1.invMass === 0) && (s2.invMass === 0)) {
        return;
    }

    if (this.mPositionalCorrectionFlag) {
        this.positionalCorrection(s1, s2, collisionInfo);
    }

    var n = collisionInfo.normal;

    var start = collisionInfo.start.scale(s2.invMass / (s1.invMass + s2.invMass));
    var end = collisionInfo.end.scale(s1.invMass / (s1.invMass + s2.invMass));
    var p = start.add(end);

    var r1 = p.subtract(s1.center);
    var r2 = p.subtract(s2.center);

    var v1 = s1.velocity.add(new Vector2D(-1 * s1.angularVelocity * r1.y, s1.angularVelocity * r1.x));
    var v2 = s2.velocity.add(new Vector2D(-1 * s2.angularVelocity * r2.y, s2.angularVelocity * r2.x));
    var relativeVelocity = v2.subtract(v1);

    var rVelocityInNormal = relativeVelocity.dot(n);

    if (rVelocityInNormal > 0) {
        return;
    }

    var newRestituion = Math.min(s1.restitution, s2.restitution);
    var newFriction = Math.min(s1.friction, s2.friction);

    var R1crossN = r1.cross(n);
    var R2crossN = r2.cross(n);

    var jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (s1.invMass + s2.invMass +
        R1crossN * R1crossN * s1.inertia +
        R2crossN * R2crossN * s2.inertia);

    var impulse = n.scale(jN);

    s1.velocity = s1.velocity.subtract(impulse.scale(s1.invMass));
    s2.velocity = s2.velocity.add(impulse.scale(s2.invMass));

    s1.angularVelocity -= R1crossN * jN * s1.inertia;
    s2.angularVelocity += R2crossN * jN * s2.inertia;

    var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));
    tangent = tangent.normalize().scale(-1);

    var R1crossT = r1.cross(tangent);
    var R2crossT = r2.cross(tangent);

    var jT = -(1 + newRestituion) * relativeVelocity.dot(tangent) * newFriction;
    jT = jT / (s1.invMass + s2.invMass + R1crossT * R1crossT * s1.inertia + R2crossT * R2crossT * s2.inertia);

    if (jT > jN) {
        jT = jN;
    }

    impulse = tangent.scale(jT);

    s1.velocity = s1.velocity.subtract(impulse.scale(s1.invMass));
    s2.velocity = s2.velocity.add(impulse.scale(s2.invMass));
    s1.angularVelocity -= R1crossT * jT * s1.inertia;
    s2.angularVelocity += R2crossT * jT * s2.inertia;
}


Collision.prototype.process = function () {
    var i, j, k;
    var collisionInfo = new CollisionInfo();
    for (k = 0; k < this.mRelaxationCount; k++) {
        for (i = 0; i < Game.world.bodies.length; i++) {
            for (j = i + 1; j < Game.world.bodies.length; j++) {
                if (Game.world.bodies[i].checkBound(Game.world.bodies[j])) {
                    if (Game.world.bodies[i].checkCollision(Game.world.bodies[j], collisionInfo)) {
                        if (collisionInfo.normal.dot(Game.world.bodies[j].center.subtract(Game.world.bodies[i].center)) < 0) {
                            collisionInfo.changeDir();
                        }
                        this.resolveCollision(Game.world.bodies[i], Game.world.bodies[j], collisionInfo);
                    }
                }
            }
        }
    }
}


