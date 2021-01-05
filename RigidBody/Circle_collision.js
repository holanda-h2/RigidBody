
Circle.prototype.checkCollision = function (otherShape, collisionInfo) {
    var status = false;

    if (otherShape instanceof Circle) {  
        status = this.collidedCircCirc(this, otherShape, collisionInfo);
    } else {
        status = otherShape.collidedRectCirc(this, collisionInfo);
    }
    return status;
}

Circle.prototype.collidedCircCirc = function (c1, c2, collisionInfo) {
    var vFrom1to2 = c2.center.subtract(c1.center);
    var rSum = c1.radius + c2.radius;
    var dist = vFrom1to2.length();
    if (dist > Math.sqrt(rSum * rSum)) {
        return false;
    }
    if (dist !== 0) {
        var normalFrom2to1 = vFrom1to2.scale(-1).normalize();
        var radiusC2 = normalFrom2to1.scale(c2.radius);
        collisionInfo.setInfo(rSum - dist, vFrom1to2.normalize(), c2.center.add(radiusC2));
    } else {
        if (c1.radius > c2.radius) {
            collisionInfo.setInfo(rSum, new Vector2D(0, -1), c1.center.add(new Vector2D(0, c1.radius)));
        } else {
            collisionInfo.setInfo(rSum, new Vector2D(0, -1), c2.center.add(new Vector2D(0, c2.radius)));
        }
    }
    return true;
}

