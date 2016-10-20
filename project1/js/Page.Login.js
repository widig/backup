
Router.addPage({name:"login",template:"base"},function(args,template) { // loaded presentation, communications panel
	var self = this;
	base_container.apply(this);
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	var bounds = UI.Window.getBounds();
	var w = bounds[0];
	var h = bounds[1];
	var $ = BrowserTools.setStyle;
	var $$ = BrowserTools.arraySetStyle;
	
	Import({method:"get",url:"login.html"})
		.done(function(data) {
			var p = origin_lt_container.elementNewPacket(
				"<div id=\"panelLogin\" style=\"position:absolute;left:"+(w/2-125)+"px;top:"+(h/2-145)+"px;width:250px;height:290px;border:solid 1px #000;background-color:#ec3;\">"+
					data + 
					"<div id=\"lblErrorMessage\" style=\"position:relative;top:260px;border:solid 1px #f00;background-color:#fff;color:#000;display:none;padding:5px;\"></div>"+
				"</div>"
			);
			p.el.login_username.value = "";
			p.el.login_password.value = "";
			function submit_login() {
				var username = p.el.login_username.value;
				//Hash.sha3_512_start();
				var args = {
					username : p.el.login_username.value,
					//password : Hash.sha3_512_iter(p.el.login_password.value).data
					password : p.el.login_password.value
				};
				Import({url:"/json.login",method:"get",json:true,data:args})
					.done(function(data) {
						if(data.result) {
							localStorage.setItem("csrf-cookie",data.csrf_cookie);
							localStorage.setItem("username",username);
							UI.History.go("#home");
						} else {
							if(data.message == "no users.") {
								var error = p.el.lblErrorMessage;
								error.innerHTML = "no users.";
								error.style.display = "";
							} else {
								var error = p.el.lblErrorMessage;
								error.innerHTML = data.message;
								error.style.display = "";
							}
						}
						p.el.login_username.value = "";
						p.el.login_password.value = "";
					})
					.fail(function(error) {
						var error = p.el.lblErrorMessage;
						error.innerHTML = error.message;
						error.style.display = "";
					})
					.send();
			}
			function submit_register() {
				var username = p.el.register_username.value;
				if(p.el.register_password1.value == p.el.register_password2.value) {
					//Hash.sha3_512_start();
					var args = {
						username : p.el.register_username.value,
						//password : Hash.sha3_512_iter(p.el.register_password1.value).data,
						password : p.el.register_password1.value,
						token : p.el.register_token.value
					};
					Import({url:"/json.register",method:"get",json:true,data:args})
						.done(function(data) {
							if(data.result) {
								localStorage.setItem("csrf-cookie",data.csrf_cookie);
								localStorage.setItem("username",username);
								History.go("#home");
								
							} else {
								var error = p.el.lblErrorMessage;
								error.innerHTML = data.message;
								error.style.display = "";
							}
							p.el.register_username.value = "";
							p.el.register_password1.value = "";
							p.el.register_password2.value = "";
							p.el.register_token.value = "";
						})
						.fail(function(error) {
							var error = p.el.lblErrorMessage;
							error.innerHTML = error.message;
							error.style.display = "";
						})
						.send();
				} else {
					var error = p.el.lblErrorMessage;
					error.innerHTML = "please, retype password correctly.";
					error.style.display = "";
					register_password1.value = "";
					register_password2.value = "";
					//alert("please, retype password correctly.");
				}
			}
			$(p.el.login_username,{
				events : {
					keydown : function(e) {
						if(e.keyCode==13) { submit_login(); }
					}
				}
			});
			$(p.el.login_password,{
				events : {
					keydown : function(e) {
						if(e.keyCode==13) { submit_login(); }
					}
				}
			});
			$(p.el.login_btn,{
				events : {
					click : function() {
						submit_login();
					}
				}
			});
			$(p.el.register_btn,{
				events : {
					click : function() {
						submit_register();
					}
				}
			});
			
			
			var start_page = "home";
			var csrf_cookie = localStorage.getItem("csrf-cookie");
			if(csrf_cookie == null || csrf_cookie == undefined || csrf_cookie == "undefined") {
				
			} else {
				Import({url:"/json.login",method:"get",json:true,data:{csrf_cookie:csrf_cookie}})
					.done(function(data) {
						// if fail to authenticate then load login screen
						if(data.result) {
							UI.History.go("#home");
						} else {
							
						}
					})
					.fail(function(error) {
					})
					.send();
					
			}
			
			UI.Window.on("resize",function() {
				console.log("window resize");
				var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
				h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
				
				$(p.el.panelLogin,{
					left: ((w/2-125)>>>0)+"px",
					top : ((h/2-145)>>>0)+"px"
				});
				
			});
		
		
		})
		.send();
	
	
});