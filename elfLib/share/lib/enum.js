"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AcademusRole;
(function (AcademusRole) {
    AcademusRole[AcademusRole["student"] = 0] = "student";
    AcademusRole[AcademusRole["teacher"] = 1] = "teacher";
})(AcademusRole = exports.AcademusRole || (exports.AcademusRole = {}));
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["invalidInput"] = 0] = "invalidInput";
    ResponseCode[ResponseCode["success"] = 1] = "success";
    ResponseCode[ResponseCode["notFound"] = 2] = "notFound";
    ResponseCode[ResponseCode["serverError"] = 3] = "serverError";
})(ResponseCode = exports.ResponseCode || (exports.ResponseCode = {}));
var Actor;
(function (Actor) {
    Actor["owner"] = "o";
    Actor["player"] = "p";
    Actor["clientRobot"] = "cr";
    Actor["serverRobot"] = "sr";
})(Actor = exports.Actor || (exports.Actor = {}));
var NationCode;
(function (NationCode) {
    NationCode[NationCode["China"] = 86] = "China";
    NationCode[NationCode["American"] = 1] = "American";
    NationCode[NationCode["Hongkong"] = 852] = "Hongkong";
    NationCode[NationCode["Singapore"] = 65] = "Singapore";
    NationCode[NationCode["UK"] = 44] = "UK";
    NationCode[NationCode["Andorra"] = 376] = "Andorra";
    NationCode[NationCode["United Arab Emirates"] = 971] = "United Arab Emirates";
    NationCode[NationCode["Afghanistan"] = 93] = "Afghanistan";
    NationCode[NationCode["Antigua and Barbuda"] = 1268] = "Antigua and Barbuda";
    NationCode[NationCode["Anguilla"] = 1264] = "Anguilla";
    NationCode[NationCode["Albania"] = 355] = "Albania";
    NationCode[NationCode["Armenia"] = 374] = "Armenia";
    NationCode[NationCode["Angola"] = 244] = "Angola";
    NationCode[NationCode["Argentina"] = 54] = "Argentina";
    NationCode[NationCode["American Samoa"] = 1684] = "American Samoa";
    NationCode[NationCode["Austria"] = 43] = "Austria";
    NationCode[NationCode["Australia"] = 61] = "Australia";
    NationCode[NationCode["Aruba"] = 297] = "Aruba";
    NationCode[NationCode["Azerbaijan"] = 994] = "Azerbaijan";
    NationCode[NationCode["Bosniaand Herzegovina"] = 387] = "Bosniaand Herzegovina";
    NationCode[NationCode["Barbados"] = 1246] = "Barbados";
    NationCode[NationCode["Bangladesh"] = 880] = "Bangladesh";
    NationCode[NationCode["Belgium"] = 32] = "Belgium";
    NationCode[NationCode["Burkina Faso"] = 226] = "Burkina Faso";
    NationCode[NationCode["Bulgaria"] = 359] = "Bulgaria";
    NationCode[NationCode["Bahrain"] = 973] = "Bahrain";
    NationCode[NationCode["Burundi"] = 257] = "Burundi";
    NationCode[NationCode["Benin"] = 229] = "Benin";
    NationCode[NationCode["Bermuda"] = 1441] = "Bermuda";
    NationCode[NationCode["Brunei"] = 673] = "Brunei";
    NationCode[NationCode["Bolivia"] = 591] = "Bolivia";
    NationCode[NationCode["Caribisch Nederland"] = 599] = "Caribisch Nederland";
    NationCode[NationCode["Brazil"] = 55] = "Brazil";
    NationCode[NationCode["Bahamas"] = 1242] = "Bahamas";
    NationCode[NationCode["Bhutan"] = 975] = "Bhutan";
    NationCode[NationCode["Botswana"] = 267] = "Botswana";
    NationCode[NationCode["Belarus"] = 375] = "Belarus";
    NationCode[NationCode["Belize"] = 501] = "Belize";
    NationCode[NationCode["Canada"] = 1] = "Canada";
    NationCode[NationCode["Democratic Republic of theCongo"] = 243] = "Democratic Republic of theCongo";
    NationCode[NationCode["Central African Republic"] = 236] = "Central African Republic";
    NationCode[NationCode["Republic Of The Congo"] = 242] = "Republic Of The Congo";
    NationCode[NationCode["Switzerland"] = 41] = "Switzerland";
    NationCode[NationCode["Ivory Coast"] = 225] = "Ivory Coast";
    NationCode[NationCode["Cook Islands"] = 682] = "Cook Islands";
    NationCode[NationCode["Chile"] = 56] = "Chile";
    NationCode[NationCode["Cameroon"] = 237] = "Cameroon";
    NationCode[NationCode["Colombia"] = 57] = "Colombia";
    NationCode[NationCode["CostaRica"] = 506] = "CostaRica";
    NationCode[NationCode["Cuba"] = 53] = "Cuba";
    NationCode[NationCode["Cape Verde"] = 238] = "Cape Verde";
    NationCode[NationCode["Curacao"] = 599] = "Curacao";
    NationCode[NationCode["Cyprus"] = 357] = "Cyprus";
    NationCode[NationCode["Czech"] = 420] = "Czech";
    NationCode[NationCode["Germany"] = 49] = "Germany";
    NationCode[NationCode["Djibouti"] = 253] = "Djibouti";
    NationCode[NationCode["Denmark"] = 45] = "Denmark";
    NationCode[NationCode["Dominica"] = 1767] = "Dominica";
    NationCode[NationCode["dominican republic"] = 1809] = "dominican republic";
    NationCode[NationCode["Algeria"] = 213] = "Algeria";
    NationCode[NationCode["Ecuador"] = 593] = "Ecuador";
    NationCode[NationCode["Estonia"] = 372] = "Estonia";
    NationCode[NationCode["Egypt"] = 20] = "Egypt";
    NationCode[NationCode["Eritrea"] = 291] = "Eritrea";
    NationCode[NationCode["Spain"] = 34] = "Spain";
    NationCode[NationCode["Ethiopia"] = 251] = "Ethiopia";
    NationCode[NationCode["Finland"] = 358] = "Finland";
    NationCode[NationCode["Fiji"] = 679] = "Fiji";
    NationCode[NationCode["Micronesia"] = 691] = "Micronesia";
    NationCode[NationCode["Faroe Islands"] = 298] = "Faroe Islands";
    NationCode[NationCode["France"] = 33] = "France";
    NationCode[NationCode["Gabon"] = 241] = "Gabon";
    NationCode[NationCode["United Kingdom"] = 44] = "United Kingdom";
    NationCode[NationCode["Grenada"] = 1473] = "Grenada";
    NationCode[NationCode["Georgia"] = 995] = "Georgia";
    NationCode[NationCode["French Guiana"] = 594] = "French Guiana";
    NationCode[NationCode["Ghana"] = 233] = "Ghana";
    NationCode[NationCode["Gibraltar"] = 350] = "Gibraltar";
    NationCode[NationCode["Greenland"] = 299] = "Greenland";
    NationCode[NationCode["Gambia"] = 220] = "Gambia";
    NationCode[NationCode["Guinea"] = 224] = "Guinea";
    NationCode[NationCode["Guadeloupe"] = 590] = "Guadeloupe";
    NationCode[NationCode["Equatorial Guinea"] = 240] = "Equatorial Guinea";
    NationCode[NationCode["Greece"] = 30] = "Greece";
    NationCode[NationCode["Guatemala"] = 502] = "Guatemala";
    NationCode[NationCode["Guam"] = 1671] = "Guam";
    NationCode[NationCode["Guinea-Bissau"] = 245] = "Guinea-Bissau";
    NationCode[NationCode["Guyana"] = 592] = "Guyana";
    NationCode[NationCode["Hong Kong"] = 852] = "Hong Kong";
    NationCode[NationCode["Honduras"] = 504] = "Honduras";
    NationCode[NationCode["Croatia"] = 385] = "Croatia";
    NationCode[NationCode["Haiti"] = 509] = "Haiti";
    NationCode[NationCode["Hungary"] = 36] = "Hungary";
    NationCode[NationCode["Indonesia"] = 62] = "Indonesia";
    NationCode[NationCode["Ireland"] = 353] = "Ireland";
    NationCode[NationCode["Israel"] = 972] = "Israel";
    NationCode[NationCode["India"] = 91] = "India";
    NationCode[NationCode["Iraq"] = 964] = "Iraq";
    NationCode[NationCode["Iran"] = 98] = "Iran";
    NationCode[NationCode["Iceland"] = 354] = "Iceland";
    NationCode[NationCode["Italy"] = 39] = "Italy";
    NationCode[NationCode["Jamaica"] = 1876] = "Jamaica";
    NationCode[NationCode["Jordan"] = 962] = "Jordan";
    NationCode[NationCode["Japan"] = 81] = "Japan";
    NationCode[NationCode["Kenya"] = 254] = "Kenya";
    NationCode[NationCode["Kyrgyzstan"] = 996] = "Kyrgyzstan";
    NationCode[NationCode["Cambodia"] = 855] = "Cambodia";
    NationCode[NationCode["Kiribati"] = 686] = "Kiribati";
    NationCode[NationCode["Comoros"] = 269] = "Comoros";
    NationCode[NationCode["Saint Kitts and Nevis"] = 1869] = "Saint Kitts and Nevis";
    NationCode[NationCode["Korea Democratic Rep."] = 850] = "Korea Democratic Rep.";
    NationCode[NationCode["South Korea"] = 82] = "South Korea";
    NationCode[NationCode["Kuwait"] = 965] = "Kuwait";
    NationCode[NationCode["Cayman Islands"] = 1345] = "Cayman Islands";
    NationCode[NationCode["Kazakhstan"] = 7] = "Kazakhstan";
    NationCode[NationCode["Laos"] = 856] = "Laos";
    NationCode[NationCode["Lebanon"] = 961] = "Lebanon";
    NationCode[NationCode["Saint Lucia"] = 1758] = "Saint Lucia";
    NationCode[NationCode["Liechtenstein"] = 423] = "Liechtenstein";
    NationCode[NationCode["Sri Lanka"] = 94] = "Sri Lanka";
    NationCode[NationCode["Liberia"] = 231] = "Liberia";
    NationCode[NationCode["Lesotho"] = 266] = "Lesotho";
    NationCode[NationCode["Lithuania"] = 370] = "Lithuania";
    NationCode[NationCode["Luxembourg"] = 352] = "Luxembourg";
    NationCode[NationCode["Latvia"] = 371] = "Latvia";
    NationCode[NationCode["Libya"] = 218] = "Libya";
    NationCode[NationCode["Morocco"] = 212] = "Morocco";
    NationCode[NationCode["Monaco"] = 377] = "Monaco";
    NationCode[NationCode["Moldova"] = 373] = "Moldova";
    NationCode[NationCode["Montenegro"] = 382] = "Montenegro";
    NationCode[NationCode["Madagascar"] = 261] = "Madagascar";
    NationCode[NationCode["Marshall Islands"] = 692] = "Marshall Islands";
    NationCode[NationCode["Macedonia"] = 389] = "Macedonia";
    NationCode[NationCode["Mali"] = 223] = "Mali";
    NationCode[NationCode["Myanmar"] = 95] = "Myanmar";
    NationCode[NationCode["Mongolia"] = 976] = "Mongolia";
    NationCode[NationCode["Macau"] = 853] = "Macau";
    NationCode[NationCode["Mauritania"] = 222] = "Mauritania";
    NationCode[NationCode["Montserrat"] = 1664] = "Montserrat";
    NationCode[NationCode["Malta"] = 356] = "Malta";
    NationCode[NationCode["Mauritius"] = 230] = "Mauritius";
    NationCode[NationCode["Maldives"] = 960] = "Maldives";
    NationCode[NationCode["Malawi"] = 265] = "Malawi";
    NationCode[NationCode["Mexico"] = 52] = "Mexico";
    NationCode[NationCode["Malaysia"] = 60] = "Malaysia";
    NationCode[NationCode["Mozambique"] = 258] = "Mozambique";
    NationCode[NationCode["Namibia"] = 264] = "Namibia";
    NationCode[NationCode["New Caledonia"] = 687] = "New Caledonia";
    NationCode[NationCode["Niger"] = 227] = "Niger";
    NationCode[NationCode["Nigeria"] = 234] = "Nigeria";
    NationCode[NationCode["Nicaragua"] = 505] = "Nicaragua";
    NationCode[NationCode["Netherlands"] = 31] = "Netherlands";
    NationCode[NationCode["Norway"] = 47] = "Norway";
    NationCode[NationCode["Nepal"] = 977] = "Nepal";
    NationCode[NationCode["Nauru"] = 674] = "Nauru";
    NationCode[NationCode["New Zealand"] = 64] = "New Zealand";
    NationCode[NationCode["Oman"] = 968] = "Oman";
    NationCode[NationCode["Panama"] = 507] = "Panama";
    NationCode[NationCode["Peru"] = 51] = "Peru";
    NationCode[NationCode["French Polynesia"] = 689] = "French Polynesia";
    NationCode[NationCode["Papua New Guinea"] = 675] = "Papua New Guinea";
    NationCode[NationCode["Philippines"] = 63] = "Philippines";
    NationCode[NationCode["Pakistan"] = 92] = "Pakistan";
    NationCode[NationCode["Poland"] = 48] = "Poland";
    NationCode[NationCode["Saint Pierreand Miquelon"] = 508] = "Saint Pierreand Miquelon";
    NationCode[NationCode["Puerto Rico"] = 1787] = "Puerto Rico";
    NationCode[NationCode["Portugal"] = 351] = "Portugal";
    NationCode[NationCode["Palau"] = 680] = "Palau";
    NationCode[NationCode["Paraguay"] = 595] = "Paraguay";
    NationCode[NationCode["Qatar"] = 974] = "Qatar";
    NationCode[NationCode["R\u00E9union Island"] = 262] = "R\u00E9union Island";
    NationCode[NationCode["Romania"] = 40] = "Romania";
    NationCode[NationCode["Serbia"] = 381] = "Serbia";
    NationCode[NationCode["Russia"] = 7] = "Russia";
    NationCode[NationCode["Rwanda"] = 250] = "Rwanda";
    NationCode[NationCode["Saudi Arabia"] = 966] = "Saudi Arabia";
    NationCode[NationCode["Solomon Islands"] = 677] = "Solomon Islands";
    NationCode[NationCode["Seychelles"] = 248] = "Seychelles";
    NationCode[NationCode["Sudan"] = 249] = "Sudan";
    NationCode[NationCode["Sweden"] = 46] = "Sweden";
    NationCode[NationCode["Slovenia"] = 386] = "Slovenia";
    NationCode[NationCode["Slovakia"] = 421] = "Slovakia";
    NationCode[NationCode["Sierra Leone"] = 232] = "Sierra Leone";
    NationCode[NationCode["San Marino"] = 378] = "San Marino";
    NationCode[NationCode["Senegal"] = 221] = "Senegal";
    NationCode[NationCode["Somalia"] = 252] = "Somalia";
    NationCode[NationCode["Suriname"] = 597] = "Suriname";
    NationCode[NationCode["Sao Tome and Principe"] = 239] = "Sao Tome and Principe";
    NationCode[NationCode["ElSalvador"] = 503] = "ElSalvador";
    NationCode[NationCode["Syria"] = 963] = "Syria";
    NationCode[NationCode["Swaziland"] = 268] = "Swaziland";
    NationCode[NationCode["Turksand Caicos Islands"] = 1649] = "Turksand Caicos Islands";
    NationCode[NationCode["Chad"] = 235] = "Chad";
    NationCode[NationCode["Togo"] = 228] = "Togo";
    NationCode[NationCode["Thailand"] = 66] = "Thailand";
    NationCode[NationCode["Tajikistan"] = 992] = "Tajikistan";
    NationCode[NationCode["East Timor"] = 670] = "East Timor";
    NationCode[NationCode["Turkmenistan"] = 993] = "Turkmenistan";
    NationCode[NationCode["Tunisia"] = 216] = "Tunisia";
    NationCode[NationCode["Tonga"] = 676] = "Tonga";
    NationCode[NationCode["Turkey"] = 90] = "Turkey";
    NationCode[NationCode["Trinidadand Tobago"] = 1868] = "Trinidadand Tobago";
    NationCode[NationCode["Taiwan"] = 886] = "Taiwan";
    NationCode[NationCode["Tanzania"] = 255] = "Tanzania";
    NationCode[NationCode["Ukraine"] = 380] = "Ukraine";
    NationCode[NationCode["Uganda"] = 256] = "Uganda";
    NationCode[NationCode["United States"] = 1] = "United States";
    NationCode[NationCode["Uruguay"] = 598] = "Uruguay";
    NationCode[NationCode["Uzbekistan"] = 998] = "Uzbekistan";
    NationCode[NationCode["Saint Vincent and The Grenadines"] = 1784] = "Saint Vincent and The Grenadines";
    NationCode[NationCode["Venezuela"] = 58] = "Venezuela";
    NationCode[NationCode["VirginIslands,British"] = 1284] = "VirginIslands,British";
    NationCode[NationCode["Vietnam"] = 84] = "Vietnam";
    NationCode[NationCode["Vanuatu"] = 678] = "Vanuatu";
    NationCode[NationCode["Samoa"] = 685] = "Samoa";
    NationCode[NationCode["Yemen"] = 967] = "Yemen";
    NationCode[NationCode["Mayotte"] = 269] = "Mayotte";
    NationCode[NationCode["South Africa"] = 27] = "South Africa";
    NationCode[NationCode["Zambia"] = 260] = "Zambia";
    NationCode[NationCode["Zimbabwe"] = 263] = "Zimbabwe";
})(NationCode = exports.NationCode || (exports.NationCode = {}));