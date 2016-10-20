
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
						"<div id=\"logout_btn\" style=\"position:absolute;left:"+(w-100)+"px;top:0px;padding:10px;background-color:#000;color:#fff;font-family:Impact;font-size:20px;cursor:pointer;\">"+
						"<text value=\"sair\"/>"+
						"</div>"+
						
						"<div id=\"info\" style=\"position:absolute;left:100px;top:0px;padding:10px;background-color:#000;color:#fff;font-family:Impact;font-size:20px;cursor:pointer;\">"+
						"</div>"+
						
						//"<div style=\"padding:10px;width:200px;font-family:Impact;font-size:20px;border-radius:5px;border:solid 2px #000;\"><text value=\"acesso de operador\"/></div>"+
						//"<div style=\"padding:10px;width:200px;font-family:Impact;font-size:20px;border-radius:5px;border:solid 2px #000;\"><text value=\"registro de operadores\"/></div>"
						//"<div style=\"padding:10px;width:200px;font-family:Impact;font-size:20px;border-radius:5px;border:solid 2px #000;\"><text value=\"cadastro de invent\u00e1rio\"/></div>"+
						//"<div style=\"padding:10px;width:200px;font-family:Impact;font-size:20px;border-radius:5px;border:solid 2px #000;\"><text value=\"cadastro de parceria\"/></div>"
						"<div style=\"position:absolute;left:"+(w/2-300)+"px;\">"+
							"<input id=\"query\" type=\"text\" style=\"width:600px;border-radius:5px;border:solid 4px #000;padding:5px;font-family:Tahoma;font-size:22px;\"/>"+
						"</div>" +
						"<div id=\"bodyPanel\" style=\"position:absolute;left:"+(0)+"px;top:50px;\"></div>"+
						"<div id=\"bodyPanel2\" style=\"position:absolute;left:"+(190)+"px;top:50px;\"></div>"
						
					);
					//Import({url:"/js/script.js",method:"get",json:false}) .done(function(data) { eval(data); test(); }) .fail(function(error) { }) .send();
					//require("/js/script.js");
					p.el.info.innerHTML = localStorage.getItem("username");
					
					function submit_query() {
						var csrf = localStorage.getItem("csrf-cookie");
						var args = {
							query : p.el.query.value,
							csrf_cookie : csrf
						};
						Import({url:"/json.parser",method:"get",json:true,data:args})
							.done(function(data) {
								if(data.query == 0) { // fail to parse query
									alert("fail to parse query");
								} else if(data.query == 1) {
									if(data.code==0) {
										alert("sucessfully added");
									} else if(data.code==1) {
										alert("already registered.");
									}
								} else if(data.query == 2) {
									if(data.code==0) {
										alert("found");
									} else if(data.code == 1) {
										alert(data.data.message);
									}
								}
								console.log(JSON.stringify(data));
							})
							.fail(function(data) {
							})
							.send();
					}
					
					$(p.el.query,{
						events : {
							keydown : function(e) {
								if(e.keyCode==13) {
									submit_query();
								}
							}
						}
					});
					
					$(p.el.logout_btn,{
						events : {
							click : function() { 
								var csrf_cookie = localStorage.getItem("csrf-cookie");
								var args = {csrf_cookie:csrf_cookie};
								Import({url:"/json.logout",method:"get",json:true,data:args})
									.done(function(data) {
										if(data.result) {
											localStorage.setItem("csrf-cookie",null);
											delete localStorage["csrf-cookie"];
											localStorage.setItem("username",null);
										}
										History.go("#login");
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
						$(p.el.logout_btn,{
							left : (w-100) + "px"
						});
						
					});
					
					
					
					
					
					
					
					
					
					
					
					console.log("move this to page.login or page.home");
					var body = p.el.bodyPanel;
					var body2 = p.el.bodyPanel2;
					Import({method:"get",json:true,url:"/?action=edit"})
						.done(function(data) {
                      		
							var buttons = {};
							var selected = "";
							function set_order(up,down) {
								up.addEventListener("click",function() {
									alert("up");
								});
								down.addEventListener("click",function() {
									alert("down");
								});
							}
							var menu_container = document.createElement("div");
							menu_container.style.position = "absolute";
							menu_container.style.left = "0px";
							menu_container.style.top = "0px";
							menu_container.style.width = "400px";
							menu_container.style.height = "400px";
							menu_container.style.overflowY = "auto";
							
							for(var x = 0; x < data.files.length;x++) {
								var tbl0 = document.createElement("table");
								tbl0.style.float = "left";
								tbl0.setAttribute("cellpadding",0);
								tbl0.setAttribute("cellspacing",0);
								tbl0.setAttribute("height",22);
								var tr01 = document.createElement("tr");
								var td01 = document.createElement("td");
								td01.style.fontFamily = "Courier New";
								td01.style.fontSize = "5px";
								td01.style.backgroundColor = "black";
								td01.innerHTML = "&nbsp;&nbsp;&nbsp;";
								td01.style.cursor = "default";
								tr01.appendChild(td01);
								tbl0.appendChild(tr01);
								menu_container.appendChild(tbl0);
								
								var tbl = document.createElement("table");
								tbl.style.float = "left";
								tbl.setAttribute("height",15);
								var tr1 = document.createElement("tr");
								tr1.setAttribute("height",7);
								var td1 = document.createElement("td");
								td1.style.backgroundColor = "lime";
								tbl.appendChild(tr1);
								tr1.appendChild(td1);
								var tr2 = document.createElement("tr");
								tr2.setAttribute("height",7);
								var td2 = document.createElement("td");
								td2.style.backgroundColor = "red";
								td2.style.fontFamily = "Courier New";
								td2.style.fontSize = "5px";
								td2.style.cursor = "default";
								td2.innerHTML = "&nbsp;";
								tr2.appendChild(td2);
								tbl.appendChild(tr2);
								menu_container.appendChild(tbl);
								var i = document.createElement("input");
								i.style.float = "left";
								i.style.width = "120px";
								i.setAttribute("type","text");
								i.setAttribute("value",data.files[x]);
								menu_container.appendChild(i);
								var i2 = document.createElement("input");
								i2.style.float = "left";
								i2.setAttribute("type","button");
								i2.setAttribute("value","view");
								buttons[ data.files[x] ] = i2;
								menu_container.appendChild(i2);
								
								set_order(td1,td2);
								var tbl1 = document.createElement("table");
								tbl1.style.float = "left";
								tbl1.setAttribute("cellpadding",0);
								tbl1.setAttribute("cellspacing",0);
								tbl1.setAttribute("height",22);
								var tr11 = document.createElement("tr");
								var td11 = document.createElement("td");
								td11.style.fontFamily = "Courier New";
								td11.style.fontSize = "5px";
								td11.style.backgroundColor = "black";
								td11.innerHTML = "&nbsp;&nbsp;&nbsp;";
								td11.style.cursor = "default";
								tr11.appendChild(td11);
								tbl1.appendChild(tr11);
								menu_container.appendChild(tbl1);
								
								var br = document.createElement("br");
								br.style.lineHeight = "22px";
								menu_container.appendChild(br);
								
								
							}
							
							var editor = CodeMirror(body2,{
								value : "",
								lineNumbers: true
							});
							editor.setSize(w - 200,400);
							editor.display.wrapper.style.border = "solid 1px #000";
							
							function load(target,fileName,fileData) {
								target.addEventListener("click",function() {
									selected = fileName;
									localStorage.setItem("selected",selected);
									editor.setValue(fileData);
								});
							}
							selected = localStorage.getItem("selected");
							for(var x = 0; x < data.files.length;x++) {
								load( buttons[data.files[x]], data.files[x], data.data[ data.files[x] ] );
								if(selected != null && selected !="" && selected == data.files[x]) {
									editor.setValue(data.data[ selected ]);
								}
							}
							var br2 = document.createElement("br");
							menu_container.appendChild(br2);
							var input3 = document.createElement("input");
							input3.setAttribute("type","button");
							input3.setAttribute("value","update");
							menu_container.appendChild(input3);
							input3.addEventListener("click",function() {
								if(selected!="") {
									var args = {
										filename : selected,
										filedata : editor.getValue()
									};
									Import({method:"post",json:true,url:"/?action=update",data:args})
										.done(function(data) {
											//alert(JSON.stringify(data));
										})
										.send();
								
								}
								Import({method:"get",json:true,url:"/action"})
									.done(function(data) {
										//alert(JSON.stringify(data));
									})
									.send();
							});
							var br2 = document.createElement("br");
							menu_container.appendChild(br2);
							
							
							
							body.appendChild(menu_container);
							
						})
						.send();
				} else {
					History.go("#login");
				}
			})
			.fail(function(error) {
			})
			.send();
	}
	
});

