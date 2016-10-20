

Router.addPage({name:"index"},function(args,template) { // loaded presentation, communications panel
	UI.Body.canSelect(false);
	var self = this;
	var p = null;
	with(Router.getPage()) {
		with(el.style) {
			position = "absolute";
			left = "0px";
			top = "0px";
			overflow = "hidden";
		}
		UI.Body.get().style.backgroundColor = "#4395d1";
		
		var ela = $.elementNewPacket(
			'<UI.Desktop id="a" x="100" y="100" width="1200" height="600" bgcolor="#4395d1">'+
				'<div id="Background" style="position:relative;left:0px;top:0px;width:100%;height:100%;">'+
					'<table id="b" style="position:relative;left:0px;top:0px;width:90px;height:112px;">'+
						'<tr>'+
							'<td valign="bottom" align="center">'+
								'<img src="resources/web.png" style="width:48px;"/>'+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td valign="top" align="center">'+
								'namelink'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</div>'+
				'<UI.WindowDialog id="janela1" x="200" y="10" width="300" height="200">'+
					'<center>'+
						"<div style=\"color:red;\">Hello World of UI!</div>"+
						"<div>name:<input id=\"txtName\" type=\"text\"/></div>"+
						"<div><input id=\"btnSend\" type=\"button\" value=\"send\"></input></div>"+
						"<div><input id=\"btnMoveable\" type=\"button\" value=\"moveable\"/></div>"+
						"<div><input id=\"btnFreeze\" type=\"button\" value=\"freeze\"/></div>"+
					"</center>"+
				'</UI.WindowDialog>'+
			'</UI.Desktop>'
		);
		
		var el = ela.el.janela1;
		el.setTitle("Titulo1");
		var p0 = ela;//el.elementNewPacket();
		BrowserTools.setStyle(p0.el.btnSend,{
			events : {
				click : function() {
					alert(p0.el.txtName.value);
				}
			}
		});
		BrowserTools.setStyle(p0.el.btnMoveable,{
			events : {
				click : function() {
					el.setAttribute("moveable","true");
				}
			}
		});
		BrowserTools.setStyle(p0.el.btnFreeze,{
			events : {
				click : function() {
					el.setAttribute("moveable","false");
				}
			}
		});
		
		//console.log(ela.$.a);
		var p = ela.$.a.complex.elementNewPacket('<UI.WindowDialog id="janela" moveable="true"><div id="teste">teste</div></UI.WindowDialog>');
		p.el.teste.style.backgroundColor = "#f00";
		//console.log(p);
		var bounds = UI.Window.getBounds();
		p.el.janela.setSize(380,360);
		p.el.janela.setPosition(bounds[0]/2 - 10,bounds[1]/2 - 180);
		p.el.janela.setTitle("Titulo2");
		var p2 = p.el.janela.elementNewPacket('<UI.WindowDialog id="janela1" width="150" height="150" title="janela"/>');
		//p2.el.janela1.setSize(150,150);
		p2.el.janela1.setPosition(10,10);
		var p3 = p.el.janela.elementNewPacket('<UI.WindowDialog id="janela2"/>');
		p3.el.janela2.setSize(150,150);
		p3.el.janela2.setPosition(170,10);
		var p4 = p.el.janela.elementNewPacket('<UI.WindowDialog id="janela3" title="janela"/>');
		p4.el.janela3.setSize(150,150);
		p4.el.janela3.setPosition(10,170);
		var p5 = p.el.janela.elementNewPacket('<UI.WindowDialog id="janela4" title="janela">'+
			'<div id="link1" style="background-color:black;color:white;">hello</div>'+
			'</UI.WindowDialog>');
		p5.el.janela4.setSize(150,150);
		p5.el.janela4.setPosition(170,170);
		var count = 0;
		BrowserTools.setStyle(p5.el.link1,{
			events : {
				click : function() {
					var p6 = p4.el.janela3.elementNewPacket(
						'<div id="link'+count+'" style="background-color:black;color:white;">hello</div>'
					);
					(function(count) {
						BrowserTools.setStyle( p6.el["link"+count], {
							events : {
								mouseover : function() {
									BrowserTools.setStyle(p6.el["link"+count],{
										backgroundColor : "red"
									});
								},
								mouseout : function() {
									BrowserTools.setStyle(p6.el["link"+count],{
										backgroundColor : "black"
									});
								}
								
							}
						});
					})(count);
					count+= 1;
				},
				mouseover : function() {
					BrowserTools.setStyle(p5.el.link1,{
						backgroundColor : "red",
						cursor : "default"
					});
				},
				mouseout : function() {
					BrowserTools.setStyle(p5.el.link1,{
						backgroundColor : "black"
					});
				}
			}
		});
		
	}
	
});