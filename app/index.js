'use strict';

var Tweener = require('./Tweener');
var GameEngine = require('./GameEngine');
var CubicBezier = require('./CubicBezier');

window.Tweener = Tweener;
window.cubeEase = CubicBezier;



function SleighFree(){
	var game = new GameEngine();
	var stage = game.setStage(stageContainer);
	game.setAssetContainer(assetContainer);

	var speed = 10;
	var masterSpeed = 10;
	var trees = [];

	var sleigh = game.createGameObject('sleigh');

	stage.add(sleigh);

	game.ontick = tick;

	var sleighLastX = sleigh.x;

	function tick(){
		Tweener.to(sleigh, 0.3, {x:game.mouse.x, y:game.mouse.y});

		//if(sleigh.x < 0) sleigh.x = 0;

		sleigh.rotation = (sleighLastX - sleigh.x) * 5;
		speed += 0.02;
		speed -= Math.abs(sleigh.rotation)/300;

		if(speed < 5) speed = 5;

		sleighLastX = sleigh.x;

		if(Math.round(Math.random()*100) > 97) {
			var tree = game.createGameObject('tree');
			tree.x = Math.random()*stage.width;
			tree.y = stage.height;
			stage.add(tree);
			trees.push(tree);
		}

		trees.forEach(function(t, i){
			t.y -= speed;
			if(t.y < -200) {
				trees.splice(i, 1);
				stage.remove(t);
			}
		});

	}
	
	window.game = game;
}

new SleighFree();