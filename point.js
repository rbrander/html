// point.js
//

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Point3D(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Point.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

