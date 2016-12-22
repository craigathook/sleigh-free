function Tweener() {
	var self = this;

	this.tweens = [];
	
	this.to = function(target, duration, properties, ease){
		//console.log(target, duration, properties, ease);
		if(!ease){
			ease = function(d){return d};
		}
		var tween;
		for(var t in this.tweens){
			if(this.tweens[t].target == target) {
				this.tweens[t] = new Tween(target, duration, properties, ease);
				return;
			}
		}
		tween = new Tween(target, duration, properties, ease);
		this.tweens.push(tween);
	}.bind(this);

	this.render = function() {
		for(var t in this.tweens){
			console.log('1');
			var tween = this.tweens[t];
			tween.update();
		}
	}.bind(this);

	function Tween(target, duration, properties, ease) {
		this.target = target;
		this.duration = duration * 1000;
		this.startTime = new Date().getTime();
		this.endTime = this.startTime + this.duration;
		this.currentTime = 0;
		this.progress = 0;
		this.endProps = properties;
		this.ease = ease;
		this.startProps = getStartProps(target, properties);

		function getStartProps(target, endProps){
			// only build a startProps object with the properties we are actually going to tween.
			var startProps = {}
			for(var i in endProps){
				//if(target.hasOwnProperty(i) == false) return;
				startProps[i] = target[i];
			}
			return startProps;
		}

		this.update = function(){
			this.currentTime = new Date().getTime() - this.startTime;
			this.progress = this.currentTime / this.duration;
			if(this.progress > 1) this.progress = 1;
			//console.log('update', this.progress);
			for(var p in this.endProps){
				if(p == 'elem') return;
				//console.log('update', p, this.progress, this.startProps[p], this.endProps[p]);
				var change = this.endProps[p] - this.startProps[p];
				this.target[p] = this.startProps[p] + (change * this.ease(this.progress));
			}
			if(this.progress < 1) {
				window.requestAnimationFrame(this.update);
			}
		}.bind(this);

		window.requestAnimationFrame(this.update);
		//console.log(this);
	}

}

module.exports = new Tweener();