

Class.define("XMath.Clock",{ // forked from THREE.Clock -> https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js
	ctor : function(autoStart) {
		this.autoStart = ( autoStart !== undefined ) ? autoStart : true;
		if(this.autoStart) {
			this.start();
		}
		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;
		var _cycles = 0;
		this.running = false;
		
		this.stop = function () {
			var t = this.getElapsedTime();
			this.running = false;
			_cycles = 0;
			return t;
		},
		this.getDelta = function () {
			var diff = 0;
			var started_now = false;
			if ( this.autoStart && ! this.running ) {
				this.start();
				started_now = true;
			}
			if ( this.running ) {
				var newTime = window.performance.now();
				diff = 0.001 * ( newTime - this.oldTime );
				this.oldTime = newTime;
				this.elapsedTime += diff;
				if(!started_now) {
					_cycles += 1;
				}
			}
			return diff;
		},
		this.getCycles = function() {
			return _cycles;
		}
	},
	proto : {
		start: function () {
			this.startTime = window.performance.now();
			this.oldTime = this.startTime;
			this.running = true;
			return this.startTime;
		},
		getNow : function() {
			return window.performance.now();
		},
		getElapsedTime: function () {
			this.getDelta();
			return this.elapsedTime;
		},
		getElapsedTimeAndDelta : function() {
			var delta = this.getDelta();
			return {
				elapsed : this.elapsedTime,
				delta : delta
			};
		},
		
	}
});