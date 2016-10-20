

var font = (function() {
	var r = {};
	//
	var t = r.translate = {};
	var s = 512;
	
	r["bin1"] = [0,126,195,129,165,129,189,153,195,126,0,0];
	r["bin2"] = [0,126,255,255,219,255,195,231,255,126,0,0];
	r["bin3"] = [0,0,34,119,127,127,127,62,28,8,0,0];
	r["bin4"] = [0,8,28,62,127,127,62,28,8,0,0,0];
	r["bin5"] = [0,24,60,60,255,231,231,24,24,126,0,0];
	r["bin6"] = [0,24,60,126,255,255,126,24,24,126,0,0];
	
	var sfc = function() { return String.fromCharCode(arguments[0]); }
	
	t[1] = sfc(1); // empty smile
	t[2] = sfc(2); // full smile
	t[3] = sfc(3); // heart
	t[4] = sfc(4); // diamond
	t[5] = sfc(5); // club
	t[6] = sfc(6); // spade
	
	r["bin7"] = [0,0,0,0,60,126,126,60,0,0,0,0];
	r["bin9"] = [0,0,60,126,102,66,66,102,126,60,0,0];
	r["bin10"] = [255,255,195,129,153,189,189,153,129,195,255,255];
	r["bin11"] = [0,124,112,92,78,31,51,51,51,30,0,0];
	r["bin12"] = [0,60,102,102,102,60,24,126,24,24,0,0];
	r["bin15"] = [0,0,24,219,126,231,231,126,219,24,0,0];
	r["bin16"] = [0,1,3,7,31,127,31,7,3,1,0,0];
	r["bin17"] = [0,64,96,112,124,127,124,112,96,64,0,0];
	r["bin18"] = [0,24,60,126,24,24,24,126,60,24,0,0];
	r["bin19"] = [0,102,102,102,102,102,102,0,102,102,0,0];
	r["bin20"] = [0,254,219,219,219,222,216,216,216,216,0,0];
	r["bin21"] = [0,126,198,12,60,102,102,60,48,99,126,0];
	r["bin22"] = [0,0,0,0,0,0,0,255,255,255,0,0];
	r["bin23"] = [0,24,60,126,24,24,24,126,60,24,126,0];
	r["bin24"] = [0,24,60,126,24,24,24,24,24,24,0,0];
	r["bin25"] = [0,24,24,24,24,24,24,126,60,24,0,0];
	r["bin26"] = [0,0,0,24,48,127,48,24,0,0,0,0];
	r["bin27"] = [0,0,0,12,6,127,6,12,0,0,0,0];
	r["bin28"] = [0,0,0,3,3,3,255,0,0,0,0,0];
	r["bin29"] = [0,0,0,36,102,255,102,36,0,0,0,0];
	r["bin30"] = [0,0,8,8,28,28,62,62,127,127,0,0];
	r["bin31"] = [0,0,127,127,62,30,28,28,8,8,0,0];
	
	t[7] = sfc(7); t[9] = sfc(9); t[10] = sfc(10);
	t[11] = sfc(11); t[12] = sfc(12); t[15] = sfc(15);
	t[16] = sfc(16); t[17] = sfc(17); t[18] = sfc(18);
	t[19] = sfc(19); t[20] = sfc(20); t[21] = sfc(21);
	t[22] = sfc(22); t[23] = sfc(23); t[24] = sfc(24);
	t[25] = sfc(25); t[26] = sfc(26); t[27] = sfc(27);
	t[28] = sfc(28); t[29] = sfc(29); t[30] = sfc(30);
	t[31] = sfc(31);
	
	r[32] = r[" "] = [0,0,0,0,0,0,0,0,0,0,0,0];
	t[32] = " ";
	

	r[48] = r["0"] = [0,124,198,230,246,214,222,206,198,124,0,0];
	r[49] = r["1"] = [0,16,24,30,24,24,24,24,24,126,0,0];
	r[50] = r["2"] = [0,60,102,102,96,48,24,12,102,126,0,0];
	r[51] = r["3"] = [0,60,102,96,96,56,96,96,102,60,0,0];
	r[52] = r["4"] = [0,96,112,120,108,102,254,96,96,240,0,0];
	r[53] = r["5"] = [0,126,6,6,6,62,96,96,102,60,0,0];
	r[54] = r["6"] = [0,56,12,4,6,62,102,102,102,60,0,0];
	r[55] = r["7"] = [0,254,198,198,192,96,48,24,24,24,0,0];
	r[56] = r["8"] = [0,60,102,102,110,60,118,102,102,60,0,0];
	r[57] = r["9"] = [0,60,102,102,102,124,48,48,24,28,0,0];
	
	t[48] = "0"; t[49] = "1"; t[50] = "2"; t[51] = "3"; t[52] = "4";
	t[53] = "5"; t[54] = "6"; t[55] = "7"; t[56] = "8"; t[57] = "9";
	
	r[65+s] = r["A"] = [0,24,60,102,102,102,126,102,102,102,0,0];
	r[66+s] = r["B"] = [0,126,204,204,204,124,204,204,204,126,0,0];
	r[67+s] = r["C"] = [0,120,204,198,6,6,6,198,204,120,0,0];
	r[68+s] = r["D"] = [0,62,108,204,204,204,204,204,108,62,0,0];
	r[69+s] = r["E"] = [0,254,140,12,76,124,76,12,140,254,0,0];
	r[70+s] = r["F"] = [0,254,140,12,76,124,76,12,12,30,0,0];
	r[71+s] = r["G"] = [0,120,204,198,6,6,230,198,204,248,0,0];
	r[72+s] = r["H"] = [0,102,102,102,102,126,102,102,102,102,0,0];
	r[73+s] = r["I"] = [0,60,24,24,24,24,24,24,24,60,0,0];
	r[74+s] = r["J"] = [0,240,96,96,96,96,102,102,102,60,0,0];
	r[75+s] = r["K"] = [0,206,204,108,108,60,108,108,204,206,0,0];
	r[76+s] = r["L"] = [0,30,12,12,12,12,140,204,204,254,0,0];
	r[77+s] = r["M"] = [0,198,238,254,254,214,198,198,198,198,0,0];
	r[78+s] = r["N"] = [0,198,198,206,222,254,246,230,198,198,0,0];
	r[79+s] = r["O"] = [0,56,108,198,198,198,198,198,108,56,0,0];
	r[80+s] = r["P"] = [0,126,204,204,204,124,12,12,12,30,0,0];
	r[81+s] = r["Q"] = [0,56,108,198,198,198,230,246,124,96,240,0];
	r[82+s] = r["R"] = [0,126,204,204,204,124,108,204,204,206,0,0];
	r[83+s] = r["S"] = [0,60,102,102,6,28,48,102,102,60,0,0];
	r[84+s] = r["T"] = [0,126,90,24,24,24,24,24,24,60,0,0];
	r[85+s] = r["U"] = [0,102,102,102,102,102,102,102,102,60,0,0];
	r[86+s] = r["V"] = [0,102,102,102,102,102,102,102,60,24,0,0];
	r[87+s] = r["W"] = [0,198,198,198,198,214,214,108,108,108,0,0];
	r[88+s] = r["X"] = [0,102,102,102,60,24,60,102,102,102,0,0];
	r[89+s] = r["Y"] = [0,102,102,102,102,60,24,24,24,60,0,0];
	r[90+s] = r["Z"] = [0,254,230,50,48,24,12,140,198,254,0,0];
	
	t[65+s] = "A"; t[66+s] = "B"; t[67+s] = "C"; t[68+s] = "D"; t[69+s] = "E";
	t[70+s] = "F"; t[71+s] = "G"; t[72+s] = "H"; t[73+s] = "I"; t[74+s] = "J";
	t[75+s] = "K"; t[76+s] = "L"; t[77+s] = "M"; t[78+s] = "N"; t[79+s] = "O";
	t[80+s] = "P"; t[81+s] = "Q"; t[82+s] = "R"; t[83+s] = "S"; t[84+s] = "T";
	t[85+s] = "U"; t[86+s] = "V"; t[87+s] = "W"; t[88+s] = "X"; t[89+s] = "Y";
	t[90+s] = "Z";
	
	r[65] = r["a"] = [0,0,0,0,60,96,124,102,102,220,0,0];
	r[66] = r["b"] = [0,14,12,12,124,204,204,204,204,118,0,0];
	r[67] = r["c"] = [0,0,0,0,60,102,6,6,102,60,0,0];
	r[68] = r["d"] = [0,112,96,96,124,102,102,102,102,220,0,0];
	r[69] = r["e"] = [0,0,0,0,60,102,126,6,102,60,0,0];
	r[70] = r["f"] = [0,56,108,12,12,62,12,12,12,30,0,0];
	r[71] = r["g"] = [0,0,0,0,220,102,102,102,124,96,102,60];
	r[72] = r["h"] = [0,14,12,12,108,220,204,204,204,206,0,0];
	r[73] = r["i"] = [0,24,24,0,30,24,24,24,24,126,0,0];
	r[74] = r["j"] = [0,96,96,0,120,96,96,96,96,102,102,60];
	r[75] = r["k"] = [0,14,12,12,204,108,60,108,204,206,0,0];
	r[76] = r["l"] = [0,30,24,24,24,24,24,24,24,126,0,0];
	r[77] = r["m"] = [0,0,0,0,126,214,214,214,214,198,0,0];
	r[78] = r["n"] = [0,0,0,0,62,102,102,102,102,102,0,0];
	r[79] = r["o"] = [0,0,0,0,60,102,102,102,102,60,0,0];
	r[80] = r["p"] = [0,0,0,0,118,204,204,204,204,124,12,30];
	r[81] = r["q"] = [0,0,0,0,220,102,102,102,102,124,96,240];
	r[82] = r["r"] = [0,0,0,0,110,236,220,12,12,30,0,0];
	r[83] = r["s"] = [0,0,0,0,60,102,12,48,102,60,0,0];
	r[84] = r["t"] = [0,0,8,12,126,12,12,12,108,56,0,0];
	r[85] = r["u"] = [0,0,0,0,102,102,102,102,102,220,0,0];
	r[86] = r["v"] = [0,0,0,0,102,102,102,102,60,24,0,0];
	r[87] = r["w"] = [0,0,0,0,198,198,214,214,108,108,0,0];
	r[88] = r["x"] = [0,0,0,0,198,108,56,56,108,198,0,0];
	r[89] = r["y"] = [0,0,0,0,102,102,102,60,48,24,15,0];
	r[90] = r["z"] = [0,0,0,0,126,98,48,12,70,126,0,0];
	
	t[65] = "a"; t[66] = "b"; t[67] = "c"; t[68] = "d"; t[69] = "e";
	t[70] = "f"; t[71] = "g"; t[72] = "h"; t[73] = "i"; t[74] = "j";
	t[75] = "k"; t[76] = "l"; t[77] = "m"; t[78] = "n"; t[79] = "o";
	t[80] = "p"; t[81] = "q"; t[82] = "r"; t[83] = "s"; t[84] = "t";
	t[85] = "u"; t[86] = "v"; t[87] = "w"; t[88] = "x"; t[89] = "y";
	t[90] = "z";
	
	r[96] = r["`"] = r["&#96;"] = r["&grave;"] = [0,6,6,12,0,0,0,0,0,0,0,0];
	
	r["&Aacute;"] = [96,48,0,24,60,102,102,126,102,102,0,0];
	r["Á"] = r["&Aacute;"];
	r["&Eacute;"] = [96,48,0,126,70,6,62,6,70,126,0,0];
	r["É"] = r["&Eacute;"];
	r["&Iacute;"] = [48,24,0,60,24,24,24,24,24,60,0,0];
	r["Í"] = r["&Iacute;"];
	r["&Oacute;"] = [48,24,0,60,102,102,102,102,102,60,0,0];
	r["Ó"] = r["&Oacute;"];
	r["&Uacute;"] = [48,24,0,102,102,102,102,102,102,60,0,0];
	r["Ú"] = r["&Uacute;"];
	
	r["&aacute;"] = [96,48,24,0,60,96,124,102,102,220,0,0];
	r["á"] = r["&aacute;"];
	r["&eacute;"] = [96,48,24,0,60,102,126,6,102,60,0,0];
	r["é"] = r["&eacute;"];
	r["&iacute;"] = [96,48,24,0,30,24,24,24,24,126,0,0];
	r["í"] = r["&iacute;"];
	r["&oacute;"] = [96,48,24,0,60,102,102,102,102,60,0,0];
	r["ó"] = r["&oacute;"];
	r["&uacute;"] = [96,48,24,0,102,102,102,102,102,220,0,0];
	r["ú"] = r["&uacute;"];
	r["&Agrave;"] = [12,24,0,24,60,102,102,126,102,102,0,0];
	r["À"] = r["&Agrave;"];
	r["&Egrave;"] = [12,24,0,126,70,6,62,6,70,126,0,0];
	r["È"] = r["&Egrave;"];
	r["&Igrave;"] = [12,24,0,60,24,24,24,24,24,60,0,0];
	r["Ì"] = r["&Igrave;"];
	r["&Ograve;"] = [12,24,0,60,102,102,102,102,102,60,0,0];
	r["Ò"] = r["&Ograve;"];
	r["&Ugrave;"] = [12,24,0,102,102,102,102,102,102,60,0,0];
	r["Ù"] = r["&ugrave;"];
	r["&agrave;"] = [6,12,24,0,60,96,124,102,102,220,0,0];
	r["à"] = r["&agrave;"];
	r["&egrave;"] = [6,12,24,0,60,102,126,6,102,60,0,0];
	r["è"] = r["&egrave;"];
	r["&igrave;"] = [6,12,24,0,30,24,24,24,24,126,0,0];
	r["ì"] = r["&igrave;"];
	r["&ograve;"] = [6,12,24,0,60,102,102,102,102,60,0,0];
	r["ò"] = r["&ograve;"];
	r["&ugrave;"] = [6,12,24,0,102,102,102,102,102,220,0,0];
	r["ù"] = r["&ugrave;"];
	r["&atilde;"] = [0,220,118,0,60,96,124,102,102,220,0,0];
	r["ã"] = r["&atilde;"];
	r["&otilde;"] = [0,220,118,0,60,102,102,102,102,60,0,0];
	r["õ"] = r["&otilde;"];
	r["&ccedil;"] = [0,0,0,0,60,102,6,6,102,60,24,12];
	r["ç"] = r["&ccedil;"];
	r["&Ccedil;"] = [0,120,204,198,6,6,6,198,204,120,48,24];
	r["Ç"] = r["&Ccedil;"];
	r["&Auml;"] = [0,102,0,24,60,102,102,126,102,102,0,0];
	r["Ä"] = r["&Auml;"];
	r["&Euml;"] = [0,102,0,126,70,6,62,6,70,126,0,0];
	r["Ë"] = r["&Euml;"];
	r["&Iuml;"] = [0,102,0,60,24,24,24,24,24,60,0,0];
	r["Ï"] = r["&Iuml;"];
	r["&Ouml;"] = [0,102,0,60,102,102,102,102,102,60,0,0];
	r["Ö"] = r["&Ouml;"];
	r["&Uuml;"] = [0,102,0,102,102,102,102,102,102,60,0,0];
	r["Ü"] = r["&Uuml;"];
	r["&auml;"] = [0,102,102,0,60,96,124,102,102,220,0,0];
	r["ä"] = r["&auml;"];
	r["&euml;"] = [0,102,102,0,60,102,126,6,102,60,0,0];
	r["ë"] = r["&euml;"];
	r["&iuml;"] = [0,102,102,0,30,24,24,24,24,126,0,0];
	r["ï"] = r["&iuml;"];
	r["&ouml;"] = [0,102,102,0,60,102,102,102,102,60,0,0];
	r["ö"] = r["&ouml;"];
	r["&uuml;"] = [0,102,102,0,102,102,102,102,102,220,0,0]
	r["ü"] = r["&uuml;"];
	r["&Acirc;"] = [24,36,0,24,60,102,102,126,102,102,0,0];
	r["Â"] = r["&Acirc;"];
	r["&Ecirc;"] = [24,36,0,126,70,6,62,6,70,126,0,0];
	r["Ê"] = r["&Ecirc;"];
	r["&Icirc;"] = [24,36,0,60,24,24,24,24,24,60,0,0];
	r["Î"] = r["&Icirc;"];
	r["&Ocirc;"] = [24,36,0,60,102,102,102,102,102,60,0,0];
	r["Ô"] = r["&Ocirc;"];
	r["&Ucirc;"] = [24,36,0,102,102,102,102,102,102,60,0,0];
	r["Û"] = r["&Ucirc;"];
	r["&acirc;"] = [24,36,66,0,60,96,124,102,102,220,0,0];
	r["â"] = r["&acirc;"];
	r["&ecirc;"] = [24,36,66,0,60,102,126,6,102,60,0,0];
	r["ê"] = r["&ecirc;"];
	r["&icirc;"] = [24,36,66,0,30,24,24,24,24,126,0,0];
	r["î"] = r["&icirc;"];
	r["&ocirc;"] = [24,36,66,0,60,102,102,102,102,60,0,0];
	r["ô"] = r["&ocirc;"];
	r["&ucirc;"] = [24,36,66,0,102,102,102,102,102,220,0,0];
	r["û"] = r["&ocirc;"];
	r["&ntilde;"] = [0,220,118,0,62,102,102,102,102,102,0,0];
	r["ñ"] = r["&ntilde;"];
	r["&Ntilde;"] = [220,118,0,198,206,222,246,230,198,198,0,0];
	r["Ñ"] = r["&Ntilde;"];
	r["&uml;"] = [0,102,102,0,0,0,0,0,0,0,0,0];
	//r["\""] = r["&uml;"];
	
	r[186] = r[";"] = [0,0,0,28,28,0,0,28,28,24,12,0];
	r[187] = r["="] = [0,0,0,0,126,0,126,0,0,0,0,0];
	r[188] = r[","] = [0,0,0,0,0,0,0,0,28,28,6,0];
	r[189] = r["-"] = [0,0,0,0,0,126,0,0,0,0,0,0];
	r[190] = r["."] = [0,0,0,0,0,0,0,0,28,28,0,0];
	r[191] = r["/"] = [0,0,0,64,96,48,24,12,6,2,0,0];
	r[219] = r["["] = [0,30,6,6,6,6,6,6,6,30,0,0];
	r[220] = r["\\"] = [0,0,0,2,6,12,24,48,96,64,0,0];
	r[221] = r["]"] = [0,120,96,96,96,96,96,96,96,120,0,0];
	r[222] = r["'"] = [0,24,24,24,0,0,0,0,0,0,0,0];
	r[48+s] = r[")"] = [0,6,12,24,48,48,48,24,12,6,0,0];
	r[49+s] = r["!"] = [0,24,60,60,60,24,24,0,24,24,0,0];
	r[50+s] = r["@"] = [0,124,198,198,246,246,246,6,6,124,0,0];
	r[51+s] = r["#"] = [0,108,108,254,108,108,108,254,108,108,0,0];
	r[52+s] = r["$"] = [24,24,124,6,6,60,96,96,62,24,24,0];
	r[53+s] = r["%"] = [0,0,0,70,102,48,24,12,102,98,0,0];
	r[54+s] = r["^"] = [16,56,108,198,0,0,0,0,0,0,0,0];
	r[55+s] = r["&"] = [0,28,54,54,28,190,246,102,118,220,0,0];
	r[56+s] = r["*"] = [0,0,0,102,60,255,60,102,0,0,0,0];
	r[57+s] = r["("] = [0,96,48,24,12,12,12,24,48,96,0,0];
	
	
	r[186+s] = r[":"] = [0,0,0,28,28,0,0,28,28,0,0,0];
	r[187+s] = r["+"] = [0,0,0,24,24,126,24,24,0,0,0,0];
	r[188+s] = r["<"] = [0,96,48,24,12,6,12,24,48,96,0,0];
	r[189+s] = r["_"] = [0,0,0,0,0,0,0,0,0,0,255,0];
	r[190+s] = r[">"] = [0,6,12,24,48,96,48,24,12,6,0,0];
	r[191+s] = r["?"] = [0,0,60,102,96,48,24,24,0,24,24,0];
	r[192+s] = r["~"] = [206,91,115,0,0,0,0,0,0,0,0,0];
	r[219+s] = r["{"] = [0,112,24,24,12,6,12,24,24,112,0,0];
	r[220+s] = r["|"] = [0,24,24,24,24,0,24,24,24,24,0,0];
	r[221+s] = r["}"] = [0,14,24,24,48,96,48,24,24,14,0,0];
	r[222+s] = r["\""] = [0,204,204,204,0,0,0,0,0,0,0,0];
	
	t[186] = ";"; t[187] = "="; t[188] = ","; t[189] = "-"; t[190] = ".";
	t[191] = "/"; t[219] = "["; t[220] = "\\"; t[221] = "]"; t[222] = "'";
	t[48+s] = ")"; t[49+s] = "!"; t[50+s] = "@"; t[51+s] = "#";  t[52+s] = "$";
	t[53+s] = "%"; t[54+s] = "^"; t[55+s] = "&"; t[56+s] = "*"; t[57+s] = "(";
	t[186+s] = ":"; t[187+s] = "+"; t[188+s] = "<"; t[189+s] = "_"; t[190+s] = ">";
	t[191+s] = "?"; t[192+s] = "~"; t[219+s] = "{"; t[220+s] = "|"; t[221+s] = "}";
	t[222+s] = "\"";
	
	r["carat"] = [0,0,0,0,0,0,0,0,0,255,255,0];
	r["carat_v"] = [1,1,1,1,1,1,1,1,1,1,1,1];
	
	r["w179"] = [
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8
	]
	
	r[32] = r["blank"] = [0,0,0,0,0,0,0,0,0,0,0,0]; // space
	r.meta = {};
	r.meta.width = 8;
	r.meta.height = 12;
	
	
	
	return r;
})();
	
	

