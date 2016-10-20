
Class.define("UI");
UI = {}; // UI.init and UI.load are the main


DOMElementCount = Class.create("XMath.UnitCounter");

TabIndexCount = Class.create("XMath.UnitCounter");


var ____HtmlTags2 = [
	"a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont",
	"bdi","bdo","big","blockquote","body","br","button","canvas","center","cite","code","col",
	"colgroup","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed",
	"fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3",
	"h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label",
	"legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript",
	"object","ol","opgroup","option","output","p","param","pre","progress","q","rp","rt","ruby",
	"s","samp","script","section","select","small","source","span","strike","strong","style","sub",
	"summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","u","ul",
	"var","video","wbr",
	
	"svg","path"
];
var ____SvgTags2 = [
	"svg",
	"a",
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animate",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"circle",
	"clipPath",
	"color-profile",
	"cursor",
	"defs",
	"desc",
	"ellipse",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"filter",
	"font",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignObject",
	"feMorphology",
	"g",
	"glyph",
	"glyphRef",
	"hkern",
	"image",
	"line",
	"linearGradient",
	"marker",
	"mask",
	"metadata",
	"missing-glyph",
	"mpath",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialGradient",
	"rect",
	"script",
	"set",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textPath",
	"title",
	"tref",
	"tspan",
	"use",
	"view",
	"vkern"
]
____HtmlTags2.reverse();
Object.defineProperty(this, "____HtmlTags",{
	value : ____HtmlTags2,
	writable : false,
	configurable : false,
	enumerable : false
});
____SvgTags2.reverse();
Object.defineProperty(this,"____SvgTags",{
	value : ____SvgTags2,
	writable : false,
	configurable : false,
	enumerable : false
});
//console.log("???? NOT WINDOW THIS-->",this);


