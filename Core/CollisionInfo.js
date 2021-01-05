function CollisionInfo() {
    this.depth = 0;               
    this.normal = new Vector2D(0, 0);  
    this.start = new Vector2D(0, 0);  
    this.end = new Vector2D(0, 0);
}

CollisionInfo.prototype.setInfo = function (d, n, s) {
    this.depth = d;
    this.normal = n;
    this.start = s;
    this.end = s.add(n.scale(d));
}

CollisionInfo.prototype.changeDir = function () { 
    this.normal = this.normal.scale(-1);
    var n = this.start;
    this.start = this.end;
    this.end = n;
}