function Color() {}
Color.RGB = function() {}
Color.RGB.slerp_environment = function(progress,grad_arr, proportion_array) {
	if(grad_arr.length != (proportion_array.length+1)) {
		throw "error: second argument(grad_arr) is color separators, third argument(proportion_array) is period between transition, must have size N+1 and N.";
	}
	var start_color_array = [];
	var end_color_array = [];
	var f = function() {
		grad_arr.unshift( grad_arr[0] );
		for(var x = 1; x < grad_arr.length;x++) {
			start_color_array.push(grad_arr[x-1]);
			end_color_array.push(grad_arr[x]);
		}
		
	
		//console.log("A");
		this.x = 0;
		this.normalized = [0];
		this.last = 0;
		
		var arr_sum = [];
		var sum = 0;
		
		for(var x = 0; x < proportion_array.length;x++) {
			sum += proportion_array[x]
			this.normalized.push(sum);
		}
		for(var x = 0; x < this.normalized.length;x++) {
			this.normalized[x] = this.normalized[x]/sum;
		}
		this.buffer = [
			// start element
			[
				( ( parseInt( start_color_array[0][0]) & 0xFF ) ) ,
				( ( parseInt( start_color_array[0][1]) & 0xFF ) ) ,
				( ( parseInt( start_color_array[0][2]) & 0xFF ) )
			]
		];
		//console.log("@0",this.normalized);
		
	};
	f.prototype.get = function(last_progress, progress) {
		var sel = -1;
		for(var x = 1; x < this.normalized.length;x++) {
			if(progress < this.normalized[x] && progress >= this.normalized[x-1]) {
				sel = x;
				break;
			}
			if(x==this.normalized.length-1 && progress == this.normalized[x]) {
				sel = x;
				break;
			}
		}
		
		//console.log("@1",sel,progress,this.normalized,this.normalized[sel],this.normalized[sel-1]);
		if(sel == -1)
			return 0;
		
		var v = null;
		/*
		console.log(parseInt(  (progress-this.normalized[sel-1])*end_color_array[sel][0]/(this.normalized[sel]-this.normalized[sel-1])
					+ (this.normalized[sel]-progress)*start_color_array[sel-1][0]/(this.normalized[sel] - this.normalized[sel-1])
					
				) & 0xFF
			);
		*/
		var a = (progress-this.normalized[sel-1]);
		var b = (this.normalized[sel]-progress);
		var c  = (this.normalized[sel]-this.normalized[sel-1]);
		//console.log(" @2" ,sel,a,b,c);
		//console.log(" @3" ,end_color_array[sel],start_color_array[sel-1],end_color_array,start_color_array);
		a /= c;
		b /= c;
		//console.log(" @4" ,a,b);
		v = [ 
			parseInt( a*end_color_array[sel][0] + b*start_color_array[sel][0] ) & 0xFF
			, parseInt( a*end_color_array[sel][1] + b*start_color_array[sel][1] ) & 0xFF 
			, parseInt( a*end_color_array[sel][2] + b*start_color_array[sel][2] ) & 0xFF 
		];
		//console.log(" @5",v)
		//this.buffer.push(v);
		//this.buffer.shift(); //stop record; // throw old
		return v; //this.buffer[ this.buffer.length-1];
	};
	return new f();
}






