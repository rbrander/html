// javascript.js

var DELAY = 20;
var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 200;
var BLOCK_SIZE = 4;

var colorBackground = 'rgb(0,0,0)';
var colorPixelOff = 'rgb(80,80,80)';
var colorPixelOn = 'rgb(220, 220, 220)';

var intervalID;
var isRunning = false;

// Frames per Second
var referenceTime;
var FPS_ID = 0;
var frameCount = 0;

$(function() {
    clearBoard();
    console.log("Width: " + getPixelWidth());
    console.log("Height: " + getPixelHeight());
	
	$('#delay').change(function() { 
		var val = $(this).val();
		if (isFinite(val))
			updateDelay(val);
	});
	$('#animationSelector').change(function() {
		if (isRunning) {
			stop();
			start();
		}
	});
	
	trig_init();	// populates lookup tables

	var sldr = $("#slider");
	sldr.slider({
		min: 10,
		max: 2000,
		step: 10,
		create: function(ev, ui) { updateDelay(ui.value); },
		slide: function(ev, ui) { updateDelay(ui.value); },
		change: function(ev, ui) {
			updateDelay(ui.value);
			//console.log('isRunning is ' + isRunning.toString());
			if (isRunning) {
				stop();
				start();
			}
		}
	});
	sldr.slider('value', DELAY);
	
	stop();
});

function updateDelay(newValue)
{
	if (!isFinite(newValue))
		return;

	$('#delay').val(newValue);
	DELAY = newValue;
}

function updateFPS()
{
	/*
	if (!isFinite(referenceTime))
		return;
	
	var timeDiff = (new Date() - referenceTime) / 1000;	// convert the differnce to seconds
	console.log('  updateFPS :: frameCount = ' + frameCount);
	console.log('  updateFPS :: timeDiff = ' + timeDiff);
	var fps = Math.ceil(frameCount / timeDiff);
	console.log('  updateFPS :: fps = ' + fps);
	*/
	var fps = frameCount;
	$('#FPS').val(fps);
	frameCount = 0;
	referenceTime = new Date();
}

function start() {
	// Animation
	currOffset = 0;
	var fnName = 'cb'+ $('#animationSelector').val() + 'Drawer();';
	intervalID = setInterval(function(){ 
		frameCount++; 
	    var start = new Date();
		eval(fnName);
		$('#FrameDrawSpeed').val((new Date()) - start);
	}, DELAY);
	$('#FrameDrawSpeed').val('0');
	$('#divFrameDrawSpeed').show();
	
	// Frames per second
	frameCount = 0;
	referenceTime = new Date();
	FPS_ID = setInterval(function(){ updateFPS(); }, 1000);
	$('#FPS').val('0');
	$('#divFPS').show();
	
	isRunning = true;
}

function stop() {
	// Animation
	if (isFinite(intervalID)) {
		clearInterval(intervalID);
		$('#FrameDrawSpeed').val('');
		$('#divFrameDrawSpeed').hide();
	}
	
	// Frames per second
	if (isFinite(FPS_ID))
		clearInterval(FPS_ID);
	$('#FPS').val('');
	$('#divFPS').hide();
	
	isRunning = false;
}
