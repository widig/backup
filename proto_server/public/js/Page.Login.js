
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
	var p = origin_lt_container.elementNewPacket(
		"<div id=\"panelLogin\" style=\"position:absolute;left:"+(w/2-160)+"px;top:"+(h/2-120)+"px;width:320px;height:240px;border:solid 1px #000;background-color:#ec3;\">"+
			
			/*
				cartao 320px X 240px
				
				qual o tamanho do cache da memória humana no tempo? quanto tempo de história pode ser contada de modo fidedigna?
			*/
			"<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\" style=\"position:absolute;left:40px;width:320px;height:240px;top:30px;\">"+
				"<tr><td></td><td></td><td></td><td></td><td></td></tr>"+
				"<tr><td></td><td></td><td></td><td></td><td></td></tr>"+
				"<tr><td></td><td></td><td height=\"200\" style=\"font-size:10px;\"><text value=\"demonstration screen\"/></td><td></td><td></td></tr>"+
				"<tr><td></td><td></td><td></td><td></td><td></td></tr>"+
				"<tr><td></td><td></td><td></td><td></td><td></td></tr>"+
			"</table>"+
			"<table cellpadding=\"0\" cellspacing=\"0\" style=\"position:absolute;left:60px;top:280px;\">"+
				"<tr>"+
					"<td style=\"padding:20px;\">"+
					"<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\">"+
						"<tr>"+
						"<td colspan=\"2\" style=\"font-family:Tahoma;font-size:30px;\"><text value=\"Acesso\"/></td>"+
						"</tr>"+
						"<tr>" + 
							"<td align=\"right\" valign=\"top\" style=\"\"><text value=\"usuario:\"/></td>"+
							"<td valign=\"top\">"+
								"<input id=\"login_username\" type=\"text\" style=\"border:solid 1px #000;padding:1px;\"/>"+
							"</td>"+
						"</tr>" + 
						"<tr>" + 
							"<td align=\"right\" valign=\"top\"><text value=\"senha:\"/></td>"+
							"<td valign=\"top\"><input id=\"login_password\" type=\"password\" style=\"border:solid 1px #000;padding:1px;\"/></td>"+
						"</tr>"+
						"<tr>"+
							"<td></td>"+
							"<td id=\"login_btn\" style=\"font-family:Tahoma;font-size:16px;cursor:pointer;\"><text value=\"Acessar\"/></td>"+
						"</tr>"+
						"<tr>"+
							"<td colspan=\"2\" style=\"font-family:Tahoma;font-size:30px;\"><text value=\"Registro\"/></td>"+
						"</tr>"+
						"<tr>"+
							"<td align=\"right\"><text value=\"usuario : \"/></td>"+
							"<td>"+
								"<input id=\"register_username\" type=\"text\" style=\"border:solid 1px #000;padding:1px;\"/>"+
							"</td>"+
						"</tr>"+
						"<tr>"+
							"<td align=\"right\"><text value=\"senha : \"/></td>"+
							"<td>"+
								"<input id=\"register_password1\" type=\"password\" style=\"border:solid 1px #000;padding:1px;\"/>"+
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td align=\"right\"><text value=\"senha : \"/></td>"+
							"<td>"+
								"<input id=\"register_password2\" type=\"password\" style=\"border:solid 1px #000;padding:1px;\"/>"+
							"</td>"+
						"</tr>"+
						"<tr>"+
							"<td align=\"right\"><text value=\"token : \"/></td>"+
							"<td>"+
								"<input id=\"register_token\" type=\"text\" style=\"border:solid 1px #000;padding:1px;\"/>"+
							"</td>"+
						"</tr>"+
						"<tr>"+
							"<td></td>"+
							"<td id=\"register_btn\" style=\"font-family:Tahoma;font-size:16px;cursor:pointer;\"><text value=\"Registrar\"/></td>"+
						"</tr>"+
					"</table>"+
					"</td>"+
				"</tr>"+
			"</table>"+
			"<div id=\"lblErrorMessage\" style=\"position:relative;top:570px;border:solid 1px #f00;background-color:#fff;color:#000;display:none;padding:5px;\"></div>"+
		"</div>"
	);
	
	p.el.login_username.value = "";
	p.el.login_password.value = "";
	function submit_login() {
		var username = p.el.login_username.value;
		Hash.sha3_512_start();
		var args = {
			username : p.el.login_username.value,
			password : Hash.sha3_512_iter(p.el.login_password.value).data
		};
		Import({url:"/json.login",method:"get",json:true,data:args})
			.done(function(data) {
				if(data.result) {
					localStorage.setItem("csrf-cookie",data.csrf_cookie);
					localStorage.setItem("username",username);
					History.go("#home");
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
			Hash.sha3_512_start();
			var args = {
				username : p.el.register_username.value,
				password : Hash.sha3_512_iter(p.el.register_password1.value).data,
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
					History.go("#home");
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
			left: (w/2-160)+"px",
			top : (h/2-120)+"px"
		});
		
	});
	
});