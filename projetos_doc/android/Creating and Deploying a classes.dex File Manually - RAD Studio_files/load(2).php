var mediaWikiLoadStart=(new Date()).getTime();function isCompatible(ua){if(ua===undefined){ua=navigator.userAgent;}return!((ua.indexOf('MSIE')!==-1&&parseFloat(ua.split('MSIE')[1])<6)||(ua.indexOf('Firefox/')!==-1&&parseFloat(ua.split('Firefox/')[1])<3)||ua.match(/BlackBerry[^\/]*\/[1-5]\./)||ua.match(/webOS\/1\.[0-4]/)||ua.match(/PlayStation/i)||ua.match(/SymbianOS|Series60/)||ua.match(/NetFront/)||ua.match(/Opera Mini/)||ua.match(/S40OviBrowser/)||(ua.match(/Glass/)&&ua.match(/Android/)));}var startUp=function(){mw.config=new mw.Map(true);mw.loader.addSource({"local":{"loadScript":"/RADStudio/Seattle/e/load.php","apiScript":"/RADStudio/Seattle/e/api.php"}});mw.loader.register([["site","1476884894",[],"site"],["noscript","1476884894",[],"noscript"],["startup","1476884894",[],"startup"],["filepage","1476884894"],["user.groups","1476884894",[],"user"],["user","1476884894",[],"user"],["user.cssprefs","1475717424",["mediawiki.user"],"private"],["user.options","1475717424",[],"private"],[
"user.tokens","1475717424",[],"private"],["mediawiki.language.data","1475717424",["mediawiki.language.init"]],["mediawiki.skinning.elements","1476884894"],["mediawiki.skinning.content","1476884894"],["mediawiki.skinning.interface","1476884894"],["skins.cologneblue","1476884894"],["skins.modern","1476884894"],["skins.vector.styles","1476884894"],["skins.monobook.styles","1476884894"],["skins.vector.js","1476884894",["jquery.throttle-debounce"]],["skins.vector.collapsibleNav","1476884894",["jquery.client","jquery.cookie","jquery.tabIndex"]],["jquery","1476884894"],["jquery.appear","1476884894"],["jquery.arrowSteps","1476884894"],["jquery.async","1476884894"],["jquery.autoEllipsis","1476884894",["jquery.highlightText"]],["jquery.badge","1476884894",["mediawiki.language"]],["jquery.byteLength","1476884894"],["jquery.byteLimit","1476884894",["jquery.byteLength"]],["jquery.checkboxShiftClick","1476884894"],["jquery.chosen","1476884894"],["jquery.client","1476884894"],["jquery.color",
"1476884894",["jquery.colorUtil"]],["jquery.colorUtil","1476884894"],["jquery.cookie","1476884894"],["jquery.delayedBind","1476884894"],["jquery.expandableField","1476884894"],["jquery.farbtastic","1476884894",["jquery.colorUtil"]],["jquery.footHovzer","1476884894"],["jquery.form","1476884894"],["jquery.fullscreen","1476884894"],["jquery.getAttrs","1476884894"],["jquery.hidpi","1476884894"],["jquery.highlightText","1476884894",["jquery.mwExtension"]],["jquery.hoverIntent","1476884894"],["jquery.json","1476884894"],["jquery.localize","1476884894"],["jquery.makeCollapsible","1476884894"],["jquery.mockjax","1476884894"],["jquery.mw-jump","1476884894"],["jquery.mwExtension","1476884894"],["jquery.placeholder","1476884894"],["jquery.qunit","1476884894"],["jquery.qunit.completenessTest","1476884894",["jquery.qunit"]],["jquery.spinner","1476884894"],["jquery.jStorage","1476884894",["jquery.json"]],["jquery.suggestions","1476884894",["jquery.highlightText"]],["jquery.tabIndex","1476884894"],[
"jquery.tablesorter","1476884894",["jquery.mwExtension","mediawiki.language.months"]],["jquery.textSelection","1476884894",["jquery.client"]],["jquery.throttle-debounce","1476884894"],["jquery.validate","1476884894"],["jquery.xmldom","1476884894"],["jquery.tipsy","1476884894"],["jquery.ui.core","1476884894",[],"jquery.ui"],["jquery.ui.widget","1476884894",[],"jquery.ui"],["jquery.ui.mouse","1476884894",["jquery.ui.widget"],"jquery.ui"],["jquery.ui.position","1476884894",[],"jquery.ui"],["jquery.ui.draggable","1476884894",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.droppable","1476884894",["jquery.ui.core","jquery.ui.draggable","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.resizable","1476884894",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.selectable","1476884894",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.sortable","1476884894",["jquery.ui.core",
"jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.accordion","1476884894",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.autocomplete","1476884894",["jquery.ui.core","jquery.ui.position","jquery.ui.widget"],"jquery.ui"],["jquery.ui.button","1476884894",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.datepicker","1476884894",["jquery.ui.core"],"jquery.ui"],["jquery.ui.dialog","1476884894",["jquery.ui.button","jquery.ui.core","jquery.ui.draggable","jquery.ui.mouse","jquery.ui.position","jquery.ui.resizable","jquery.ui.widget"],"jquery.ui"],["jquery.ui.progressbar","1476884894",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.slider","1476884894",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.tabs","1476884894",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.effects.core","1476884894",[],"jquery.ui"],["jquery.effects.blind","1476884894",["jquery.effects.core"],"jquery.ui"],[
"jquery.effects.bounce","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.clip","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.drop","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.explode","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fade","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fold","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.highlight","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.pulsate","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.scale","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.shake","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.slide","1476884894",["jquery.effects.core"],"jquery.ui"],["jquery.effects.transfer","1476884894",["jquery.effects.core"],"jquery.ui"],["moment","1476884894"],["mediawiki","1476884894"],["mediawiki.api","1476884894",["mediawiki.util"]],[
"mediawiki.api.category","1476884894",["mediawiki.Title","mediawiki.api"]],["mediawiki.api.edit","1476884894",["mediawiki.Title","mediawiki.api","user.tokens"]],["mediawiki.api.login","1476884894",["mediawiki.api"]],["mediawiki.api.parse","1476884894",["mediawiki.api"]],["mediawiki.api.watch","1476884894",["mediawiki.api","user.tokens"]],["mediawiki.debug","1476884894",["jquery.footHovzer","jquery.tipsy"]],["mediawiki.debug.init","1476884894",["mediawiki.debug"]],["mediawiki.feedback","1476884894",["jquery.ui.dialog","mediawiki.Title","mediawiki.api.edit","mediawiki.jqueryMsg"]],["mediawiki.hidpi","1476884894",["jquery.hidpi"]],["mediawiki.hlist","1476884894",["jquery.client"]],["mediawiki.htmlform","1476884894"],["mediawiki.icon","1476884894"],["mediawiki.inspect","1476884894",["jquery.byteLength","jquery.json"]],["mediawiki.notification","1476884894",["mediawiki.page.startup"]],["mediawiki.notify","1476884894"],["mediawiki.searchSuggest","1476884894",["jquery.client",
"jquery.placeholder","jquery.suggestions","mediawiki.api"]],["mediawiki.Title","1476884894",["jquery.byteLength","mediawiki.util"]],["mediawiki.toc","1476884894",["jquery.cookie"]],["mediawiki.Uri","1476884894"],["mediawiki.user","1476884894",["jquery.cookie","mediawiki.api","user.options","user.tokens"]],["mediawiki.util","1476884894",["jquery.client","jquery.mwExtension","mediawiki.notify","mediawiki.toc"]],["mediawiki.action.edit","1476884894",["jquery.byteLimit","jquery.textSelection","mediawiki.action.edit.styles"]],["mediawiki.action.edit.styles","1476884894"],["mediawiki.action.edit.collapsibleFooter","1476884894",["jquery.cookie","jquery.makeCollapsible","mediawiki.icon"]],["mediawiki.action.edit.preview","1476884894",["jquery.form","jquery.spinner","mediawiki.action.history.diff"]],["mediawiki.action.history","1476884894",[],"mediawiki.action.history"],["mediawiki.action.history.diff","1476884894",[],"mediawiki.action.history"],["mediawiki.action.view.dblClickEdit",
"1476884894",["mediawiki.page.startup","mediawiki.util"]],["mediawiki.action.view.metadata","1476884894"],["mediawiki.action.view.postEdit","1476884894",["jquery.cookie","mediawiki.jqueryMsg"]],["mediawiki.action.view.redirectToFragment","1476884894",["jquery.client"]],["mediawiki.action.view.rightClickEdit","1476884894"],["mediawiki.action.edit.editWarning","1476884894",["mediawiki.jqueryMsg"]],["mediawiki.action.watch.ajax","1475717424",["mediawiki.page.watch.ajax"]],["mediawiki.language","1476884894",["mediawiki.cldr","mediawiki.language.data"]],["mediawiki.cldr","1476884894",["mediawiki.libs.pluralruleparser"]],["mediawiki.libs.pluralruleparser","1476884894"],["mediawiki.language.init","1476884894"],["mediawiki.jqueryMsg","1476884894",["mediawiki.language","mediawiki.util"]],["mediawiki.language.months","1476884894",["mediawiki.language"]],["mediawiki.libs.jpegmeta","1476884894"],["mediawiki.page.gallery","1476884894"],["mediawiki.page.ready","1476884894",[
"jquery.checkboxShiftClick","jquery.makeCollapsible","jquery.mw-jump","jquery.placeholder","mediawiki.util"]],["mediawiki.page.startup","1476884894",["mediawiki.util"]],["mediawiki.page.patrol.ajax","1476884894",["jquery.spinner","mediawiki.Title","mediawiki.api","mediawiki.notify","mediawiki.page.startup","mediawiki.util","user.tokens"]],["mediawiki.page.watch.ajax","1476884894",["jquery.mwExtension","mediawiki.api.watch","mediawiki.notify","mediawiki.page.startup","mediawiki.util"]],["mediawiki.page.image.pagination","1476884894",["jquery.spinner","mediawiki.Uri","mediawiki.util"]],["mediawiki.special","1476884894"],["mediawiki.special.block","1476884894",["mediawiki.util"]],["mediawiki.special.changeemail","1476884894",["mediawiki.util"]],["mediawiki.special.changeslist","1476884894"],["mediawiki.special.changeslist.legend","1476884894"],["mediawiki.special.changeslist.legend.js","1476884894",["jquery.cookie","jquery.makeCollapsible"]],["mediawiki.special.changeslist.enhanced",
"1476884894"],["mediawiki.special.movePage","1476884894",["jquery.byteLimit"]],["mediawiki.special.pagesWithProp","1476884894"],["mediawiki.special.preferences","1476884894",["mediawiki.language"]],["mediawiki.special.recentchanges","1476884894",["mediawiki.special"]],["mediawiki.special.search","1476884894"],["mediawiki.special.undelete","1476884894"],["mediawiki.special.upload","1476884894",["mediawiki.libs.jpegmeta","mediawiki.util"]],["mediawiki.special.userlogin.common.styles","1476884894"],["mediawiki.special.userlogin.signup.styles","1476884894"],["mediawiki.special.userlogin.login.styles","1476884894"],["mediawiki.special.userlogin.common.js","1476884894"],["mediawiki.special.userlogin.signup.js","1476884894",["jquery.throttle-debounce","mediawiki.api","mediawiki.jqueryMsg"]],["mediawiki.special.javaScriptTest","1476884894",["mediawiki.Uri"]],["mediawiki.special.version","1476884894"],["mediawiki.legacy.ajax","1476884894",["mediawiki.legacy.wikibits","mediawiki.util"]],[
"mediawiki.legacy.commonPrint","1476884894"],["mediawiki.legacy.config","1476884894",["mediawiki.legacy.wikibits"]],["mediawiki.legacy.protect","1476884894",["jquery.byteLimit"]],["mediawiki.legacy.shared","1476884894"],["mediawiki.legacy.oldshared","1476884894"],["mediawiki.legacy.upload","1476884894",["jquery.spinner","mediawiki.Title","mediawiki.api","mediawiki.util"]],["mediawiki.legacy.wikibits","1476884894",["mediawiki.util"]],["mediawiki.ui","1476884894"],["mediawiki.ui.button","1476884894"],["oojs","1476884894"],["oojs-ui","1476884894",["oojs"]],["ext.geshi.local","1476884894"],["ext.nuke","1476884894"],["jquery.wikiEditor","1476884894",["jquery.client","jquery.textSelection"],"ext.wikiEditor"],["jquery.wikiEditor.dialogs","1476884894",["jquery.tabIndex","jquery.ui.button","jquery.ui.dialog","jquery.ui.draggable","jquery.ui.resizable","jquery.wikiEditor","jquery.wikiEditor.toolbar"],"ext.wikiEditor"],["jquery.wikiEditor.dialogs.config","1476884894",["jquery.suggestions",
"jquery.wikiEditor","jquery.wikiEditor.dialogs","jquery.wikiEditor.toolbar.i18n","mediawiki.Title","mediawiki.jqueryMsg"],"ext.wikiEditor"],["jquery.wikiEditor.preview","1476884894",["jquery.wikiEditor"],"ext.wikiEditor"],["jquery.wikiEditor.previewDialog","1476884894",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.publish","1476884894",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar","1476884894",["jquery.wikiEditor","jquery.wikiEditor.toolbar.i18n"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar.config","1476884894",["jquery.async","jquery.cookie","jquery.wikiEditor","jquery.wikiEditor.toolbar","jquery.wikiEditor.toolbar.i18n"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar.i18n","1475717424",[],"ext.wikiEditor"],["ext.wikiEditor","1476884894",["jquery.wikiEditor"],"ext.wikiEditor"],["ext.wikiEditor.dialogs","1476884894",["ext.wikiEditor","ext.wikiEditor.toolbar","jquery.wikiEditor.dialogs",
"jquery.wikiEditor.dialogs.config"],"ext.wikiEditor"],["ext.wikiEditor.preview","1476884894",["ext.wikiEditor","jquery.wikiEditor.preview"],"ext.wikiEditor"],["ext.wikiEditor.previewDialog","1476884894",["ext.wikiEditor","jquery.wikiEditor.previewDialog"],"ext.wikiEditor"],["ext.wikiEditor.publish","1476884894",["ext.wikiEditor","jquery.wikiEditor.publish"],"ext.wikiEditor"],["ext.wikiEditor.tests.toolbar","1476884894",["ext.wikiEditor.toolbar"],"ext.wikiEditor"],["ext.wikiEditor.toolbar","1476884894",["ext.wikiEditor","jquery.wikiEditor.toolbar","jquery.wikiEditor.toolbar.config"],"ext.wikiEditor"],["ext.wikiEditor.toolbar.hideSig","1476884894",[],"ext.wikiEditor"],["ext.checkUser","1476884894",["mediawiki.util"]],["ext.cite","1476884894"],["ext.cite.popups","1476884894",["jquery.tooltip"]],["jquery.tooltip","1476884894"],["ext.rtlcite","1476884894"],["ext.MsUpload","1476884894",["jquery.ui.progressbar"]],["skins.duobook2","1476884894"],["skins.duobook","1476884894"],["skins.f",
"1476884894"],["skins.printbook","1476884894",["jquery.switch"]],["ext.treeandmenu","1476884894"]]);mw.config.set({"wgLoadScript":"/RADStudio/Seattle/e/load.php","debug":false,"skin":"duobook2","stylepath":"/RADStudio/Seattle/e/skins","wgUrlProtocols":"http\\:\\/\\/|https\\:\\/\\/|ftp\\:\\/\\/|ftps\\:\\/\\/|ssh\\:\\/\\/|sftp\\:\\/\\/|irc\\:\\/\\/|ircs\\:\\/\\/|xmpp\\:|sip\\:|sips\\:|gopher\\:\\/\\/|telnet\\:\\/\\/|nntp\\:\\/\\/|worldwind\\:\\/\\/|mailto\\:|tel\\:|sms\\:|news\\:|svn\\:\\/\\/|git\\:\\/\\/|mms\\:\\/\\/|bitcoin\\:|magnet\\:|urn\\:|geo\\:|\\/\\/","wgArticlePath":"/RADStudio/Seattle/e/load.php/$1","wgScriptPath":"/RADStudio/Seattle/e","wgScriptExtension":".php","wgScript":"/RADStudio/Seattle/e/index.php","wgSearchType":"LuceneSearch","wgVariantArticlePath":false,"wgActionPaths":{},"wgServer":"http://docwiki.embarcadero.com","wgUserLanguage":"en","wgContentLanguage":"en","wgVersion":"1.23.13","wgEnableAPI":true,"wgEnableWriteAPI":true,"wgMainPageTitle":"Main Page",
"wgFormattedNamespaces":{"-2":"Media","-1":"Special","0":"","1":"Talk","2":"User","3":"User talk","4":"RAD Studio","5":"RAD Studio talk","6":"File","7":"File talk","8":"MediaWiki","9":"MediaWiki talk","10":"Template","11":"Template talk","12":"Help","13":"Help talk","14":"Category","15":"Category talk","101":"Internal"},"wgNamespaceIds":{"media":-2,"special":-1,"":0,"talk":1,"user":2,"user_talk":3,"rad_studio":4,"rad_studio_talk":5,"file":6,"file_talk":7,"mediawiki":8,"mediawiki_talk":9,"template":10,"template_talk":11,"help":12,"help_talk":13,"category":14,"category_talk":15,"internal":101,"image":6,"image_talk":7,"project":4,"project_talk":5},"wgContentNamespaces":[0],"wgSiteName":"RAD Studio","wgFileExtensions":["png","gif","jpg","jpeg","ppt","pdf","doc","psd","mp3","xls","zip","swf","odt","odc","odp","odg","mpp","bmp","svg"],"wgDBname":"wikidb","wgFileCanRotate":true,"wgAvailableSkins":{"duobook2":"DuoBook2","duobook":"DuoBook","f":"F","printbook":"PrintBook","vector":"Vector",
"modern":"Modern","cologneblue":"CologneBlue","monobook":"MonoBook"},"wgExtensionAssetsPath":"/RADStudio/Seattle/e/extensions","wgCookiePrefix":"wikidb_wiki_shared_","wgResourceLoaderMaxQueryLength":-1,"wgCaseSensitiveNamespaces":[],"wgLegalTitleChars":" %!\"$\u0026'()*,\\-./0-9:;=?@A-Z\\\\\\^_`a-z~+\\u0080-\\uFFFF","wgResourceLoaderStorageVersion":1,"wgResourceLoaderStorageEnabled":false,"wgWikiEditorMagicWords":{"redirect":"#REDIRECT","img_right":"right","img_left":"left","img_none":"none","img_center":"center","img_thumbnail":"thumbnail","img_framed":"framed","img_frameless":"frameless"}});};if(isCompatible()){document.write("\u003Cscript src=\"/RADStudio/Seattle/e/load.php?debug=false\u0026amp;lang=en\u0026amp;modules=jquery%2Cmediawiki\u0026amp;only=scripts\u0026amp;skin=duobook2\u0026amp;version=20161019T134814Z\"\u003E\u003C/script\u003E");};
/* cache key: wikidb-rad_seattle_en_:resourceloader:filter:minify-js:7:440911f7f7fe49ec4d7930f0969108f4 */