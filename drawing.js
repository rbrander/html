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

var _pixelWidth = -1;
function getPixelWidth()
{
    // Each block looks like this:
    // Xb
    // bb  
    // Where X is the pixel and b is just a blank spot
    
    if (_pixelWidth < 0)
		_pixelWidth = Math.floor((CANVAS_WIDTH - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
    // leaving one block around the outside as a board
    return _pixelWidth;
}

var _pixelHeight = -1;
function getPixelHeight()
{
	// leaving one block around the outside as a board
    if (_pixelHeight < 0)
		_pixelHeight = Math.floor((CANVAS_HEIGHT - (BLOCK_SIZE * 2)) / BLOCK_SIZE);
    return _pixelHeight;
}

function clearBoard()
{
    var ctx = getContext();
    ctx.fillStyle = colorBackground;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // draw all the pixels off
    for (var y = 0; y < getPixelHeight(); y++)
        for (var x = 0; x < getPixelWidth(); x++)
            drawPixel(x, y, colorPixelOff);
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
function sign(a) {
	return (a < 0 ? -1 : (a > 0 ? +1 : 0));
}

function drawLine(x1, y1, x2, y2) { drawLineColour(x1, y1, x2, y2, colorPixelOn); }
function drawLineColour(x1, y1, x2, y2, colour)
{
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);
	var sx = (x1 < x2 ? 1 : -1);
	var sy = (y1 < y2 ? 1 : -1);
	var err = dx-dy;
	
	// loop
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
	// end loop
}

// draw a box in the middle
function drawCenteredBox(boxWidth)
{
    var width = getPixelWidth();
    var height = getPixelHeight();
    
    var x1 = (width - boxWidth) / 2;
    var y1 = (height - boxWidth) / 2;
    var x2 = x1 + boxWidth;
    var y2 = y1 + boxWidth;
    
    clearBoard();
	drawLineBox(x1, y1, x2, y2);
}

function DegsToRads(degrees) {
	return (Math.PI / 180) * degrees;
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

function drawLinePt(pt1, pt2)
{
	drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
}

function rotatePoint(pt, rads) {
	return new Point(Math.floor((pt.x * Math.cos(rads)) - (pt.y * Math.sin(rads))), Math.floor((pt.x * Math.sin(rads)) + (pt.y * Math.cos(rads))));
}

function rotateX(x, y, rads) {
	//return Math.floor((x * Math.cos(rads)) - (y * Math.sin(rads)));
	return rotateXPoint(x, y, rads, 0, 0);
}

// rotates x, y around the point px,py by rads radians
function rotateXPoint(x, y, rads, px, py)
{
	// RotatePoint.X = pOrigin.X + ( Cos(D2R(Degrees)) * (pPoint.X - pOrigin.X) - Sin(D2R(Degrees)) * (pPoint.Y - pOrigin.Y) )
	
	// old way .. doesn't work well
	// return Math.floor(px + ((x-px) * Math.cos(rads)) - ((y-py) * Math.sin(rads)));
	
	return Math.round(px + (x * Math.cos(rads)));
}

function rotateY(x, y, rads) {
	//return Math.floor((x * Math.sin(rads)) + (y * Math.cos(rads)));
	return rotateYPoint(x, y, rads, 0, 0);
}
// rotates x, y around the point px,py by rads radians
function rotateYPoint(x, y, rads, px, py)
{
	// RotatePoint.Y = pOrigin.Y + ( Sin(D2R(Degrees)) * (pPoint.X - pOrigin.X) + Cos(D2R(Degrees)) * (pPoint.Y - pOrigin.Y) )
	// old way... doesn't work well
	//return Math.floor(py + ((x - px) * Math.sin(rads)) + ((y-py) * Math.cos(rads)));
	
	return Math.round(py + (x * Math.sin(rads)));
}

// mostly for testing
function draw_pixel_arc()
{
	var x = 30;
	var y = 0;
	for (var angle = 0; angle <= 90; angle++) {
		var _x = rotateX(x, y, DegsToRads(angle));
		var _y = rotateY(x, y, DegsToRads(angle));
		drawPixel(_x, _y, colorPixelOn);
	}
}

