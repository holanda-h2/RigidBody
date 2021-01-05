
function Polygon(center, width, height, mass, friction, restitution) {
    Body.call(this, center, mass, friction, restitution);

    this.width = width;
    this.height = height;

    this.vertex = [];        
    this.faceNormal = [];     

    this.updateVertex();
    this.updateFaceNormal();

    this.boundRadius = Math.sqrt(width * width + height * height) / 2;

    this.updateInertia();
}

Polygon.prototype = Object.create(Body.prototype);
Polygon.parent = Body.prototype;
Polygon.prototype.constructor = Polygon;

Polygon.prototype.updateVertex = function () {
    //0--TopLeft; 1--TopRight; 2--BottomRight; 3--BottomLeft
    this.vertex[0] = new Vector2D(this.center.x - this.width / 2, this.center.y - this.height / 2);
    this.vertex[1] = new Vector2D(this.center.x + this.width / 2, this.center.y - this.height / 2);
    this.vertex[2] = new Vector2D(this.center.x + this.width / 2, this.center.y + this.height / 2);
    this.vertex[3] = new Vector2D(this.center.x - this.width / 2, this.center.y + this.height / 2);
}

Polygon.prototype.updateVertexTriangle = function () {
    var l = this.radius * 3 / Math.sqrt(3);
    var d = l / 2;
    var h = l * Math.sqrt(3) / 2;
    var a = h - this.radius;

    //0--TopLeft; 1--TopRight; 2--BottomRight; 3--BottomLeft
    this.vertex[1] = new Vector2D(this.center.x, this.center.y - this.radius);
    this.vertex[0] = new Vector2D(this.center.x - d, this.center.y + a);
    this.vertex[2] = new Vector2D(this.center.x + d, this.center.y + a);
}

Polygon.prototype.updateTriangle = function (radius) {
    this.vertex = [];          
    this.faceNormal = [];    
    this.radius = radius;
    this.boundRadius = radius;

    this.updateVertexTriangle();
    this.updateFaceNormal();

    this.width = radius;
    this.height = radius;

    this.updateInertia();
}

Polygon.prototype.updateSides = function (radius, sides, startAngle) {
    var points = [],
        angle = startAngle || 0;

    this.radius = radius;
    this.boundRadius = this.radius;

    for (var i = 0; i < sides; ++i) {
        points.push(new Vector2D(this.center.x + radius * Math.sin(angle),
            this.center.y - radius * Math.cos(angle)));
        angle += 2 * Math.PI / sides;
    }

    this.sides = sides;

    this.updateVertices(points);

    this.updateInertia();
}

Polygon.prototype.updateVertices = function (verts) {
    this.vertex = [];
    this.faceNormal = [];

    var vertexCount = verts.length;

    var rightMost = 0;
    var highestXCoord = verts[0].x;
    for (var i = 1; i < verts.length; ++i) {
        var x = verts[i].x;

        if (x > highestXCoord) {
            highestXCoord = x;
            rightMost = i;
        } else if (x == highestXCoord) { 
            if (verts[i].y < verts[rightMost].y) {
                rightMost = i;
            }
        }
    }

    var hull = [];
    var outCount = 0;
    var indexHull = rightMost;

    for (; ;) {
        hull[outCount] = indexHull;

        var nextHullIndex = 0;
        for (var i = 1; i < verts.length; ++i) {
            if (nextHullIndex == indexHull) {
                nextHullIndex = i;
                continue;
            }

            var e1 = verts[nextHullIndex].subtract(verts[hull[outCount]]);
            var e2 = verts[i].subtract(verts[hull[outCount]]);

            var c = e1.cross(e2);
            if (c < 0.0) {
                nextHullIndex = i;
            }

            if (c == 0.0 && e2.lengthSq() > e1.lengthSq()) {
                nextHullIndex = i;
            }
        }

        ++outCount;
        indexHull = nextHullIndex;

        if (nextHullIndex == rightMost) {
            vertexCount = outCount;
            break;
        }
    }

    for (var i = 0; i < vertexCount; ++i) {
        this.vertex[i] = new Vector2D(verts[hull[i]].x, verts[hull[i]].y);
    }

    this.updateFaceNormal();
}

Polygon.prototype.updateFaceNormal = function () {
    for (var i = 0; i < this.vertex.length; i++) {
        var i1 = i;
        var i2 = i + 1;
        if (i2 >= this.vertex.length) {
            i2 = 0;
        }
        var v = this.vertex[i1].subtract(this.vertex[i2]);
        this.faceNormal[i1] = new Vector2D(0, 0);
        this.faceNormal[i1].x = -v.y;
        this.faceNormal[i1].y = v.x;
        this.faceNormal[i1] = this.faceNormal[i1].normalize();
    }
}

Polygon.prototype.rotate = function (angle) {
    this.angle += angle;
    var i;
    for (i = 0; i < this.vertex.length; i++) {
        this.vertex[i] = this.vertex[i].rotate(this.center, angle);
    }
    this.updateFaceNormal();
}

Polygon.prototype.updatePosition = function () {
    Polygon.parent.updatePosition.call(this);

    var dt = Game.world.dt;
    var v = this.velocity.scale(dt);

    for (var i = 0; i < this.vertex.length; i++) {
        this.vertex[i] = this.vertex[i].add(v);
    }
}

Polygon.prototype.addPosition = function (v) {
    Polygon.parent.addPosition.call(this, v);

    for (var i = 0; i < this.vertex.length; i++) {
        this.vertex[i] = this.vertex[i].add(v);
    }
}

Polygon.prototype.updateInertia = function () {
    if (this.invMass === 0) {
        this.inertia = 0;
        this.invInertia = 0;
    } else {
        this.inertia = (this.mass) * (this.width * this.width + this.height * this.height) / 12;
        this.inertia = 1 / this.inertia;
        this.invInertia = 1 / this.inertia;

    }
}

Polygon.prototype.draw = function (context) {
    var ctx = context;

    var v = new Array();
    for (var i = 0; i < this.vertex.length; i++) {
        v[i] = this.vertex[i];
    }
    if (this.vertex.length == 4) {
        ctx.strokeStyle = 'blue';
    } else if (this.vertex.length == 3) {
        ctx.strokeStyle = 'black';
    } else {
        ctx.strokeStyle = 'red';
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(v[0].x, v[0].y);
    for (var i = 1; i < v.length; i++) {
        ctx.lineTo(v[i].x, v[i].y);
    }
    ctx.lineTo(v[0].x, v[0].y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    if (this.sides) {
        context.beginPath();

        context.moveTo(this.center.x, this.center.y);
        context.lineTo(this.center.x, this.center.y);

        context.closePath();
        context.stroke();
    }

}