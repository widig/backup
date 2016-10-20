Router.addPage({name:"current-tasks.tracer",template:"base"},function(args, template, router) {
	var $ = BrowserTools.setStyle;
	
	var parent_container = template.Container().elementGetContents("origin_lt");
	var parent1 = template.Container().elementGet("origin_lt");
	parent_container.elementsClear();
	
	
	var ruler_width = 15;
	var p = parent_container.elementNewPacket("\
		<canvas id=\"background\"></canvas>\
		<canvas id=\"hruler\"></canvas>\
		<canvas id=\"vruler\"></canvas>\
		<canvas id=\"board\"></canvas>\
	");
	
	function rgba(target,pos,r,g,b,a) {
		target.data[pos] = r;
		target.data[pos+1] = g;
		target.data[pos+2] = b;
		target.data[pos+3] = a;
	}
	function update(target,sz) {
		var ctx = {};
		ctx[target] = target.getContext("2d");
	
	
		if( target == p.el.hruler ) {
			
			var tsz = [sz[0]-ruler_width,ruler_width];
			var img = ctx[target].getImageData(0,0,tsz[0],tsz[1]);
			var space = 5;
			var mod_tsz0 = tsz[0] % space;
			var div = (tsz[0] - mod_tsz0) / space;
			
			rgba(img,pos,255,255,255,255);
			var last = [0,0];
			for(var y = 0; y < tsz[1];y++) {
				for(var x = 0; x < tsz[0];x++) {
					var pos = (y*tsz[0] + x) << 2;
					if( x % space == space-1 ) {
						rgba(img,pos,0,0,0,255);
					} else {
						rgba(img,pos,255,255,255,255);
					}
				}
			}
			ctx[target].putImageData(img,0,0);
		} else if(target == p.el.vruler ) {
			var tsz = [ ruler_width,sz[1]-ruler_width ];
			var img = ctx[target].getImageData(0,0,tsz[0],tsz[1]);
			
			var space = 5;
			var mod_tsz0 = tsz[0] % space;
			var div = (tsz[0] - mod_tsz0) / space;
			
			rgba(img,pos,255,255,255,255);
			var last = [0,0];
			for(var y = 0; y < tsz[1];y++) {
				for(var x = 0; x < tsz[0];x++) {
					var pos = (y*tsz[0] + x) << 2;
					if( y % space == space-1 ) {
						rgba(img,pos,0,0,0,255);
					} else {
						rgba(img,pos,255,255,255,255);
					}
				}
			}
			ctx[target].putImageData(img,0,0);
		} else if( target == p.el.board ) {
			var tsz = [ parseInt( (sz[0]-ruler_width)/2 ),parseInt( (sz[1]-ruler_width)/2 ) ];
			var img = ctx[target].getImageData(0,0,tsz[0],tsz[1]);
			
			for(var y = 0; y < tsz[1];y++) {
				for(var x = 0; x < tsz[0];x++) {
					var pos = (y*tsz[0] + x) << 2;
					rgba(img,pos,128,128,128,255);
				}
			}
			ctx[target].putImageData(img,0,0);
		} else if( target == p.el.background ) {
			var tsz = [ parseInt( sz[0]-ruler_width) ,parseInt( sz[1]-ruler_width ) ];
			var img = ctx[target].getImageData(0,0,tsz[0],tsz[1]);
			
			for(var y = 0; y < tsz[1];y++) {
				for(var x = 0; x < tsz[0];x++) {
					var pos = (y*tsz[0] + x) << 2;
					rgba(img,pos,255,255,255,255);
				}
			}
			ctx[target].putImageData(img,0,0);
		} else {
			throw "not implemented.";
		}
		
	}
	
	
	function setLayout() {
		var sz = UI.Window.getBounds();
		// orientation top-left is 0,0
		
		// set hruler
		$( p.el.hruler, { position : "absolute", top : "0px", left : ruler_width + "px", width : (sz[0]-ruler_width)+"px", height : ruler_width+"px", attribs : { width : ""+(sz[0]-ruler_width), height : ""+ruler_width } });
		update( p.el.hruler, sz );
		// set vruler
		$( p.el.vruler,{ position : "absolute", top : ruler_width+ "px", left : "0px", width : ruler_width+ "px", height : (sz[1]-ruler_width)+"px", attribs : { width : ""+ruler_width, height : ""+(sz[1]-ruler_width) } });
		update( p.el.vruler, sz );
		// set background everything but rulers
		$( p.el.background, { position : "absolute", top : ruler_width+ "px", left : ruler_width+ "px", width : (sz[0]-ruler_width)+"px", height : (sz[1]-ruler_width)+"px", attribs : { width : ""+(sz[0] - ruler_width), height : ""+(sz[1] - ruler_width) } });
		update( p.el.background, sz );
		// set board half back
		$( p.el.board, { position : "absolute", top : ((sz[1]-ruler_width)/2 - ((sz[1]-ruler_width)/4)+ruler_width) + "px", left : (((sz[0]-ruler_width)/2)-((sz[0]-ruler_width)/4)) + "px", width : ((sz[0]-ruler_width)/2) +"px", height : ((sz[1]-ruler_width)/2)+"px",attribs : { width : ""+((sz[0]-ruler_width)/2), height : ""+((sz[1]-ruler_width)/2) } });
		update( p.el.board, sz );
	}
	
	UI.Window.on("resize",function() {
		setLayout();
	});
	setLayout();
	
	
});