
Router.addPage({name:"home2",template:"base"},function(args,template) { // loaded presentation, communications panel
	var self = this;
	base_container.apply(this);
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
  	var p = origin_lt_container.elementNewPacket("<a id=\"link\" href=\"\"><text value=\"home\"/></a>");
  	p.el.link.addEventListener("click",function() {
		History.go("#home");
    });
});

Router.addPage({name:"home",template:"base"},function(args,template) { // loaded presentation, communications panel
	var self = this;
	base_container.apply(this);
	
	// AUTHENTICATE TOKEN
	
	var csrf_cookie = localStorage.getItem("csrf-cookie");
	if(csrf_cookie == null || csrf_cookie == undefined || csrf_cookie == "undefined") {
		alert("no cookie");
		History.go("#login");
	} else {
		Import({url:"/json.login",method:"get",json:true,data:{csrf_cookie:csrf_cookie}})
			.done(function(data) {
				// if fail to authenticate then load login screen
				if(data.result) {
				
					// LOAD OF PAGE
				
					var origin_lt_container = template.Container().elementGetContents("origin_lt");
					var origin_lt = template.Container().elementGet("origin_lt");
					origin_lt_container.elementsClear();
					var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
					h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;

					var $ = BrowserTools.setStyle;
					var $$ = BrowserTools.arraySetStyle;	
	
					var p = origin_lt_container.elementNewPacket(
						"<div id=\"btnLogout\">logout</div>"
					);
					
					$(p.el.btnLogout,{
						events : {
							click : function() { 
								var csrf_cookie = localStorage.getItem("csrf-cookie");
								var args = {csrf_cookie:csrf_cookie};
								Import({url:"/json.logout",method:"get",json:true,data:args})
									.done(function(data) {
										localStorage.setItem("csrf-cookie","");
										delete localStorage["csrf-cookie"];
										localStorage.setItem("username","");
										UI.History.go("#login");
									})
									.fail(function(error) {
									})
									.send();
							}
						}
					});
					UI.Window.on("resize",function() {
						console.log("window resize");
						var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
						h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
						$(p.el.btnLogout,{
							left : (w-100) + "px"
						});
						
					});
					
					
					
				} else {
					UI.History.go("#login");
				}
			})
			.fail(function(error) {
			})
			.send();
	}
	
});

