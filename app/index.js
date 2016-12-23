'use strict';

var Tweener = require('./Tweener');
var GameEngine = require('./GameEngine');
var CubicBezier = require('./CubicBezier');
var Geometry = require('./utils/Geometry');

window.Tweener = Tweener;
window.cubeEase = CubicBezier;

function SleighFree(){
	var game = new GameEngine();
	var stage = game.setStage(stageContainer);
	game.setAssetContainer(assetContainer);

	var avalancheSpeed = 1;
	var avalancheSleighOffset = 480;
	var avalancheDeadOffset = 780;
	var avalancheAccel = 0.1*0.2;
	var avalancheDistance = -700;
	var shakeIntensity = 50;
	var shakeDistance = 2000;
	var speed = 0;
	var minSpeed = 5;
	var gravity = 0.1;
	var friction = 1;
	var trees = [];
	var obstacles = [];
	var distanceTraveled = 0;
	var numTrees = 50;
	var gameOver = false;
	var treePool = {
		used: [],
		unused: []
	}

	var numClouds = 50;
	var cloudPool = {
		used: [],
		unused: []
	}

	var camera = game.createGameObject('container');
	var level = game.createGameObject('container');
	var sleigh = game.createGameObject('container');
	var sleighInner = game.createGameObject('sleigh');
	var avalanche = game.createGameObject('avalanche');
	var treeContainer = game.createGameObject('container');
	var score = game.createGameObject('score');

	var story = game.createGameObject('welcome-screen');

	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	if(w > 400) {
		w = 400;
	}
	if(h > 720) {
		h = 720;
	}

	stage.elem.style.height = h + 'px';
	stage.elem.style.width = w + 'px';

	stage.height = h;
	stage.width = w;

	avalanche.y = 0;
	avalanche.speed = 2;

	sleigh.add(sleighInner);
	
	sleigh.inner = sleighInner;
	sleigh.inner.x -= sleigh.inner.width/2;
	sleigh.inner.y -= sleigh.inner.height/2;

	window.sleighInner = sleighInner;

	stage.add(camera);
	camera.add(level);
	level.add(sleigh);
	level.add(treeContainer);
	level.add(avalanche);
	stage.add(score);
	stage.add(story);

	score.elem.innerHTML = '0';

	sleigh.y = stage.height / 2;

	while(numTrees--){
		var tree = game.createGameObject('tree');
		level.add(tree);
		tree.x -= 1000;
		treePool.unused.push(tree);
	}

	while(numClouds--){
		var cloud = game.createGameObject('tree');
		avalanche.add(cloud);
		cloud.x -= 1000;
		cloudPool.unused.push(cloud);
	}

	var sleighLastX = sleigh.x;
	//var spawnTime = new Date().getTime();
	var lastSpawn = distanceTraveled;

	

	// make first tree
	var tree = treePool.unused.pop();
	//console.log('tree',tree,treePool.unused);
	treePool.used.push(tree);

	tree.x = Math.random()*stage.width;
	tree.y = stage.height - 100;
	treeContainer.add(tree);

	welcome();

	function welcome(){
		story.elem.onclick = init;
	}

	function init(){
		Tweener.to(avalanche, 60, {speed:12}, CubicBezier.config(.31,.7,.31,.94));
		Tweener.to(story, 1, {y: -stage.height}, CubicBezier.config(.31,.7,.31,.94))
		game.ontick = tick;
	}

	function tick(){

		//avalancheSpeed += avalancheAccel;
		avalancheDistance += avalanche.speed;

		score.elem.innerHTML = Math.round(distanceTraveled);

		avalanche.y = avalancheDistance - distanceTraveled;
		var distAvalancheToSleigh = avalancheDistance - distanceTraveled + avalancheSleighOffset;
		var cameraShake = shakeIntensity * (1-(Math.abs(distAvalancheToSleigh)/shakeDistance));
		//cameraShake -= cameraShake/2;
		if(cameraShake < 0) cameraShake = 0;


		Tweener.to(camera, 0.1, {x: -(cameraShake/2) + (Math.random()*(cameraShake)), y: -(cameraShake/2) + (Math.random()*(cameraShake))});
		//console.log(cameraShake);
		//console.log(distAvalancheToSleigh);
		//console.log(avalanche.speed);


		var sleighRotation = (sleighLastX - sleigh.x) * 20;
		if(sleighRotation > 90) sleighRotation = 90;
		if(sleighRotation < -90) sleighRotation = -90;
		sleighLastX = sleigh.x;


		if(!sleigh.dead) Tweener.to(sleigh, 0.3, {x:game.mouse.x, rotation: (sleighLastX - sleigh.x) * 10});
		if(!sleigh.dead) Tweener.to(sleigh, 0.1, {rotation: sleighRotation});
		else Tweener.to(sleigh, 0.1, {rotation: -120});

		//if(sleigh.x < 0) sleigh.x = 0;

		//console.log(sleigh.rotation)
		var g;

		if(speed > 5) g = gravity * 0.3;		
		else g = gravity

		var sleighAngle = Math.abs(sleigh.rotation) / 50;
		var angleFriction =  Math.sin(sleighAngle * Math.PI / 180);
		speed += g;
		speed -= angleFriction * 8;
		if(!sleigh.dead) distanceTraveled += speed;
		//speed -= friction * angleFriction;
		//console.log('angleFriction speed',angleFriction);
		//speed -= 

		if(speed < 2) speed = 2;
		if(speed > 16) speed = 16;
		if(avalancheSpeed > 16.1) avalancheSpeed = 16;
		Tweener.to(level, 0.5, {y: 150 - (speed * 20)});

		//console.log(speed);


		//var lastSpawn = new Date().getTime() - spawnTime;
		//var spawnRate = 250;

		var spawnDistance = distanceTraveled - lastSpawn;
		var spawnRate = 100 + (100*Math.random());
		//console.log(spawnDistance);

		if(spawnDistance > spawnRate) {
			lastSpawn = distanceTraveled;

			var tree = treePool.unused.pop();
			//console.log('tree',tree,treePool.unused);
			treePool.used.push(tree);

			tree.x = Math.random()*stage.width;
			tree.y = stage.height + (speed * 20);
			treeContainer.add(tree);
			//trees.push(tree);
		}

		if(distAvalancheToSleigh > 400) {
			if(sleigh.dead) {
				sleigh.remove();
				endGame();
			}
			sleigh.dead = true;
		}

		treePool.used.forEach(function(t, i){
			if(!sleigh.dead) t.y -= speed;
			if(t.y < -200) {
				treePool.used.splice(i, 1);
				treePool.unused.push(t);
				treeContainer.remove(t);
			}
			if(hitCheck(t, sleigh)) {
				sleigh.dead = true;
				//game.ontick = null;
			}
		});

		cloudPool.used.forEach(function(c, i){
			if(c.alpha < 0) {
				treePool.used.splice(i, 1);
				treePool.unused.push(c);
				avalanche.remove(c);
			}
			if(hitCheck(t, sleigh)) {
				sleigh.dead = true;
				//game.ontick = null;
			}
		});

	}

	function endGame() {
		if(!gameOver) {
			console.log('???")')
			var deadScreen = game.createGameObject('dead-screen');
			deadScreen.elem.querySelector('.end-score').innerHTML = score.elem.innerHTML;
			deadScreen.y = -1000;
			deadScreen.elem.onclick = replay;
			stage.add(deadScreen);
			deadScreen.elem.style.visibility = 'hidden'
			Tweener.to(deadScreen, 3, {y:0}, CubicBezier.config(1,.01,.65,1));
			gameOver = true;
		}
	}

	function replay(){
		game.ontick = null;
		document.querySelector('#stageContainer').innerHTML = '';
		new SleighFree();
	}

	function hitCheck(a,b){
		//console.log(a.x , b.x - (b.inner.width/2), a.x , b.x + (b.inner.width/2), a.y , b.y - (b.inner.height/2), a.y , b.y + (b.inner.height/2));
		if(
			a.x > b.x - (b.inner.width/2)
			&& a.x < b.x + (b.inner.width/2) 
			&& a.y > b.y - (b.inner.height/2) 
			&& a.y < b.y + (b.inner.height/2) 
			) {
			return true;
		}
	}

	function getTree(){
		return 
	}
	
	window.game = game;
}


window.SleighFree = SleighFree;