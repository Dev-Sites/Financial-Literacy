// JavaScript Document
// based on core.js function from 703 Food Safety Toolbox
//ADD IN NEW IF STATEMENT FOR ANY NEEDED EXTRA WINDOW OPTION

function popUp(newPage,popMode,pX,pY,pW,pH,pScroll,pResize,pTool,pLoc,pMenu)  {
if(!pX){
//default settings
pX=0
pY=0
pW=610
pH=460
pScroll = "AUTO"
pResize = "NO"
pTool= 0
pLoc=0
pMenu=1
}	
	if(popMode=="flash_version"){
		pX = 50
		pY = 50
		pW = 685
		pH = 520
		pScroll = "no"
		pResize = "yes"
		pTool=0
		pMenu=0
		
	}
	if(popMode=="financing"){
		pX = 50
		pY = 50
		pW = 380
		pH = 230
		pScroll = "no"
		pResize = "yes"
		pTool=0
		pMenu=1		
	}
	
	if(popMode=="text_version" || popMode=="glossary"){
		pX = 50
		pY = 50
		pW = 500
		pH = 350
		pScroll = "yes"
		pResize = "yes"
	}
	if(popMode=="rpl"){
		pX = 200
		pY = 50
		pW = 800
		pH = 600
		pScroll = "yes"
		pResize = "yes"
		pTool=1
		pMenu=1
	}
	if(popMode=="support" || popMode=="index"){
		pX = 200
		pY = 50
		pW = 900
		pH = 600
		pScroll = "yes"
		pResize = "yes"
		pTool=1
		pMenu=1
	}
	
	var popProperties = "width=" + pW + ", height=" + pH + ", left="+pX+", top="+pY+", scrollbars="+pScroll+" ,resizable="+pResize+",toolbar="+pTool+", location="+pLoc+", menubar="+pMenu+"";

	newWindow = window.open(newPage, popMode, popProperties);
	newWindow.focus();

}

function closeWin() {
	window.close();
}
