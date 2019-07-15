!function(e){var n={};function t(a){if(n[a])return n[a].exports;var r=n[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(a,r,function(n){return e[n]}.bind(null,r));return a},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/bespoke/SceneSurvey/static/",t(t.s=11)}([function(e,n){e.exports=React},function(e,n,t){"use strict";var a,r=this&&this.__extends||(a=function(e,n){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}a(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)}),o=this&&this.__assign||function(){return(o=Object.assign||function(e){for(var n,t=1,a=arguments.length;t<a;t++)for(var r in n=arguments[t])Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r]);return e}).apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0});var i=t(0),u=t(12),s=t(28),c=t(9);!function(e){var n=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(s.Template.Create);e.Create=n;var t=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(i.Component);e.Play=t;var a=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(i.Component);e.Play4Owner=a;var o=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(i.Component);e.Result=o;var u=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(i.Component);e.Result4Owner=u}(n.Core||(n.Core={}));var l=function(e){function n(n){var t=e.call(this)||this;return t.namespace=n,t}return r(n,e),n.instance=function(e){return this._instance||(this._instance=new n(e)),this._instance},n.prototype.buildUrl=function(n,t,a){return void 0===t&&(t={}),void 0===a&&(a={}),e.prototype.buildUrl.call(this,"/"+u.config.rootName+"/"+this.namespace+n,t,a)},n}(c.BaseRequest);n.Request=l,n.registerOnFramework=function(e,n){window.BespokeServer?window.BespokeServer.registerOnBespoke(n):s.registerOnElf(e,o({localeNames:[e]},n))}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){e.connection="connection",e.disconnect="disconnect",e.online="online",e.move="move",e.push="push",e.syncGameState_json="SGJ",e.syncPlayerState_json="SPJ",e.changeGameState_diff="CGD",e.changePlayerState_diff="CPD"}(n.SocketEvent||(n.SocketEvent={})),function(e){e.switchGameStatus="switchGameStatus"}(n.CoreMove||(n.CoreMove={})),function(e){e[e.started=0]="started",e[e.paused=1]="paused",e[e.over=2]="over"}(n.GameStatus||(n.GameStatus={})),function(e){e[e.default=0]="default",e[e.diff=1]="diff"}(n.SyncStrategy||(n.SyncStrategy={}))},function(e,n){e.exports=function(e){var n=typeof e;return null!=e&&("object"==n||"function"==n)}},function(e,n,t){var a=t(30);"string"==typeof a&&(a=[[e.i,a,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};t(32)(a,r);a.locals&&(e.exports=a.locals)},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.namespace="SceneSurvey",function(e){e.prepare="prepare",e.shout="shout",e.info="info"}(n.MoveType||(n.MoveType={})),n.PushType||(n.PushType={}),function(e){e[e.instruction=0]="instruction",e[e.playing=1]="playing",e[e.info=2]="info",e[e.end=3]="end"}(n.STATUS||(n.STATUS={})),function(e){e.exportXls="/exportXls/:gameId:",e.exportXlsPlaying="/exportXlsPlaying/:gameId",e.getUserMobile="/getUserMobile/:gameId"}(n.FetchRoute||(n.FetchRoute={})),function(e){e.result="result"}(n.SheetType||(n.SheetType={})),n.PAGES=[{instructions:["情景1：你需要为你和你的组员选择一个共同的补贴方案：A？B？","如果该情景被抽中，且你选择了A，那么你和你的组员在指定日期的补贴方案都是A；如果你选择了B，你们的补贴方案都是B。"]},{instructions:["情景2：你组员的补贴方案已经被确定为A，请为你自己选择一个补贴方案：A？B？","如果该情景被抽中，在某一指定日期，你组员的补贴方案为A，你的选择只会影响你自己的补贴方案。"]},{instructions:["情景3：你组员的补贴方案已经被确定为B，请为你自己选择一个补贴方案：A？B？","如果该情景被抽中，在某一指定日期，你组员的补贴方案为B，你的选择只会影响你自己的补贴方案。"]},{instructions:["情景4：你的补贴已经被确定为A，请为你的组员选择一个补贴方案：A？B？","如果该情景被抽中，在某一指定日期，你自己的补贴方案为A，你的选择只会影响你组员的补贴方案。"]},{instructions:["情景5：你的补贴已经被确定为B，请为你的组员选择一个补贴方案：A？B？","如果该情景被抽中，在某一指定日期，你自己的补贴方案为B，你的选择只会影响你组员的补贴方案。"]}]},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.config={rootName:"bespoke",apiPrefix:"api",socketPath:function(e){return"/bespoke/"+e+"/socket.io"},devPort:{client:8080,server:8081},minMoveInterval:500,vcodeLifetime:60}},function(e,n,t){var a=t(20),r="object"==typeof self&&self&&self.Object===Object&&self,o=a||r||Function("return this")();e.exports=o},function(e,n,t){var a=t(7).Symbol;e.exports=a},function(e,n){e.exports=ElfComponent},function(e,n){e.exports=antd},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t(1),r=t(29),o=t(34),i=t(35);a.registerOnFramework("SceneSurvey",{localeNames:["SceneSurvey","SceneSurvey"],Play:r.Play,Play4Owner:o.Play4Owner,Result4Owner:i.Result4Owner})},function(e,n,t){"use strict";function a(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}Object.defineProperty(n,"__esModule",{value:!0});var r=t(2);n.baseEnum=r,a(t(13)),a(t(2)),a(t(16)),a(t(6))},function(e,n,t){"use strict";function a(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}Object.defineProperty(n,"__esModule",{value:!0}),a(t(14)),a(t(15))},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.csrfCookieKey="_csrf"},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){e[e.student=0]="student",e[e.teacher=1]="teacher"}(n.AcademusRole||(n.AcademusRole={})),function(e){e[e.invalidInput=0]="invalidInput",e[e.success=1]="success",e[e.notFound=2]="notFound",e[e.serverError=3]="serverError"}(n.ResponseCode||(n.ResponseCode={})),function(e){e.owner="o",e.player="p",e.clientRobot="cr",e.serverRobot="sr"}(n.Actor||(n.Actor={})),function(e){e[e.China=86]="China",e[e.American=1]="American",e[e.Hongkong=852]="Hongkong",e[e.Singapore=65]="Singapore",e[e.UK=44]="UK",e[e.Andorra=376]="Andorra",e[e["United Arab Emirates"]=971]="United Arab Emirates",e[e.Afghanistan=93]="Afghanistan",e[e["Antigua and Barbuda"]=1268]="Antigua and Barbuda",e[e.Anguilla=1264]="Anguilla",e[e.Albania=355]="Albania",e[e.Armenia=374]="Armenia",e[e.Angola=244]="Angola",e[e.Argentina=54]="Argentina",e[e["American Samoa"]=1684]="American Samoa",e[e.Austria=43]="Austria",e[e.Australia=61]="Australia",e[e.Aruba=297]="Aruba",e[e.Azerbaijan=994]="Azerbaijan",e[e["Bosniaand Herzegovina"]=387]="Bosniaand Herzegovina",e[e.Barbados=1246]="Barbados",e[e.Bangladesh=880]="Bangladesh",e[e.Belgium=32]="Belgium",e[e["Burkina Faso"]=226]="Burkina Faso",e[e.Bulgaria=359]="Bulgaria",e[e.Bahrain=973]="Bahrain",e[e.Burundi=257]="Burundi",e[e.Benin=229]="Benin",e[e.Bermuda=1441]="Bermuda",e[e.Brunei=673]="Brunei",e[e.Bolivia=591]="Bolivia",e[e["Caribisch Nederland"]=599]="Caribisch Nederland",e[e.Brazil=55]="Brazil",e[e.Bahamas=1242]="Bahamas",e[e.Bhutan=975]="Bhutan",e[e.Botswana=267]="Botswana",e[e.Belarus=375]="Belarus",e[e.Belize=501]="Belize",e[e.Canada=1]="Canada",e[e["Democratic Republic of theCongo"]=243]="Democratic Republic of theCongo",e[e["Central African Republic"]=236]="Central African Republic",e[e["Republic Of The Congo"]=242]="Republic Of The Congo",e[e.Switzerland=41]="Switzerland",e[e["Ivory Coast"]=225]="Ivory Coast",e[e["Cook Islands"]=682]="Cook Islands",e[e.Chile=56]="Chile",e[e.Cameroon=237]="Cameroon",e[e.Colombia=57]="Colombia",e[e.CostaRica=506]="CostaRica",e[e.Cuba=53]="Cuba",e[e["Cape Verde"]=238]="Cape Verde",e[e.Curacao=599]="Curacao",e[e.Cyprus=357]="Cyprus",e[e.Czech=420]="Czech",e[e.Germany=49]="Germany",e[e.Djibouti=253]="Djibouti",e[e.Denmark=45]="Denmark",e[e.Dominica=1767]="Dominica",e[e["dominican republic"]=1809]="dominican republic",e[e.Algeria=213]="Algeria",e[e.Ecuador=593]="Ecuador",e[e.Estonia=372]="Estonia",e[e.Egypt=20]="Egypt",e[e.Eritrea=291]="Eritrea",e[e.Spain=34]="Spain",e[e.Ethiopia=251]="Ethiopia",e[e.Finland=358]="Finland",e[e.Fiji=679]="Fiji",e[e.Micronesia=691]="Micronesia",e[e["Faroe Islands"]=298]="Faroe Islands",e[e.France=33]="France",e[e.Gabon=241]="Gabon",e[e["United Kingdom"]=44]="United Kingdom",e[e.Grenada=1473]="Grenada",e[e.Georgia=995]="Georgia",e[e["French Guiana"]=594]="French Guiana",e[e.Ghana=233]="Ghana",e[e.Gibraltar=350]="Gibraltar",e[e.Greenland=299]="Greenland",e[e.Gambia=220]="Gambia",e[e.Guinea=224]="Guinea",e[e.Guadeloupe=590]="Guadeloupe",e[e["Equatorial Guinea"]=240]="Equatorial Guinea",e[e.Greece=30]="Greece",e[e.Guatemala=502]="Guatemala",e[e.Guam=1671]="Guam",e[e["Guinea-Bissau"]=245]="Guinea-Bissau",e[e.Guyana=592]="Guyana",e[e["Hong Kong"]=852]="Hong Kong",e[e.Honduras=504]="Honduras",e[e.Croatia=385]="Croatia",e[e.Haiti=509]="Haiti",e[e.Hungary=36]="Hungary",e[e.Indonesia=62]="Indonesia",e[e.Ireland=353]="Ireland",e[e.Israel=972]="Israel",e[e.India=91]="India",e[e.Iraq=964]="Iraq",e[e.Iran=98]="Iran",e[e.Iceland=354]="Iceland",e[e.Italy=39]="Italy",e[e.Jamaica=1876]="Jamaica",e[e.Jordan=962]="Jordan",e[e.Japan=81]="Japan",e[e.Kenya=254]="Kenya",e[e.Kyrgyzstan=996]="Kyrgyzstan",e[e.Cambodia=855]="Cambodia",e[e.Kiribati=686]="Kiribati",e[e.Comoros=269]="Comoros",e[e["Saint Kitts and Nevis"]=1869]="Saint Kitts and Nevis",e[e["Korea Democratic Rep."]=850]="Korea Democratic Rep.",e[e["South Korea"]=82]="South Korea",e[e.Kuwait=965]="Kuwait",e[e["Cayman Islands"]=1345]="Cayman Islands",e[e.Kazakhstan=7]="Kazakhstan",e[e.Laos=856]="Laos",e[e.Lebanon=961]="Lebanon",e[e["Saint Lucia"]=1758]="Saint Lucia",e[e.Liechtenstein=423]="Liechtenstein",e[e["Sri Lanka"]=94]="Sri Lanka",e[e.Liberia=231]="Liberia",e[e.Lesotho=266]="Lesotho",e[e.Lithuania=370]="Lithuania",e[e.Luxembourg=352]="Luxembourg",e[e.Latvia=371]="Latvia",e[e.Libya=218]="Libya",e[e.Morocco=212]="Morocco",e[e.Monaco=377]="Monaco",e[e.Moldova=373]="Moldova",e[e.Montenegro=382]="Montenegro",e[e.Madagascar=261]="Madagascar",e[e["Marshall Islands"]=692]="Marshall Islands",e[e.Macedonia=389]="Macedonia",e[e.Mali=223]="Mali",e[e.Myanmar=95]="Myanmar",e[e.Mongolia=976]="Mongolia",e[e.Macau=853]="Macau",e[e.Mauritania=222]="Mauritania",e[e.Montserrat=1664]="Montserrat",e[e.Malta=356]="Malta",e[e.Mauritius=230]="Mauritius",e[e.Maldives=960]="Maldives",e[e.Malawi=265]="Malawi",e[e.Mexico=52]="Mexico",e[e.Malaysia=60]="Malaysia",e[e.Mozambique=258]="Mozambique",e[e.Namibia=264]="Namibia",e[e["New Caledonia"]=687]="New Caledonia",e[e.Niger=227]="Niger",e[e.Nigeria=234]="Nigeria",e[e.Nicaragua=505]="Nicaragua",e[e.Netherlands=31]="Netherlands",e[e.Norway=47]="Norway",e[e.Nepal=977]="Nepal",e[e.Nauru=674]="Nauru",e[e["New Zealand"]=64]="New Zealand",e[e.Oman=968]="Oman",e[e.Panama=507]="Panama",e[e.Peru=51]="Peru",e[e["French Polynesia"]=689]="French Polynesia",e[e["Papua New Guinea"]=675]="Papua New Guinea",e[e.Philippines=63]="Philippines",e[e.Pakistan=92]="Pakistan",e[e.Poland=48]="Poland",e[e["Saint Pierreand Miquelon"]=508]="Saint Pierreand Miquelon",e[e["Puerto Rico"]=1787]="Puerto Rico",e[e.Portugal=351]="Portugal",e[e.Palau=680]="Palau",e[e.Paraguay=595]="Paraguay",e[e.Qatar=974]="Qatar",e[e["Réunion Island"]=262]="Réunion Island",e[e.Romania=40]="Romania",e[e.Serbia=381]="Serbia",e[e.Russia=7]="Russia",e[e.Rwanda=250]="Rwanda",e[e["Saudi Arabia"]=966]="Saudi Arabia",e[e["Solomon Islands"]=677]="Solomon Islands",e[e.Seychelles=248]="Seychelles",e[e.Sudan=249]="Sudan",e[e.Sweden=46]="Sweden",e[e.Slovenia=386]="Slovenia",e[e.Slovakia=421]="Slovakia",e[e["Sierra Leone"]=232]="Sierra Leone",e[e["San Marino"]=378]="San Marino",e[e.Senegal=221]="Senegal",e[e.Somalia=252]="Somalia",e[e.Suriname=597]="Suriname",e[e["Sao Tome and Principe"]=239]="Sao Tome and Principe",e[e.ElSalvador=503]="ElSalvador",e[e.Syria=963]="Syria",e[e.Swaziland=268]="Swaziland",e[e["Turksand Caicos Islands"]=1649]="Turksand Caicos Islands",e[e.Chad=235]="Chad",e[e.Togo=228]="Togo",e[e.Thailand=66]="Thailand",e[e.Tajikistan=992]="Tajikistan",e[e["East Timor"]=670]="East Timor",e[e.Turkmenistan=993]="Turkmenistan",e[e.Tunisia=216]="Tunisia",e[e.Tonga=676]="Tonga",e[e.Turkey=90]="Turkey",e[e["Trinidadand Tobago"]=1868]="Trinidadand Tobago",e[e.Taiwan=886]="Taiwan",e[e.Tanzania=255]="Tanzania",e[e.Ukraine=380]="Ukraine",e[e.Uganda=256]="Uganda",e[e["United States"]=1]="United States",e[e.Uruguay=598]="Uruguay",e[e.Uzbekistan=998]="Uzbekistan",e[e["Saint Vincent and The Grenadines"]=1784]="Saint Vincent and The Grenadines",e[e.Venezuela=58]="Venezuela",e[e["VirginIslands,British"]=1284]="VirginIslands,British",e[e.Vietnam=84]="Vietnam",e[e.Vanuatu=678]="Vanuatu",e[e.Samoa=685]="Samoa",e[e.Yemen=967]="Yemen",e[e.Mayotte=269]="Mayotte",e[e["South Africa"]=27]="South Africa",e[e.Zambia=260]="Zambia",e[e.Zimbabwe=263]="Zimbabwe"}(n.NationCode||(n.NationCode={}))},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t(6),r=t(2),o=t(17),i=function(){function e(e){var n=this;this.emitter=e,this.listeners=new Map,this._emit=o(function(e,t,a){return n.emitter.emit(r.SocketEvent.move,e,t,a)},a.config.minMoveInterval,{trailing:!1}),this.emitter.on(r.SocketEvent.push,function(e,t){return n.trigger(e,t)})}return e.prototype.getListeners=function(e){return this.listeners.get(e)||[]},e.prototype.on=function(e,n){this.listeners.set(e,this.getListeners(e).concat([n]))},e.prototype.trigger=function(e,n){this.getListeners(e).forEach(function(e){return e(n)})},e.prototype.emit=function(e,n,t){this._emit(e,n,t)},e}();n.FrameEmitter=i},function(e,n,t){var a=t(18),r=t(3),o="Expected a function";e.exports=function(e,n,t){var i=!0,u=!0;if("function"!=typeof e)throw new TypeError(o);return r(t)&&(i="leading"in t?!!t.leading:i,u="trailing"in t?!!t.trailing:u),a(e,n,{leading:i,maxWait:n,trailing:u})}},function(e,n,t){var a=t(3),r=t(19),o=t(22),i="Expected a function",u=Math.max,s=Math.min;e.exports=function(e,n,t){var c,l,f,p,d,m,y=0,v=!1,h=!1,b=!0;if("function"!=typeof e)throw new TypeError(i);function g(n){var t=c,a=l;return c=l=void 0,y=n,p=e.apply(a,t)}function S(e){var t=e-m;return void 0===m||t>=n||t<0||h&&e-y>=f}function w(){var e=r();if(S(e))return _(e);d=setTimeout(w,function(e){var t=n-(e-m);return h?s(t,f-(e-y)):t}(e))}function _(e){return d=void 0,b&&c?g(e):(c=l=void 0,p)}function T(){var e=r(),t=S(e);if(c=arguments,l=this,m=e,t){if(void 0===d)return function(e){return y=e,d=setTimeout(w,n),v?g(e):p}(m);if(h)return d=setTimeout(w,n),g(m)}return void 0===d&&(d=setTimeout(w,n)),p}return n=o(n)||0,a(t)&&(v=!!t.leading,f=(h="maxWait"in t)?u(o(t.maxWait)||0,n):f,b="trailing"in t?!!t.trailing:b),T.cancel=function(){void 0!==d&&clearTimeout(d),y=0,c=m=l=d=void 0},T.flush=function(){return void 0===d?p:_(r())},T}},function(e,n,t){var a=t(7);e.exports=function(){return a.Date.now()}},function(e,n,t){(function(n){var t="object"==typeof n&&n&&n.Object===Object&&n;e.exports=t}).call(this,t(21))},function(e,n){var t;t=function(){return this}();try{t=t||new Function("return this")()}catch(e){"object"==typeof window&&(t=window)}e.exports=t},function(e,n,t){var a=t(3),r=t(23),o=NaN,i=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,c=/^0o[0-7]+$/i,l=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(r(e))return o;if(a(e)){var n="function"==typeof e.valueOf?e.valueOf():e;e=a(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(i,"");var t=s.test(e);return t||c.test(e)?l(e.slice(2),t?2:8):u.test(e)?o:+e}},function(e,n,t){var a=t(24),r=t(27),o="[object Symbol]";e.exports=function(e){return"symbol"==typeof e||r(e)&&a(e)==o}},function(e,n,t){var a=t(8),r=t(25),o=t(26),i="[object Null]",u="[object Undefined]",s=a?a.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?u:i:s&&s in Object(e)?r(e):o(e)}},function(e,n,t){var a=t(8),r=Object.prototype,o=r.hasOwnProperty,i=r.toString,u=a?a.toStringTag:void 0;e.exports=function(e){var n=o.call(e,u),t=e[u];try{e[u]=void 0;var a=!0}catch(e){}var r=i.call(e);return a&&(n?e[u]=t:delete e[u]),r}},function(e,n){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},function(e,n){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,n,t){"use strict";var a,r=this&&this.__extends||(a=function(e,n){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}a(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)});Object.defineProperty(n,"__esModule",{value:!0});var o=t(0);!function(e){var n=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n}(o.Component);e.Create=n}(n.Template||(n.Template={})),n.registerOnElf=function(e,n){window.ElfLinker&&window.ElfLinker.registerOnElf(e,n)}},function(e,n,t){"use strict";var a,r=this&&this.__extends||(a=function(e,n){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}a(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)});Object.defineProperty(n,"__esModule",{value:!0});var o=t(0),i=t(10),u=t(4),s=t(9),c=t(1),l=t(5),f=function(e){function n(n){var t=e.call(this,n)||this;return t.renderContent=function(){var e=t.props,n=e.playerState,a=e.frameEmitter,r=t.state,c=r.answer,f=r.name,p=r.key;switch(n.status){case l.STATUS.instruction:return o.createElement("div",{className:u.stage},o.createElement("p",null,"请回答以下五个情景题"),o.createElement("p",null,"如果面对以下五个情景，你将会如何决定你自己和你未来组员的补贴方案呢？"),o.createElement("p",null,"请注意：你未来的组员将会是随机匹配产生。你所遇到的情景也是随机选出，你的回答将决定你和你组员的真实补贴方案。换句话说，你的选择将可能成为现实，而你和你组员的补贴也会由此决定。"),o.createElement("p",null,"同理，你未来组员也在做选择，他/她的回答也会在部分日期决定你和他/她的补贴方案。"),o.createElement("p",null,"当你或者你组员的回答被用来决定小组的补贴方案，你们会被告知补贴方案不是由督导组指定、而是由你们自己的回答决定，但是不会告知因为哪位组员、哪个情景题而决定的。"),o.createElement("p",null,"现在让我们做出选择吧！"),o.createElement(i.Button,{onClick:function(){a.emit(l.MoveType.prepare)}},"确定"));case l.STATUS.playing:var d=n.answers.length;return o.createElement("div",{className:u.stage},l.PAGES[d].instructions.map(function(e,n){return o.createElement("p",{key:n},e)}),o.createElement("p",null,o.createElement("label",null,"你的选择是："),o.createElement(i.Radio.Group,{onChange:function(e){return t.setState({answer:e.target.value})},value:c},o.createElement(i.Radio,{value:"A"},"A"),o.createElement(i.Radio,{value:"B"},"B"))),o.createElement(i.Button,{onClick:function(){if(!c)return s.Toast.warn("请选择");a.emit(l.MoveType.shout,{answer:c,index:d},function(e){s.Toast.warn(e)}),t.setState({answer:void 0})}},"确定"));case l.STATUS.info:return o.createElement("div",{className:u.stage},o.createElement("div",{className:u.info},o.createElement("label",null,"你的姓名是："),o.createElement(i.Input,{value:f,onChange:function(e){return t.setState({name:e.target.value})}})),o.createElement("div",{className:u.info},o.createElement("label",null,"你的编号是（只填数字）："),o.createElement(i.Input,{value:p,onChange:function(e){return t.setState({key:e.target.value})}})),o.createElement(i.Button,{onClick:function(){if(!f||!p||Number.isNaN(+p))return s.Toast.warn("请填写正确信息");a.emit(l.MoveType.info,{name:f,key:p},function(e){s.Toast.warn(e)})}},"确定"));case l.STATUS.end:return o.createElement("div",{className:u.stage},o.createElement("p",null,"感谢你的选择！我们将会在未来的部分日期根据你的选择安排你和你组员的补贴方案！"))}},t.state={answer:void 0,key:void 0,name:void 0},t}return r(n,e),n.prototype.render=function(){var e=this.renderContent();return o.createElement("section",{className:u.play},e)},n}(c.Core.Play);n.Play=f},function(e,n,t){(n=e.exports=t(31)(!1)).push([e.i,"/*************** variables ******************/\n/*************** keyframe ******************/\n@keyframes easyIn_2U4y {\n  from {\n    opacity: 0;\n    transform: translateY(1rem); }\n  to {\n    opacity: 1;\n    transform: translateY(0); } }\n\n/*************** mixin ******************/\n/*************** function ******************/\n.play_CYPT {\n  padding: 1rem;\n  font-size: 16px; }\n  .play_CYPT .stage_1Sf2 > p {\n    margin-bottom: 1rem; }\n  .play_CYPT .info_2yct {\n    margin-bottom: 1rem; }\n    .play_CYPT .info_2yct > label {\n      display: block;\n      margin-bottom: 5px; }\n    .play_CYPT .info_2yct > input {\n      max-width: 300px; }\n\n.play4Owner_z8X7 {\n  padding: 1rem; }\n  .play4Owner_z8X7 .exportBtn_2K4A {\n    display: inline-block;\n    margin-bottom: 1rem; }\n",""]),n.locals={play:"play_CYPT",stage:"stage_1Sf2",info:"info_2yct",play4Owner:"play4Owner_z8X7",exportBtn:"exportBtn_2K4A",easyIn:"easyIn_2U4y"}},function(e,n,t){"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map(function(n){var t=function(e,n){var t=e[1]||"",a=e[3];if(!a)return t;if(n&&"function"==typeof btoa){var r=(i=a,u=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(u),"/*# ".concat(s," */")),o=a.sources.map(function(e){return"/*# sourceURL=".concat(a.sourceRoot).concat(e," */")});return[t].concat(o).concat([r]).join("\n")}var i,u,s;return[t].join("\n")}(n,e);return n[2]?"@media ".concat(n[2],"{").concat(t,"}"):t}).join("")},n.i=function(e,t){"string"==typeof e&&(e=[[null,e,""]]);for(var a={},r=0;r<this.length;r++){var o=this[r][0];null!=o&&(a[o]=!0)}for(var i=0;i<e.length;i++){var u=e[i];null!=u[0]&&a[u[0]]||(t&&!u[2]?u[2]=t:t&&(u[2]="(".concat(u[2],") and (").concat(t,")")),n.push(u))}},n}},function(e,n,t){var a,r,o={},i=(a=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=a.apply(this,arguments)),r}),u=function(e){var n={};return function(e,t){if("function"==typeof e)return e();if(void 0===n[e]){var a=function(e,n){return n?n.querySelector(e):document.querySelector(e)}.call(this,e,t);if(window.HTMLIFrameElement&&a instanceof window.HTMLIFrameElement)try{a=a.contentDocument.head}catch(e){a=null}n[e]=a}return n[e]}}(),s=null,c=0,l=[],f=t(33);function p(e,n){for(var t=0;t<e.length;t++){var a=e[t],r=o[a.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](a.parts[i]);for(;i<a.parts.length;i++)r.parts.push(b(a.parts[i],n))}else{var u=[];for(i=0;i<a.parts.length;i++)u.push(b(a.parts[i],n));o[a.id]={id:a.id,refs:1,parts:u}}}}function d(e,n){for(var t=[],a={},r=0;r<e.length;r++){var o=e[r],i=n.base?o[0]+n.base:o[0],u={css:o[1],media:o[2],sourceMap:o[3]};a[i]?a[i].parts.push(u):t.push(a[i]={id:i,parts:[u]})}return t}function m(e,n){var t=u(e.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var a=l[l.length-1];if("top"===e.insertAt)a?a.nextSibling?t.insertBefore(n,a.nextSibling):t.appendChild(n):t.insertBefore(n,t.firstChild),l.push(n);else if("bottom"===e.insertAt)t.appendChild(n);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=u(e.insertAt.before,t);t.insertBefore(n,r)}}function y(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var n=l.indexOf(e);n>=0&&l.splice(n,1)}function v(e){var n=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var a=function(){0;return t.nc}();a&&(e.attrs.nonce=a)}return h(n,e.attrs),m(e,n),n}function h(e,n){Object.keys(n).forEach(function(t){e.setAttribute(t,n[t])})}function b(e,n){var t,a,r,o;if(n.transform&&e.css){if(!(o="function"==typeof n.transform?n.transform(e.css):n.transform.default(e.css)))return function(){};e.css=o}if(n.singleton){var i=c++;t=s||(s=v(n)),a=w.bind(null,t,i,!1),r=w.bind(null,t,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=function(e){var n=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",h(n,e.attrs),m(e,n),n}(n),a=function(e,n,t){var a=t.css,r=t.sourceMap,o=void 0===n.convertToAbsoluteUrls&&r;(n.convertToAbsoluteUrls||o)&&(a=f(a));r&&(a+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([a],{type:"text/css"}),u=e.href;e.href=URL.createObjectURL(i),u&&URL.revokeObjectURL(u)}.bind(null,t,n),r=function(){y(t),t.href&&URL.revokeObjectURL(t.href)}):(t=v(n),a=function(e,n){var t=n.css,a=n.media;a&&e.setAttribute("media",a);if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}.bind(null,t),r=function(){y(t)});return a(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;a(e=n)}else r()}}e.exports=function(e,n){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(n=n||{}).attrs="object"==typeof n.attrs?n.attrs:{},n.singleton||"boolean"==typeof n.singleton||(n.singleton=i()),n.insertInto||(n.insertInto="head"),n.insertAt||(n.insertAt="bottom");var t=d(e,n);return p(t,n),function(e){for(var a=[],r=0;r<t.length;r++){var i=t[r];(u=o[i.id]).refs--,a.push(u)}e&&p(d(e,n),n);for(r=0;r<a.length;r++){var u;if(0===(u=a[r]).refs){for(var s=0;s<u.parts.length;s++)u.parts[s]();delete o[u.id]}}}};var g,S=(g=[],function(e,n){return g[e]=n,g.filter(Boolean).join("\n")});function w(e,n,t,a){var r=t?"":a.css;if(e.styleSheet)e.styleSheet.cssText=S(n,r);else{var o=document.createTextNode(r),i=e.childNodes;i[n]&&e.removeChild(i[n]),i.length?e.insertBefore(o,i[n]):e.appendChild(o)}}},function(e,n){e.exports=function(e){var n="undefined"!=typeof window&&window.location;if(!n)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var t=n.protocol+"//"+n.host,a=t+n.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,n){var r,o=n.trim().replace(/^"(.*)"$/,function(e,n){return n}).replace(/^'(.*)'$/,function(e,n){return n});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?e:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?t+o:a+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")})}},function(e,n,t){"use strict";var a,r,o=this&&this.__extends||(a=function(e,n){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}a(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)});Object.defineProperty(n,"__esModule",{value:!0});var i=t(0),u=t(4),s=t(10),c=t(1),l=t(5),f=((r={})[l.STATUS.instruction]="开场介绍",r[l.STATUS.playing]="答题中",r[l.STATUS.info]="填写信息",r[l.STATUS.end]="已完成",r),p=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return n.state={},n.getPlayersData=function(e){return Object.keys(e).map(function(n){var t=e[n];return{key:t.key||"-",status:f[t.status]}})},n}return o(n,e),n.prototype.render=function(){var e=this.props,n=e.game,t=e.playerStates;return i.createElement("section",{className:u.play4Owner},i.createElement("a",{className:u.exportBtn,href:c.Request.instance(l.namespace).buildUrl(l.FetchRoute.exportXlsPlaying,{gameId:n.id},{sheetType:l.SheetType.result})},"导出结果"),i.createElement(s.Table,{className:u.table,dataSource:this.getPlayersData(t),columns:[{title:"编号",dataIndex:"key",key:"key"},{title:"阶段",dataIndex:"status",key:"status"}]}))},n}(c.Core.Play4Owner);n.Play4Owner=p},function(e,n,t){"use strict";var a,r=this&&this.__extends||(a=function(e,n){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}a(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)});Object.defineProperty(n,"__esModule",{value:!0});var o=t(0),i=t(4),u=t(1),s=t(5),c=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return r(n,e),n.prototype.render=function(){var e=this.props.game;return o.createElement("section",{className:i.result4Owner},o.createElement("a",{className:i.exportBtn,href:u.Request.instance(s.namespace).buildUrl(s.FetchRoute.exportXls,{gameId:e.id},{sheetType:s.SheetType.result})},"导出结果"))},n}(u.Core.Result4Owner);n.Result4Owner=c}]);