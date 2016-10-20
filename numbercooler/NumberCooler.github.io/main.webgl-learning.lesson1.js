
Router.addPage({name:"webgl-learning.lesson1",template:"base"},function(args, template, router) {
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	var label = origin_lt_container.elementNew("label","span");
	label.innerHTML = "js shader";
	
	
	
	
	var context = {};
	
	// Languages.LOGICUNIT.run("",context);
	
	
	
	
	/*
		what is need to be done:
			example:
			
				var camera = {
					position : null
				}
				
				var program = Program(context);
				var p = program.packet[name] = {
					pt : program.vs_attribute_vec3("pt",3,4,function() {
					}),
					normal : program.vs_attribute_vec3("normal",3,4,function() {
					}),
					camera_position : program.vs_uniform_vec3("cam_position",0,0,0)
					color : program.fs_attribute_vec3(  );
				};
				program.index( program.packet[name],function() {
					// set order of points
				});
				p.camera_position.rotate(...);
				p.pt.translate( 1, 0, 0 );
				
				program.vertex = function() {
					program.vs_pos( p.pt );
				}
				program.fragment = function() {
					program.fs_color( p.color );
				}
				program.send(p); // but context is needed before this point.
				'setInterval' (function() {
					if(key) {
						p.camera_position.translate(1,0,0);
					}
					for(var obj in scene.object)
						program.send( obj );
				},100);
				
	*/
	
});