var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var isChrome = !!window.chrome && !!window.chrome.webstore;

function GameEngine() {

	this.gameObjects = [];
	this.assetContainer = null;
	this.gameContainer = null;
	this.assets = {};

	this.mouse = {
		x: 0,
		y: 0
	}

	this.update = function(){
		//console.log('update');
		for(var i in this.gameObjects) {
			var gameObject = this.gameObjects[i];
			gameObject.update();
		}

		this.render();

		window.requestAnimationFrame(this.update);
	}.bind(this);

	this.stage = null;
	this.ontick = null;

	this.render = function(){

		for(var i in this.gameObjects) {
			var gameObject = this.gameObjects[i];
			var elem = gameObject.elem;

			//console.log(elem, gameObject.x);
			elem.style.display = 'block';

			// position
			elem.style.left = gameObject.x + 'px';
			elem.style.top = gameObject.y + 'px';

			// rotation
			elem.style.webkitTransform = 'rotate('+gameObject.rotation+'deg)';
			elem.style.MozTransform = 'rotate('+gameObject.rotation+'deg)';
			elem.style.msTransform = 'rotate('+gameObject.rotation+'deg)';
			elem.style.OTransform = 'rotate('+gameObject.rotation+'deg)';
			elem.style.transform = 'rotate('+gameObject.rotation+'deg)';
		}

		if(this.ontick) this.ontick();
	}.bind(this);


	this.createGameObject = function(assetName, name){
		var elem = this.assetContainer.querySelector('.'+assetName).cloneNode(true);

		elem.style.display = 'none';
		elem.style.position = 'absolute';
		elem.style.top = '0px';
		elem.style.left = '0px';

		var gameObject = new GameObject(elem, this.gameObjects.length, name);
		this.gameObjects.push(gameObject);
		//this.gameContainer.appendChild(elem);
		return gameObject;
	}.bind(this);

	this.setAssetContainer = function(elem){
		this.assetContainer = elem;
		elem.style.display = 'none';
	}.bind(this);

	this.setStage = function(elem, width, height){
		var gameObject = new GameObject(elem, 'GameContainer');
		elem.style.overflow = 'hidden';

		this.gameContainer = gameObject;
		this.stage = gameObject;
		return gameObject;
	}.bind(this);

	this.updateMouse = function(event){
		var x = event.clientX - this.stage.elem.offsetLeft;
		var y = event.clientY - this.stage.elem.offsetTop;
		if(x < 0) x = 0;
		if(x > this.stage.width) x = this.stage.width;
		if(y < 0) y = 0;
		if(y > this.stage.height) y = this.stage.height;
		this.mouse.x = x;
		this.mouse.y = y;
	}.bind(this);

	window.requestAnimationFrame(this.update);
	document.onmousemove = this.updateMouse;
}

function GameObject(elem, id, name) {
	this.x = 0;
	this.y = 0;
	this.width = elem.offsetWidth;
	this.height = elem.offsetHeight;
	this.rotation = 0;
	this.elem = elem;
	this.id = id;
	this.name = name;
	this.parent = null;
	this.children = [];

	this.update = function(){

	}.bind(this);

	this.add = function(gameObject){
		this.children.push(gameObject);
		if(gameObject.parent)  {
			gameObject.parent.remove(gameObject);
		}

		gameObject.parent = this;

		this.elem.appendChild(gameObject.elem);
	}.bind(this);

	this.remove = function(gameObject){
		gameObject = gameObject || this;
		if(gameObject.parent)  {
			gameObject.elem.parentNode.removeChild(gameObject.elem);
		}
		for(var c in this.children) {
			if(this.children[c].id == gameObject.id) {
				this.children.splice(c, 1);
			}
		}
	}.bind(this);
}

module.exports = GameEngine;