var appWorker = {
	"textscroller" : {},
	"audiofilter" : {},
	"compiler" : {}
	
	// ideas to use worker
	// ...
}

var cpu = {
	SO : {
		type : {
			alpha : {
				app : {
				}
			},
		},
		loadedApps : [],
		loadedUsers : []
	},
	users : [],
	selectedSO : "alpha"
}

cpu.SO.type[cpu.selectedSO].app.textscroller = {
	data : null,
	command : function(args) {
		if( args.command == "clear" ) {
			var td = this.data;
			td.textscroller.k = 0;
			td.textscroller.str = td.textscroller.brand;
		}
	},
	fillRect : function(img,r,g,b,a,x,y,_w,_h) {
		var td = this.data;
		for(var top = y; top < y+_h;top++) {
			for(var left = x; left < x+_w;left++) {
				var pos = (( top*td.width + left ) << 2);
				img.data[ pos + 0 ] = r;
				img.data[ pos + 1 ] = g;
				img.data[ pos + 2 ] = b;
				img.data[ pos + 3 ] = a;
			}
		}
		return img;
	},
	drawRect : function(img,r,g,b,a,x,y,_w,_h) {
		var td = this.data;
		for(var top = y; top < y+_h;top++) {
			var pos = (( top*td.width + x ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var top = y; top < y+_h;top++) {
			var pos = (( top*td.width + x+_w ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var left = x; left < x+_w;left++) {
			var pos = (( y*td.width + left ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var left = x; left < x+_w;left++) {
			var pos = (( (y+_h)*td.width + left ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
	},
	init : function(args) {
		// args
		var td = this.data = {};
		td.reader = {
			offset : 0
		};
				
		td.paused = false;
		td.time = new Number(new Date())
		td.width = args.width;
		td.height = args.height;
		
		td.pages = [];
		td.raw_pages = args.text.split("::::NP");
		
		console.log(td.pages);
		td.watermark = "<!--http://numbercooler.github.io //-->";
		
		// text parser
		td.marks = [];
		var context = {};
		context.top = 0;
		context.left = 0;
		
		var page = td.raw_pages; // raw pages
		
		console.log("@@@@@@@@@@@@@@@PAGE:","##",td.raw_pages.length,"##");
		//console.log(td.pages[0].length);
		for(var x = 0; x < td.raw_pages.length;x++) {
			
			(function(x) {
				var page_form = {
					lines : null,
					length : 0,
					hash : []
				};
				
				console.log("page index:",td.pages.length);
				console.log("page size:",page[x].length);
				
				// na contagem do tamanho do texto o texto já tem que estar em um formato puro de ascii art
				// pois nao pode haver linhas de tamanhos diferentes(principalmente com impares e pares em tamanho de coluna)
				
				/*
					parser each page
					
					console.log(Languages);
					var l = new Languages.LOGICUNIT();
					l.reset();
					
					context.state = "acquire_frame";
					
					l.run("def a="+td.pages[x] ,context);
					task : parser to get ascii video string to structured data
					px = px+offset
					// offset is already parsed data
				*/
				
				var lines = null;
				if(page[x].indexOf("\r\n")!=-1) lines = page[x].split("\r\n");
				else lines = page[x].split("\n");
				if(lines[lines.length-1]=="") lines.pop();
				lines.push( td.watermark );
				
				if(lines.length>0 && lines[0]=="") lines.shift();
				
				console.log(lines);
				
				page_form.lines = lines;
				
				td.pages.push( page_form );
				
				var sum = 0;
				
				for(var z = 0; z < lines.length;z++) {
					(function(z) {
						var str = lines[z];
						// parser is done here, replacing format line to formated line data
						var _ops = [];
						// replace array of string to array of objects
						page_form.lines[z] = { pure : str, ops : _ops,  length : str.length };
						for(var w = 0; w < str.length;w++) {
							(function(x,w) {
								var char_obj = {
									color : [
										// parseInt( Math.random()*255)
										//,parseInt( Math.random()*255)
										//,parseInt( Math.random()*255)
										0
										,255
										,255
									],
									rawChar : str.charAt(w),
									line : z,
									col : w
								};
								_ops.push( char_obj );
								page_form.hash.push(char_obj);
								sum += 1;	
							})(x,w);
						}
					})(z);
				}
				page_form.length = sum;
				console.log("-----------------------------------------");
			})(x);
		}
		
		console.log("total pages:",td.pages.length);
		console.log("calculating timings");
		td.grad1 = Color.RGB.slerp_environment(0,[[0x80,0x80,0x80],[0xFF,0xFF,0xFF],[0x80,0x80,0x80],[0xFF,0xFF,0xFF],[0x80,0x80,0x80]], [25,25,25,25]);
		td.grad2 = Color.RGB.slerp_environment(0,[[0x70,0x70,0x70],[0x0,0x0,0x0],[0x70,0x70,0x70]], [487,487]);
		td.last_play_timeline = 0;
		td.play_timeline = 0;
		//console.log("A");	
		
		// max 113 x 39 (for a while)
		td.k = 0;
		td.str_pos = 0;
		td.delay = 0;
		td.pageK = 0;
		td.pageIndex = 0;
		
		td.pageK = [0]; // pages.length +1
		td.delays = [];
		td.mocksum = [0];
		var framec = 0;
		var mocksum = 0;
		// calculate timings of video
		var delay = 100;
		var sum = 0;	
		for(var x = 0; x < td.pages.length;x++) {
			sum = 0;
			for(var y = 0; y < td.pages[x].lines.length;y++) { sum += td.pages[x].lines[y].length; }
			sum += delay;
			td.pageK.push(sum);
			if(x>0) td.mocksum.push(mocksum);
			mocksum += sum;
		}
		console.log("duration:",mocksum+1);
		td.pageK.push(sum);
		td.mocksum.push(mocksum);
		
		td.total = mocksum+1;
		console.log(td.mocksum,td.pageK);
		console.log("setTotalFrames");
		
		self.postMessage({app:"textscroller",method:"setTotalFrames",args:[td.total]});
		
	},
	render : function(args) {
		var td = this.data;
		if(td==null) {
			self.postMessage({app:"textscroller",method:"reset",args:["0_0xF"]});
			return;
		}
		//console.log("START",td);
		var check = true;
		while(check) {
			if( (td.k - td.mocksum[td.pageIndex]) > td.pageK[td.pageIndex+1]) {
				td.pageIndex = ( td.pageIndex + 1 ) % td.pages.length;
				if(td.pageIndex==0) td.k = 0;
				//console.log(td.k,td.pageIndex,td.pages[td.pageIndex],td.mocksum[td.pageIndex],td.pageK[ td.pageIndex+1]);
			}
			if( (td.k - td.mocksum[td.pageIndex]) <= td.pageK[td.pageIndex+1] ) {
				check = false;
				//console.log("PRINT");
				var c0 = td.grad1.get(td.last_play_timeline,td.play_timeline);
				var c1 = td.grad2.get(td.last_play_timeline,td.play_timeline);	
				td.last_play_timeline = td.play_timeline;
				var cycles = 2;
				var arg0 = cycles*2*Math.PI * td.k/td.total - Math.PI/2 - Math.PI,
					arg1 = cycles*2*Math.PI * td.k/td.total - Math.PI - Math.PI;
				while(arg0 > 2*Math.PI) arg0 -= 2*Math.PI;
				while(arg1 > 2*Math.PI) arg1 -= 2*Math.PI;
				while(arg0 < 0) arg0 += 2*Math.PI;
				while(arg1 < 0) arg1 += 2*Math.PI;
				var rot = -0.45;//(Math.sin(arg0 )/2); // same frequency same phase
				var rot2 = (Math.cos(arg1 )/2); // same frequency different phase
				var str = td.pages[td.pageIndex];
				var page = str;
				var k = (td.k-td.mocksum[td.pageIndex])%page.hash.length;
				
				var current_frame_at_page = td.k - td.mocksum[td.pageIndex];
				if(current_frame_at_page > page.hash.length) { 
					//console.log("delay","frame at page",td.k-td.mocksum[td.pageIndex]); // started delaying before it ends print
					k = page.hash.length; 
					px_max = page.hash.length-1;
				}
				
				var px_max = 0;
				
				var str = [], line = 0, ch = 0;
				var last = null;
				var max_line_length = 0;
				
				// calculate format
				for(var z = 0; z < k;z++) { // k increases by frame
					if( ch >= page.lines[line].ops.length ) {
						line += 1;
						ch = 0;
					}
					while(page.lines[line].ops.length==0) line += 1;
					last = page.lines[line].ops[ch];
					if(last.col > max_line_length) {
						max_line_length = last.col;
					}
					ch += 1;
				}
				var max_lines = line;
				var m = max_line_length;
				if(m<1) m = 1;
				var div_w = 8*(m+1);
				var div_h = 12*(max_lines+1);
				//var tile = parseInt(10+rot*100)>>>0;
				var pw = parseFloat(td.width)/parseFloat(div_w);
				var ph = parseFloat(td.height)/parseFloat(div_h);
				//(-1/2+rot)
				var tile_w = parseInt(pw), tile_h = parseInt(ph); // pixel size
				//if(tile_w<1) tile_w = 1;
				
				var imgData = { data : new Uint8ClampedArray(parseInt( td.width*td.height*4) ) };
				this.fillRect(imgData,0,0,0,255,0,0,td.width,td.height); // clear
				
				var cx = (parseFloat(td.width/2)-(parseFloat(div_w)*Math.abs(tile_w))/2.0),
					cy = (parseFloat(td.height/2)-(parseFloat(div_h)*Math.abs(tile_h))/2.0);
					
				var str = [], line = 0, ch = 0;
				for(var z = 0; z < k;z++) { // k increases by frame
					if( ch >= page.lines[line].ops.length ) {
						line += 1; ch = 0; str.push("\r\n");
					}
					while(page.lines[line].ops.length==0) line += 1;
					var charData = page.lines[line].ops[ch].rawChar;
					str.push( charData );
					if( charData != "\r" && charData != "\n" ) {
						for(var y = 0; y < 12;y++) {
							for(var x = 0; x < 8;x++) {
								if(  ( font[ page.lines[line].ops[ch].rawChar  ][ y ] & (1 << x)  )!=0 ) {
									this.fillRect(imgData,
										//c0[0],c0[1],c0[2],255,
										c0[0],page.lines[line].ops[ch].color[1],page.lines[line].ops[ch].color[2],255,
										parseInt(cx + ch*8*Math.abs(tile_w) +x*Math.abs(tile_w) ),
										parseInt(cy + line*12*Math.abs(tile_h) + y*Math.abs(tile_h)),
										Math.abs(tile_w)>>>0,
										Math.abs(tile_h)>>>0
									)
								}
							}
						}
					}
					ch += 1;
				}
				
				// this confirms steps
				// console.log("string:",str.join(""));
				
				td.play_timeline = (td.k%((td.total/cycles)>>>0))/((td.total/cycles)>>>0);
				var a = (new Number( (new Date()) ));
				/*
				console.log(
					td.k,
					"<< H[" + ((((a-dt)/4800000) >>> 0).toString(10)) + "]:M["+
					((((a-dt)/60000) >>> 0).toString(10)) + "]:S[" +
					((   (((a-dt)/1000)%60)    >>> 0).toString(10)) + "]|" + ((   ((a-dt)/1000)    >>> 0).toString(10))  + "|>> ",
					tile_w
					
				);
				*/
				td.k+=1;
				self.postMessage({app:"textscroller",method:"render",args:[imgData]});
			} 
		}
	}
}

			
self.addEventListener('message', function(e) {
	//self.postMessage({method:"message",args:["I'm ready."]});
	var json = e.data;
	if(json.app=="CPU") {
		if(json.method=="close") {
			self.close();		
		}
	} else {
		cpu.SO
			.type[ cpu.selectedSO ]
			.app[json.app][json.method].apply(
			cpu.SO
				.type[ cpu.selectedSO ]
				.app[json.app]
				, json.args
		);
	}
	//self.postMessage({method:"message",args:["I'm iddle."]});
}, false);