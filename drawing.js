// drawing.js
//

var _context = null;
function getContext()
{
	if (_context == null) {
		var canvas = $('#canvas')[0];
		_context = canvas.getContext('2d');
	}
    return _context;
}

var _pixelWidth = null;
function getPixelWidth()
{
    // Each block looks like this:
    // Xb
    // bb  
    // Where X is the pixel and b is just a blank spot
    
    if (_pixelWidth == null)
		_pixelWidth = Math.floor((CANVAS_WIDTH - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
    // leaving one block around the outside as a board
    return _pixelWidth;
}

var _pixelHeight = null;
function getPixelHeight()
{
	// leaving one block around the outside as a board
    if (_pixelHeight == null)
		_pixelHeight = Math.floor((CANVAS_HEIGHT - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
    return _pixelHeight;
}

var _imageData = null;
function clearBoard()
{
    var ctx = getContext();
	if (_imageData == null) {
		ctx.fillStyle = colorBackground;
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		// draw all the pixels off
		for (var y = 0; y < getPixelHeight(); y++)
			for (var x = 0; x < getPixelWidth(); x++)
				drawPixel(x, y, colorPixelOff);
		
		_imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	} else
		ctx.putImageData(_imageData, 0, 0);
}

function drawPixel(x, y, color)
{
	if (x < 0 || y < 0 || x > getPixelWidth() || y > getPixelHeight())
		return;
	
	x = Math.round(x);
	y = Math.round(y);
	
    var ctx = getContext();
    ctx.fillStyle = color;
    ctx.fillRect(BLOCK_SIZE + (x * BLOCK_SIZE), BLOCK_SIZE + (y * BLOCK_SIZE), BLOCK_SIZE / 2, BLOCK_SIZE / 2);
}

function drawBox(x1, y1, x2, y2)
{
    for (var x = x1; x < x2; x++) {
        drawPixel(x, y1, colorPixelOn);
        drawPixel(x, y2, colorPixelOn);
    }
    for (var y = y1; y < y2; y++) {
        drawPixel(x1, y, colorPixelOn);
        drawPixel(x2, y, colorPixelOn);
    }
}

function drawLineBox(x1, y1, x2, y2)
{
	drawLine(x1, y1, x2, y1);	// top
	drawLine(x2, y1, x2, y2);	// right
	drawLine(x2, y2, x1, y2);	// bottom
	drawLine(x1, y2, x1, y1);	// left
}

// Function will return -1, 0 or +1 which matches the sign of the value passed in
// for example, -24 will return -1; 39 will return +1 and 0 will return 0.
function sign(a) { return (a < 0 ? -1 : (a > 0 ? +1 : 0)); }

function drawLine(x1, y1, x2, y2) { drawLineColour(x1, y1, x2, y2, colorPixelOn); }
function drawLineColour(x1, y1, x2, y2, colour)
{
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);
	var sx = (x1 < x2 ? 1 : -1);
	var sy = (y1 < y2 ? 1 : -1);
	var err = dx-dy;
	while (true) {
		drawPixel(x1, y1, colour);
		if (x1 == x2 && y1 == y2)
			break;
		var e2 = 2 * err;
		if (e2 > -dy) {
			err = err - dy;
			x1 += sx;
		}
		if (e2 < dx) {
			err = err + dx;
			y1 += sy;
		}
	}
}

function drawEdgeBox(distanceFromEdge)
{
	var p1 = new Point(distanceFromEdge, distanceFromEdge);
	var p2 = new Point(getPixelWidth() - distanceFromEdge, distanceFromEdge);
	var p3 = new Point(getPixelWidth() - distanceFromEdge, getPixelHeight() - distanceFromEdge);
	var p4 = new Point(distanceFromEdge, getPixelHeight() - distanceFromEdge);
	
	drawLinePt(p1, p2);
	drawLinePt(p2, p3);
	drawLinePt(p3, p4);
	drawLinePt(p4, p1);
}

function drawRotatedBox(boxDiameter, rads)
{
	// original values
	var radius = Math.round(boxDiameter / 2);
	var upperLeft = new Point(-radius, -radius);
	var upperRight = new Point(+radius, -radius);
	var lowerLeft = new Point(-radius, +radius);
	var lowerRight = new Point(+radius, +radius);
	
	// rotated values
	var r_upperLeft = rotatePoint(upperLeft, rads);
	var r_upperRight = rotatePoint(upperRight, rads);
	var r_lowerLeft = rotatePoint(lowerLeft, rads);
	var r_lowerRight = rotatePoint(lowerRight, rads);
	
	// center 
	var hw = Math.round(getPixelWidth() / 2);
	var hh = Math.round(getPixelHeight() / 2);
	r_upperLeft.x += hw;
	r_upperLeft.y += hh;
	r_upperRight.x += hw;
	r_upperRight.y += hh;
	r_lowerLeft.x += hw;
	r_lowerLeft.y += hh;
	r_lowerRight.x += hw;
	r_lowerRight.y += hh;
	
	// draw lines
	drawLinePt(r_upperLeft, r_upperRight);
	drawLinePt(r_upperRight, r_lowerRight);
	drawLinePt(r_lowerRight, r_lowerLeft);
	drawLinePt(r_lowerLeft, r_upperLeft);
}

function drawLinePt(pt1, pt2) {
	drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
}

function rotatePoint(pt, rads) {
	return new Point(Math.floor((pt.x * cos(rads)) - (pt.y * sin(rads))), Math.floor((pt.x * sin(rads)) + (pt.y * cos(rads))));
}

function project3DptOnto2Dplane(x, y, z)
{
	var planeDepth = 256;
	var c = planeDepth / z;
	var x1 = x * c;
	var y1 = y * c;
	return new Point(x1, y1);
}

function isOnScreen(x, y)
{
	var hw = getPixelWidth() / 2;
	var hh = getPixelHeight() / 2;
	return (-hw <= x && x <= hw) && (-hh <= y && y <= hh);
}

function draw3DBox(rads) 
{
	var boxCenterZ = 200;
	var xOffset = Math.floor(getPixelWidth() / 2);
	var yOffset = Math.floor(getPixelHeight() / 2);
	drawPixel(xOffset, yOffset, colorPixelOn);
	
	var boxWidth = 20;
	var halfBoxWidth = boxWidth / 2;
	var numPoints = 8;
	var pointSigns = new Array(new Point(-1, 1), new Point(1, 1), new Point(1, -1), new Point(-1, -1));
	var boxPoints = new Array();
	for (var i = 0; i < 4; i++) {
		boxPoints[i] = new Point(
			halfBoxWidth * pointSigns[i % pointSigns.length].x, 
			halfBoxWidth * pointSigns[i % pointSigns.length].y);
if (fardad == 1)
		console.log("boxPoint["+i+"] = (" + boxPoints[i].x + ", "+ boxPoints[i].y + ")");
	}
	
	var pt3D = new Array();
	// closest side, starting at upper left, going clockwise, then farthest side, upper left, clockwise
	for (var i = 0; i < 8; i ++)
		pt3D[i] = new Point3D(boxPoints[i%4].x, boxPoints[i%4].y, (Math.floor(i/4)*2-1)*(boxCenterZ*5));
	
	var pt_colors = new Array("red", "blue");
	for (var i = 0; i < 8; i ++) {
		var pt = project3DptOnto2Dplane(pt3D[i].x, pt3D[i].y, pt3D[i].z);
		var x = xOffset + Math.floor(pt.x);
		var y = yOffset + Math.floor(pt.y);
		drawPixel(x, y, pt_colors[i%4]);
		if (fardad == 1) {
			//if (i == 0 || i == 7)
			console.log("i = " + i + "; ("+x+", "+y+")  " + (isOnScreen(x, y) ? 'On Screen!' : ''));
		}
	}
	if (fardad == 1) {
		console.log("Half Width: " + xOffset);
		console.log("Half Height: " + yOffset);
	}
		 fardad = 0;
}
var fardad = 1;
