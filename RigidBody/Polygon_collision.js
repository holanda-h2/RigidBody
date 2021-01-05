
Polygon.prototype.checkCollision = function (otherShape, collisionInfo) {
    var status = false;
    if (otherShape instanceof Circle) {
        status = this.collidedRectCirc(otherShape, collisionInfo);
    } else {
        status = this.collidedRectRect(this, otherShape, collisionInfo);
    }
    return status;
}

function SupportStruct() {
    this.mSupportPoint = null;
    this.mSupportPointDist = 0;
}


Polygon.prototype.findSupportPoint = function (dir, ptOnEdge) {
    var vToEdge;
    var projection;

    var tmpSupport = new SupportStruct();

    tmpSupport.mSupportPointDist = -9999999;
    tmpSupport.mSupportPoint = null;
    for (var i = 0; i < this.vertex.length; i++) {
        vToEdge = this.vertex[i].subtract(ptOnEdge);
        projection = vToEdge.dot(dir);

        if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = this.vertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
    return tmpSupport;
}

Polygon.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {

    var n;
    var supportPoint;

    var bestDistance = 999999;
    var bestIndex = null;

    var hasSupport = true;
    var i = 0;

    while ((hasSupport) && (i < this.faceNormal.length)) {
        n = this.faceNormal[i];

        var dir = n.scale(-1);
        var ptOnEdge = this.vertex[i];

        var tmpSupport = otherRect.findSupportPoint(dir, ptOnEdge);
        hasSupport = (tmpSupport.mSupportPoint !== null);

        if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    if (hasSupport) {
        var bestVec = this.faceNormal[bestIndex].scale(bestDistance);
        collisionInfo.setInfo(bestDistance, this.faceNormal[bestIndex], supportPoint.add(bestVec));
    }
    return hasSupport;
}

Polygon.prototype.collidedRectRect = function (r1, r2, collisionInfo) {

    var status1 = false;
    var status2 = false;

    var collisionInfoR1 = new CollisionInfo();
    var collisionInfoR2 = new CollisionInfo();

    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);

    if (status1) {
        status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
        if (status2) {
            if (collisionInfoR1.depth < collisionInfoR2.depth) {
                var depthVec = collisionInfoR1.normal.scale(collisionInfoR1.depth);
                collisionInfo.setInfo(collisionInfoR1.depth, collisionInfoR1.normal, collisionInfoR1.start.subtract(depthVec));
            } else {
                collisionInfo.setInfo(collisionInfoR2.depth, collisionInfoR2.normal.scale(-1), collisionInfoR2.start);
            }
        }
    }
    return status1 && status2;
}

Polygon.prototype.collidedRectCirc = function (otherCir, collisionInfo) {

    var abc = Math.random();
    var inside = true;
    var bestDistance = -99999;
    var nearestEdge = 0;
    var i, v;
    var circ2Pos, projection;

    for (i = 0; i < this.vertex.length; i++) {
        circ2Pos = otherCir.center;
        v = circ2Pos.subtract(this.vertex[i]);
        projection = v.dot(this.faceNormal[i]);

        if (projection > otherCir.radius) {
            bestDistance = projection;
            nearestEdge = i;
            inside = false;
            break;
        }
        if (projection > bestDistance) {
            bestDistance = projection;
            nearestEdge = i;
        }
    }
    var dis, normal, radiusVec;
    if (!inside) {
        var v1 = circ2Pos.subtract(this.vertex[nearestEdge]);
        var v2 = this.vertex[(nearestEdge + 1) % this.vertex.length].subtract(this.vertex[nearestEdge]);

        var dot = v1.dot(v2);

        if (dot < 0) {
            dis = v1.length();
            if (dis > otherCir.radius) {
                return false;
            }

            normal = v1.normalize();
            radiusVec = normal.scale(-otherCir.radius);
            collisionInfo.setInfo(otherCir.radius - dis, normal, circ2Pos.add(radiusVec));
        } else {
            v1 = circ2Pos.subtract(this.vertex[(nearestEdge + 1) % this.vertex.length]);
            v2 = v2.scale(-1);
            dot = v1.dot(v2);
            if (dot < 0) {
                dis = v1.length();
                if (dis > otherCir.radius) {
                    return false;
                }
                normal = v1.normalize();
                radiusVec = normal.scale(-otherCir.radius);
                collisionInfo.setInfo(otherCir.radius - dis, normal, circ2Pos.add(radiusVec));
            } else {
                if (bestDistance < otherCir.radius) {
                    radiusVec = this.faceNormal[nearestEdge].scale(otherCir.radius);
                    collisionInfo.setInfo(otherCir.radius - bestDistance, this.faceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
                } else {
                    return false;
                }
            }
        }
    } else {
        radiusVec = this.faceNormal[nearestEdge].scale(otherCir.radius);
        collisionInfo.setInfo(otherCir.radius - bestDistance, this.faceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
    }
    return true;
}