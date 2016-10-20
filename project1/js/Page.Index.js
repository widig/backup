Router.addPage({name:"index",template:"FixedMenu"},function(args,template) { // loaded presentation, communications panel
	var self = this;
	base_container.apply(this);
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
});