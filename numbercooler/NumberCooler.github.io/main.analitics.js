
Router.addPage({name:"analitic",template:"base"},function(args,template,router) { // spreadsheet

	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
});