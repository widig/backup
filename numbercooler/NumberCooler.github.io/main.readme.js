
Router.addPage({name:"readme",template:"base"},function(args, template, router) {
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	var label = origin_lt_container.elementNew("label","span");
	label.innerHTML = "readme";
	
});