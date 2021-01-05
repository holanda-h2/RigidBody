var Matrix2D = function ( ){	
	this.col1 = new Vector2D(0,0);
	this.col2 = new Vector2D(0,0);
}

Matrix2D.prototype.transpose = function (){
	var output = new Matrix2D ();
	output.col1 = new Vector2D( this.col1.x, this.col2.x );
	output.col2 = new Vector2D( this.col1.y, this.col2.y );
	return output;
}

Matrix2D.prototype.set = function ( vec1, vec2 ){
	this.col1 = vec1;
	this.col2 = vec2;
}

Matrix2D.prototype.setAngle = function ( angle ){
	var cos = Math.cos( angle );
	var sin = Math.sin( angle );
		
	this.col1 = new Vector2D(  cos, sin );
	this.col2 = new Vector2D( -sin, cos );
	return this;
}

Matrix2D.prototype.multiply = function ( x ){
	var output;

	if ( x instanceof Vector2D ) {
		output = new Vector2D(
			this.col1.x * x.x + this.col2.x * x.y,
			this.col1.y * x.x + this.col2.y * x.y
		);
	} else if ( x instanceof Matrix2D ){
		output = new Matrix2D ();
		output.col1 = this.multiply( x.col1 );
		output.col2 = this.multiply( x.col2 );
	}
	return output;
}

Matrix2D.prototype.add = function ( x ){

		output = new Matrix2D ();
		output.col1 = this.col1.add( x.col1 );
		output.col2 = this.col2.add( x.col2 );
	
	return output;
}

Matrix2D.prototype.abs = function (){
	var output = new Matrix2D ();
	output.col1 = this.col1.abs();
	output.col2 = this.col2.abs();

	return output;
}

Matrix2D.prototype.invert = function () {
	var a = this.col1.x, b = this.col2.x, c = this.col1.y, d = this.col2.y;
	var B = new Matrix2D();
	var det = a * d - b * c;
	if (det != 0.0) {
		det = 1.0 / det;
		B.col1.x =  det * d;	B.col2.x = -det * b;
		B.col1.y = -det * c;	B.col2.y =  det * a;
	}
	return B;
}
