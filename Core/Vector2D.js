var Vector2D = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2D.prototype.lengthSq = function () {
    return (this.x * this.x + this.y * this.y);
};

Vector2D.prototype.add = function (vec) {
    return new Vector2D(vec.x + this.x, vec.y + this.y);
};

Vector2D.prototype.subtract = function (vec) {
    return new Vector2D(this.x - vec.x, this.y - vec.y);
};

Vector2D.prototype.scale = function (n) {  
    return new Vector2D(this.x * n, this.y * n);
};

Vector2D.prototype.dot = function (vec) {
    return (this.x * vec.x + this.y * vec.y);
};

Vector2D.prototype.cross = function (vec) {
    return (this.x * vec.y - this.y * vec.x);
};

Vector2D.prototype.rotate = function (center, angle) {
    var r = [];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var x = this.x - center.x;
    var y = this.y - center.y;

    r[0] = x * cos - y * sin;
    r[1] = x * sin + y * cos;

    r[0] += center.x;
    r[1] += center.y;

    return new Vector2D(r[0], r[1]);
};

Vector2D.prototype.fromGlobalLocal = function (global, angle) {
    var r = [];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var x = this.x - global.x;
    var y = this.y - global.y;

    r[0] = x * cos + y * sin;
    r[1] = - x * sin + y * cos;

    return new Vector2D(r[0], r[1]);
};

Vector2D.prototype.fromLocalGlobal = function (global, angle) {
    var r = [];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var x = this.x ;
    var y = this.y ;

    r[0] = x * cos - y * sin;
    r[1] = x * sin + y * cos;

    r[0] += global.x;
    r[1] += global.y;

    return new Vector2D(r[0], r[1]);
}

Vector2D.prototype.normalize = function () {

    var len = this.length();
    if (len > 0) {
        len = 1 / len;
    }
    return new Vector2D(this.x * len, this.y * len);
}

Vector2D.prototype.distance = function (vec) {
    var x = this.x - vec.x;
    var y = this.y - vec.y;
    return Math.sqrt(x * x + y * y);
}

Vector2D.prototype.unit = function() {
    var length = this.length(); 
    if (length > 0) {
        return new Vector2D(this.x/length,this.y/length);
    }else{
        return new Vector2D(0,0);
    }
}

Vector2D.prototype.projection = function(vec) {
    var length = this.length();
    var lengthVec = vec.length();
    var proj;
    if( (length == 0) || ( lengthVec == 0) ){
        proj = 0;
    }else {
        proj = (this.x*vec.x + this.y*vec.y)/lengthVec;
    }
    return proj;
}

Vector2D.prototype.project = function(vec) {
    return vec.para(this.projection(vec));
}

Vector2D.prototype.para = function(u,positive){
    if (typeof(positive)==='undefined') positive = true;
    var length = this.length();
    var vec = new Vector2D(this.x, this.y);
    if (positive){
        vec.scaleBy(u/length);
    }else{
        vec.scaleBy(-u/length);				
    }
    return vec;
}

Vector2D.prototype.addScaled = function(vec,k) {
    return new Vector2D(this.x + k*vec.x, this.y + k*vec.y);
}

Vector2D.prototype.scaleBy = function(k) {
    this.x *= k;
    this.y *= k;
}

Vector2D.crossSV = function (scale, vec) { 
    return new Vector2D( -scale * vec.y, scale * vec.x);
}
