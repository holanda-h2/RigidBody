
function Triangle (center, radius, mass, friction, restitution) {
    Polygon.call(this, center,radius, radius, mass, friction, restitution);

    this.updateTriangle(radius);
}

Triangle.prototype = Object.create(Polygon.prototype);
Triangle.parent = Polygon.prototype;
Triangle.prototype.constructor = Polygon;
