
function Rectangle (center, width, height, mass, friction, restitution) {
    Polygon.call(this, center,width, height, mass, friction, restitution);
}

Rectangle.prototype = Object.create(Polygon.prototype);
Rectangle.parent = Polygon.prototype;
Rectangle.prototype.constructor = Polygon;

Rectangle.prototype.collidedWithPoint = function (point) {
    return point.x > this.x && point.x < (this.x + this.width) &&
           point.y > this.y && point.y < (this.y + this.height);
}
