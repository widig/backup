
Router.addPage({name:"tools.notes",template:"base"},function(args, template, router) { // this is coupled, requires temporary.musicplayer defined
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	History.go("#notes2");
	
});