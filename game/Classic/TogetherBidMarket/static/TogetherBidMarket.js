!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/bespoke/TogetherBidMarket/static/",n(n.s=9)}([function(e,t){e.exports=React},function(e,t,n){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__assign||function(){return(i=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),l=n(10),u=n(26),s=n(4);!function(e){function t(e){return o.createElement("div",{style:{fontSize:"2rem",margin:"2rem",textAlign:"center",color:"#999"}},s.Lang.extractLang(e).label)}var n=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return a(n,e),n.prototype.render=function(){return o.createElement(t,{label:["无可配置参数","No parameters to config"]})},n}(u.Template.Create);e.Create=n;var r=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return a(n,e),n.prototype.render=function(){return o.createElement(t,{label:["实验进行中","Playing..."]})},n}(o.Component);e.Play=r;var i=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return a(n,e),n.prototype.render=function(){return o.createElement(t,{label:["实验进行中","Playing..."]})},n}(o.Component);e.Play4Owner=i;var l=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return a(n,e),n.prototype.render=function(){return o.createElement(t,{label:["实验已结束","GAME OVER"]})},n}(o.Component);e.Result=l;var c=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return a(n,e),n.prototype.render=function(){return o.createElement(t,{label:["实验已结束","GAME OVER"]})},n}(o.Component);e.Result4Owner=c}(t.Core||(t.Core={}));var c=function(e){function t(t){var n=e.call(this)||this;return n.namespace=t,n}return a(t,e),t.instance=function(e){return this._instance||(this._instance=new t(e)),this._instance},t.prototype.buildUrl=function(t,n,r){return void 0===n&&(n={}),void 0===r&&(r={}),e.prototype.buildUrl.call(this,"/"+l.config.rootName+"/"+this.namespace+t,n,r)},t}(s.BaseRequest);t.Request=c,t.registerOnFramework=function(e,t){window.BespokeServer?window.BespokeServer.registerOnBespoke(t):u.registerOnElf(e,i({localeNames:[e]},t))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.connection="connection",e.disconnect="disconnect",e.online="online",e.move="move",e.push="push",e.syncGameState_json="SGJ",e.syncPlayerState_json="SPJ",e.changeGameState_diff="CGD",e.changePlayerState_diff="CPD"}(t.SocketEvent||(t.SocketEvent={})),function(e){e.switchGameStatus="switchGameStatus"}(t.CoreMove||(t.CoreMove={})),function(e){e[e.started=0]="started",e[e.paused=1]="paused",e[e.over=2]="over"}(t.GameStatus||(t.GameStatus={})),function(e){e[e.default=0]="default",e[e.diff=1]="diff"}(t.SyncStrategy||(t.SyncStrategy={}))},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t){e.exports=ElfComponent},function(e,t,n){var r=n(28);"string"==typeof r&&(r=[[e.i,r,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};n(30)(r,a);r.locals&&(e.exports=r.locals)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.config={rootName:"bespoke",apiPrefix:"api",socketPath:function(e){return"/bespoke/"+e+"/socket.io"},devPort:{client:8080,server:8081},minMoveInterval:500,vcodeLifetime:60}},function(e,t,n){var r=n(18),a="object"==typeof self&&self&&self.Object===Object&&self,i=r||a||Function("return this")();e.exports=i},function(e,t,n){var r=n(7).Symbol;e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),a=n(27),i=n(32),o=n(34);r.registerOnFramework("TogetherBidMarket",{localeNames:["集合竞价","TogetherBidMarket"],Create:a.Create,Play:i.Play,Result:o.Result})},function(e,t,n){"use strict";function r(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2);t.baseEnum=a,r(n(11)),r(n(2)),r(n(14)),r(n(6))},function(e,t,n){"use strict";function r(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}Object.defineProperty(t,"__esModule",{value:!0}),r(n(12)),r(n(13))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.csrfCookieKey="_csrf"},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.student=0]="student",e[e.teacher=1]="teacher"}(t.AcademusRole||(t.AcademusRole={})),function(e){e[e.invalidInput=0]="invalidInput",e[e.success=1]="success",e[e.notFound=2]="notFound",e[e.serverError=3]="serverError"}(t.ResponseCode||(t.ResponseCode={})),function(e){e.owner="o",e.player="p",e.clientRobot="cr",e.serverRobot="sr"}(t.Actor||(t.Actor={})),function(e){e[e.China=86]="China",e[e.American=1]="American",e[e.Hongkong=852]="Hongkong",e[e.Singapore=65]="Singapore",e[e.UK=44]="UK",e[e.Andorra=376]="Andorra",e[e["United Arab Emirates"]=971]="United Arab Emirates",e[e.Afghanistan=93]="Afghanistan",e[e["Antigua and Barbuda"]=1268]="Antigua and Barbuda",e[e.Anguilla=1264]="Anguilla",e[e.Albania=355]="Albania",e[e.Armenia=374]="Armenia",e[e.Angola=244]="Angola",e[e.Argentina=54]="Argentina",e[e["American Samoa"]=1684]="American Samoa",e[e.Austria=43]="Austria",e[e.Australia=61]="Australia",e[e.Aruba=297]="Aruba",e[e.Azerbaijan=994]="Azerbaijan",e[e["Bosniaand Herzegovina"]=387]="Bosniaand Herzegovina",e[e.Barbados=1246]="Barbados",e[e.Bangladesh=880]="Bangladesh",e[e.Belgium=32]="Belgium",e[e["Burkina Faso"]=226]="Burkina Faso",e[e.Bulgaria=359]="Bulgaria",e[e.Bahrain=973]="Bahrain",e[e.Burundi=257]="Burundi",e[e.Benin=229]="Benin",e[e.Bermuda=1441]="Bermuda",e[e.Brunei=673]="Brunei",e[e.Bolivia=591]="Bolivia",e[e["Caribisch Nederland"]=599]="Caribisch Nederland",e[e.Brazil=55]="Brazil",e[e.Bahamas=1242]="Bahamas",e[e.Bhutan=975]="Bhutan",e[e.Botswana=267]="Botswana",e[e.Belarus=375]="Belarus",e[e.Belize=501]="Belize",e[e.Canada=1]="Canada",e[e["Democratic Republic of theCongo"]=243]="Democratic Republic of theCongo",e[e["Central African Republic"]=236]="Central African Republic",e[e["Republic Of The Congo"]=242]="Republic Of The Congo",e[e.Switzerland=41]="Switzerland",e[e["Ivory Coast"]=225]="Ivory Coast",e[e["Cook Islands"]=682]="Cook Islands",e[e.Chile=56]="Chile",e[e.Cameroon=237]="Cameroon",e[e.Colombia=57]="Colombia",e[e.CostaRica=506]="CostaRica",e[e.Cuba=53]="Cuba",e[e["Cape Verde"]=238]="Cape Verde",e[e.Curacao=599]="Curacao",e[e.Cyprus=357]="Cyprus",e[e.Czech=420]="Czech",e[e.Germany=49]="Germany",e[e.Djibouti=253]="Djibouti",e[e.Denmark=45]="Denmark",e[e.Dominica=1767]="Dominica",e[e["dominican republic"]=1809]="dominican republic",e[e.Algeria=213]="Algeria",e[e.Ecuador=593]="Ecuador",e[e.Estonia=372]="Estonia",e[e.Egypt=20]="Egypt",e[e.Eritrea=291]="Eritrea",e[e.Spain=34]="Spain",e[e.Ethiopia=251]="Ethiopia",e[e.Finland=358]="Finland",e[e.Fiji=679]="Fiji",e[e.Micronesia=691]="Micronesia",e[e["Faroe Islands"]=298]="Faroe Islands",e[e.France=33]="France",e[e.Gabon=241]="Gabon",e[e["United Kingdom"]=44]="United Kingdom",e[e.Grenada=1473]="Grenada",e[e.Georgia=995]="Georgia",e[e["French Guiana"]=594]="French Guiana",e[e.Ghana=233]="Ghana",e[e.Gibraltar=350]="Gibraltar",e[e.Greenland=299]="Greenland",e[e.Gambia=220]="Gambia",e[e.Guinea=224]="Guinea",e[e.Guadeloupe=590]="Guadeloupe",e[e["Equatorial Guinea"]=240]="Equatorial Guinea",e[e.Greece=30]="Greece",e[e.Guatemala=502]="Guatemala",e[e.Guam=1671]="Guam",e[e["Guinea-Bissau"]=245]="Guinea-Bissau",e[e.Guyana=592]="Guyana",e[e["Hong Kong"]=852]="Hong Kong",e[e.Honduras=504]="Honduras",e[e.Croatia=385]="Croatia",e[e.Haiti=509]="Haiti",e[e.Hungary=36]="Hungary",e[e.Indonesia=62]="Indonesia",e[e.Ireland=353]="Ireland",e[e.Israel=972]="Israel",e[e.India=91]="India",e[e.Iraq=964]="Iraq",e[e.Iran=98]="Iran",e[e.Iceland=354]="Iceland",e[e.Italy=39]="Italy",e[e.Jamaica=1876]="Jamaica",e[e.Jordan=962]="Jordan",e[e.Japan=81]="Japan",e[e.Kenya=254]="Kenya",e[e.Kyrgyzstan=996]="Kyrgyzstan",e[e.Cambodia=855]="Cambodia",e[e.Kiribati=686]="Kiribati",e[e.Comoros=269]="Comoros",e[e["Saint Kitts and Nevis"]=1869]="Saint Kitts and Nevis",e[e["Korea Democratic Rep."]=850]="Korea Democratic Rep.",e[e["South Korea"]=82]="South Korea",e[e.Kuwait=965]="Kuwait",e[e["Cayman Islands"]=1345]="Cayman Islands",e[e.Kazakhstan=7]="Kazakhstan",e[e.Laos=856]="Laos",e[e.Lebanon=961]="Lebanon",e[e["Saint Lucia"]=1758]="Saint Lucia",e[e.Liechtenstein=423]="Liechtenstein",e[e["Sri Lanka"]=94]="Sri Lanka",e[e.Liberia=231]="Liberia",e[e.Lesotho=266]="Lesotho",e[e.Lithuania=370]="Lithuania",e[e.Luxembourg=352]="Luxembourg",e[e.Latvia=371]="Latvia",e[e.Libya=218]="Libya",e[e.Morocco=212]="Morocco",e[e.Monaco=377]="Monaco",e[e.Moldova=373]="Moldova",e[e.Montenegro=382]="Montenegro",e[e.Madagascar=261]="Madagascar",e[e["Marshall Islands"]=692]="Marshall Islands",e[e.Macedonia=389]="Macedonia",e[e.Mali=223]="Mali",e[e.Myanmar=95]="Myanmar",e[e.Mongolia=976]="Mongolia",e[e.Macau=853]="Macau",e[e.Mauritania=222]="Mauritania",e[e.Montserrat=1664]="Montserrat",e[e.Malta=356]="Malta",e[e.Mauritius=230]="Mauritius",e[e.Maldives=960]="Maldives",e[e.Malawi=265]="Malawi",e[e.Mexico=52]="Mexico",e[e.Malaysia=60]="Malaysia",e[e.Mozambique=258]="Mozambique",e[e.Namibia=264]="Namibia",e[e["New Caledonia"]=687]="New Caledonia",e[e.Niger=227]="Niger",e[e.Nigeria=234]="Nigeria",e[e.Nicaragua=505]="Nicaragua",e[e.Netherlands=31]="Netherlands",e[e.Norway=47]="Norway",e[e.Nepal=977]="Nepal",e[e.Nauru=674]="Nauru",e[e["New Zealand"]=64]="New Zealand",e[e.Oman=968]="Oman",e[e.Panama=507]="Panama",e[e.Peru=51]="Peru",e[e["French Polynesia"]=689]="French Polynesia",e[e["Papua New Guinea"]=675]="Papua New Guinea",e[e.Philippines=63]="Philippines",e[e.Pakistan=92]="Pakistan",e[e.Poland=48]="Poland",e[e["Saint Pierreand Miquelon"]=508]="Saint Pierreand Miquelon",e[e["Puerto Rico"]=1787]="Puerto Rico",e[e.Portugal=351]="Portugal",e[e.Palau=680]="Palau",e[e.Paraguay=595]="Paraguay",e[e.Qatar=974]="Qatar",e[e["Réunion Island"]=262]="Réunion Island",e[e.Romania=40]="Romania",e[e.Serbia=381]="Serbia",e[e.Russia=7]="Russia",e[e.Rwanda=250]="Rwanda",e[e["Saudi Arabia"]=966]="Saudi Arabia",e[e["Solomon Islands"]=677]="Solomon Islands",e[e.Seychelles=248]="Seychelles",e[e.Sudan=249]="Sudan",e[e.Sweden=46]="Sweden",e[e.Slovenia=386]="Slovenia",e[e.Slovakia=421]="Slovakia",e[e["Sierra Leone"]=232]="Sierra Leone",e[e["San Marino"]=378]="San Marino",e[e.Senegal=221]="Senegal",e[e.Somalia=252]="Somalia",e[e.Suriname=597]="Suriname",e[e["Sao Tome and Principe"]=239]="Sao Tome and Principe",e[e.ElSalvador=503]="ElSalvador",e[e.Syria=963]="Syria",e[e.Swaziland=268]="Swaziland",e[e["Turksand Caicos Islands"]=1649]="Turksand Caicos Islands",e[e.Chad=235]="Chad",e[e.Togo=228]="Togo",e[e.Thailand=66]="Thailand",e[e.Tajikistan=992]="Tajikistan",e[e["East Timor"]=670]="East Timor",e[e.Turkmenistan=993]="Turkmenistan",e[e.Tunisia=216]="Tunisia",e[e.Tonga=676]="Tonga",e[e.Turkey=90]="Turkey",e[e["Trinidadand Tobago"]=1868]="Trinidadand Tobago",e[e.Taiwan=886]="Taiwan",e[e.Tanzania=255]="Tanzania",e[e.Ukraine=380]="Ukraine",e[e.Uganda=256]="Uganda",e[e["United States"]=1]="United States",e[e.Uruguay=598]="Uruguay",e[e.Uzbekistan=998]="Uzbekistan",e[e["Saint Vincent and The Grenadines"]=1784]="Saint Vincent and The Grenadines",e[e.Venezuela=58]="Venezuela",e[e["VirginIslands,British"]=1284]="VirginIslands,British",e[e.Vietnam=84]="Vietnam",e[e.Vanuatu=678]="Vanuatu",e[e.Samoa=685]="Samoa",e[e.Yemen=967]="Yemen",e[e.Mayotte=269]="Mayotte",e[e["South Africa"]=27]="South Africa",e[e.Zambia=260]="Zambia",e[e.Zimbabwe=263]="Zimbabwe"}(t.NationCode||(t.NationCode={}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),a=n(2),i=n(15),o=function(){function e(e){var t=this;this.emitter=e,this.listeners=new Map,this._emit=i(function(e,n,r){return t.emitter.emit(a.SocketEvent.move,e,n,r)},r.config.minMoveInterval,{trailing:!1}),this.emitter.on(a.SocketEvent.push,function(e,n){return t.trigger(e,n)})}return e.prototype.getListeners=function(e){return this.listeners.get(e)||[]},e.prototype.on=function(e,t){this.listeners.set(e,this.getListeners(e).concat([t]))},e.prototype.trigger=function(e,t){this.getListeners(e).forEach(function(e){return e(t)})},e.prototype.emit=function(e,t,n){this._emit(e,t,n)},e}();t.FrameEmitter=o},function(e,t,n){var r=n(16),a=n(3),i="Expected a function";e.exports=function(e,t,n){var o=!0,l=!0;if("function"!=typeof e)throw new TypeError(i);return a(n)&&(o="leading"in n?!!n.leading:o,l="trailing"in n?!!n.trailing:l),r(e,t,{leading:o,maxWait:t,trailing:l})}},function(e,t,n){var r=n(3),a=n(17),i=n(20),o="Expected a function",l=Math.max,u=Math.min;e.exports=function(e,t,n){var s,c,p,f,d,m,h=0,y=!1,v=!1,b=!0;if("function"!=typeof e)throw new TypeError(o);function g(t){var n=s,r=c;return s=c=void 0,h=t,f=e.apply(r,n)}function E(e){var n=e-m;return void 0===m||n>=t||n<0||v&&e-h>=p}function S(){var e=a();if(E(e))return _(e);d=setTimeout(S,function(e){var n=t-(e-m);return v?u(n,p-(e-h)):n}(e))}function _(e){return d=void 0,b&&s?g(e):(s=c=void 0,f)}function M(){var e=a(),n=E(e);if(s=arguments,c=this,m=e,n){if(void 0===d)return function(e){return h=e,d=setTimeout(S,t),y?g(e):f}(m);if(v)return d=setTimeout(S,t),g(m)}return void 0===d&&(d=setTimeout(S,t)),f}return t=i(t)||0,r(n)&&(y=!!n.leading,p=(v="maxWait"in n)?l(i(n.maxWait)||0,t):p,b="trailing"in n?!!n.trailing:b),M.cancel=function(){void 0!==d&&clearTimeout(d),h=0,s=m=c=d=void 0},M.flush=function(){return void 0===d?f:_(a())},M}},function(e,t,n){var r=n(7);e.exports=function(){return r.Date.now()}},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(19))},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){var r=n(3),a=n(21),i=NaN,o=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,s=/^0o[0-7]+$/i,c=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(a(e))return i;if(r(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=r(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var n=u.test(e);return n||s.test(e)?c(e.slice(2),n?2:8):l.test(e)?i:+e}},function(e,t,n){var r=n(22),a=n(25),i="[object Symbol]";e.exports=function(e){return"symbol"==typeof e||a(e)&&r(e)==i}},function(e,t,n){var r=n(8),a=n(23),i=n(24),o="[object Null]",l="[object Undefined]",u=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?l:o:u&&u in Object(e)?a(e):i(e)}},function(e,t,n){var r=n(8),a=Object.prototype,i=a.hasOwnProperty,o=a.toString,l=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var a=o.call(e);return r&&(t?e[l]=n:delete e[l]),a}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var i=n(0);!function(e){var t=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return a(t,e),t}(i.Component);e.Create=t}(t.Template||(t.Template={})),t.registerOnElf=function(e,t){window.ElfLinker&&window.ElfLinker.registerOnElf(e,t)}},function(e,t,n){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(5),l=n(1),u=n(4),s=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={rounds:3,groupSize:2,buyerCapitalMin:5e4,buyerCapitalMax:1e5,buyerPrivateMin:65,buyerPrivateMax:80,sellerQuotaMin:1e3,sellerQuotaMax:2e3,sellerPrivateMin:30,sellerPrivateMax:45,positions:[]},t.genPositions=function(){var e=t.state,n=e.groupSize,r=e.rounds,a=Array(n).fill(null).map(function(e,n){return{role:n%2,privateValues:Array(r).fill(null).map(function(){return t.genPrivateValue(n%2)}),startingPrices:Array(r).fill(null).map(function(){return t.genStartingPrice(n%2)}),startingQuotas:Array(r).fill(null).map(function(){return t.genStartingQuota(n%2)})}});t.setState({positions:a})},t.genPrivateValue=function(e){var n,r,a=t.state,i=a.buyerPrivateMin,o=a.buyerPrivateMax,l=a.sellerPrivateMin,u=a.sellerPrivateMax;return 0===e?(n=Math.floor(i),r=Math.floor(o)):(n=Math.floor(l),r=Math.floor(u)),c(100*n,100*r)/100},t.setRole=function(e){var n=t.state.positions;n[e].role=0===n[e].role?1:0,t.setState({positions:n})},t.setPositions=function(e,n,r,a){var i=t.state.positions;i[r][n][a]=e,t.setState({positions:i})},t.edit=function(){(0,t.props.setSubmitable)(!1)},t.done=function(){var e=t.props,n=e.setParams,r=e.setSubmitable,a=t.state;n({rounds:a.rounds,groupSize:a.groupSize,positions:a.positions}),r(!0)},t}return a(t,e),t.prototype.componentDidMount=function(){(0,this.props.setSubmitable)(!1)},t.prototype.genStartingPrice=function(e){if(1===e)return 0;var t=this.state,n=t.buyerCapitalMin,r=t.buyerCapitalMax;return 100*c(Math.floor(n)/100,Math.floor(r)/100)},t.prototype.genStartingQuota=function(e){if(0===e)return 0;var t=this.state,n=t.sellerQuotaMin,r=t.sellerQuotaMax;return 100*c(Math.floor(n)/100,Math.floor(r)/100)},t.prototype.render=function(){var e=this,t=this.props.submitable,n=this.state,r=n.rounds,a=n.positions,l=n.groupSize,s=n.buyerCapitalMin,c=n.buyerCapitalMax,p=n.buyerPrivateMin,f=n.buyerPrivateMax,d=n.sellerQuotaMin,m=n.sellerQuotaMax,h=n.sellerPrivateMin,y=n.sellerPrivateMax;return i.createElement("div",{className:o.create},i.createElement("ul",{className:o.configFields},i.createElement("li",null,i.createElement(u.Label,{label:"轮次"}),i.createElement(u.RangeInput,{value:r,min:1,max:10,onChange:function(t){return e.setState({rounds:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"每组人数"}),i.createElement(u.RangeInput,{value:l,min:2,max:12,onChange:function(t){return e.setState({groupSize:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"买家初始资金下限"}),i.createElement(u.Input,{value:s,onChange:function(t){return e.setState({buyerCapitalMin:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"买家初始资金上限"}),i.createElement(u.Input,{value:c,onChange:function(t){return e.setState({buyerCapitalMax:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"买家心理价值下限"}),i.createElement(u.Input,{value:p,onChange:function(t){return e.setState({buyerPrivateMin:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"买家心理价值上限"}),i.createElement(u.Input,{value:f,onChange:function(t){return e.setState({buyerPrivateMax:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"卖家股票配额下限"}),i.createElement(u.Input,{value:d,onChange:function(t){return e.setState({sellerQuotaMin:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"卖家股票配额上限"}),i.createElement(u.Input,{value:m,onChange:function(t){return e.setState({sellerQuotaMax:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"卖家心理价值下限"}),i.createElement(u.Input,{value:h,onChange:function(t){return e.setState({sellerPrivateMin:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Label,{label:"卖家心理价值上限"}),i.createElement(u.Input,{value:y,onChange:function(t){return e.setState({sellerPrivateMax:parseInt(t.target.value)})}})),i.createElement("li",null,i.createElement(u.Button,{label:"生成参数",onClick:function(){return e.genPositions()}}))),i.createElement("table",{className:o.privatePriceTable},i.createElement("thead",null,i.createElement("tr",null,i.createElement("td",null,"玩家"),i.createElement("td",null,"角色"),i.createElement("td",null,"心理价值"),i.createElement("td",null,"初始资金"),i.createElement("td",null,"股票配额"))),a.map(function(t,n){return i.createElement("tbody",{key:"tb"+n},i.createElement("tr",null,i.createElement("td",null,"Player "+(n+1)),i.createElement("td",null,i.createElement("a",{style:{color:0===t.role?"blue":"#333"},onClick:e.setRole.bind(e,n)},"Buyer"),i.createElement("a",{style:{color:1===t.role?"blue":"#333"},onClick:e.setRole.bind(e,n)},"Seller")),i.createElement("td",null,t.privateValues.map(function(t,r){return i.createElement("li",{key:r},i.createElement(u.Label,{label:"第 "+(r+1)+" 轮"}),i.createElement(u.Input,{type:"number",value:t,onChange:function(t){return e.setPositions(+t.target.value,"privateValues",n,r)}}))})),i.createElement("td",null,t.startingPrices.map(function(t,r){return i.createElement("li",{key:r},i.createElement(u.Label,{label:"第 "+(r+1)+" 轮"}),i.createElement(u.Input,{type:"number",value:t,onChange:function(t){return e.setPositions(+t.target.value,"startingPrices",n,r)}}))})),i.createElement("td",null,t.startingQuotas.map(function(t,r){return i.createElement("li",{key:r},i.createElement(u.Label,{label:"第 "+(r+1)+" 轮"}),i.createElement(u.Input,{type:"number",value:t,onChange:function(t){return e.setPositions(+t.target.value,"startingQuotas",n,r)}}))}))))})),i.createElement("div",{className:o.btnSwitch},t?i.createElement("a",{onClick:function(){return e.edit()}},"重新编辑"):i.createElement("a",{onClick:function(){return e.done()}},"确认参数")))},t}(l.Core.Create);function c(e,t){return Math.floor(Math.random()*(t-e+1))+e}t.Create=s},function(e,t,n){(t=e.exports=n(29)(!1)).push([e.i,"/*************** variables ******************/\n/*************** keyframe ******************/\n@keyframes easyIn_8fva {\n  from {\n    opacity: 0;\n    transform: translateY(1rem); }\n  to {\n    opacity: 1;\n    transform: translateY(0); } }\n\n/*************** mixin ******************/\n/*************** function ******************/\n.create_2xCJ {\n  margin: 1.5rem;\n  display: flex;\n  flex-direction: column; }\n  .create_2xCJ .configFields_1Ky4 {\n    margin-top: 1rem;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start; }\n    .create_2xCJ .configFields_1Ky4 li {\n      margin: 0.8rem;\n      display: flex;\n      justify-content: center;\n      align-items: center; }\n  .create_2xCJ .privatePriceTable_2JFc {\n    margin-top: 3rem;\n    color: #314659;\n    text-align: center; }\n    .create_2xCJ .privatePriceTable_2JFc td {\n      border: 1px solid rgba(49, 70, 89, 0.1);\n      width: 5rem;\n      height: 3rem; }\n      .create_2xCJ .privatePriceTable_2JFc td a {\n        margin: 0 0.3rem; }\n      .create_2xCJ .privatePriceTable_2JFc td input {\n        width: 5.5rem;\n        padding-right: 0; }\n      .create_2xCJ .privatePriceTable_2JFc td.readonly_2taR input {\n        border-bottom-color: transparent; }\n  .create_2xCJ .btnSwitch_1CYy {\n    margin-top: 2rem;\n    text-align: center; }\n    .create_2xCJ .btnSwitch_1CYy a {\n      transition: all 0.2s ease-in-out;\n      color: rgba(66, 133, 244, 0.9); }\n      .create_2xCJ .btnSwitch_1CYy a:hover {\n        color: #4285f4;\n        text-decoration: underline; }\n\n.play_2lSr {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column; }\n  .play_2lSr .line_1ltt {\n    border-bottom: 1px solid rgba(49, 70, 89, 0.1);\n    width: 95%;\n    font-size: 1.3rem;\n    padding: 0.5rem;\n    display: flex;\n    justify-content: space-between;\n    align-items: center; }\n  .play_2lSr .highlight_ox-r {\n    color: #4285f4; }\n  .play_2lSr .title_3Si8 {\n    font-size: 2rem;\n    display: flex;\n    justify-content: center;\n    margin-bottom: 1rem; }\n  .play_2lSr .profits_jOUn {\n    margin-top: 3rem;\n    color: #314659;\n    text-align: center; }\n    .play_2lSr .profits_jOUn td {\n      border: 1px solid rgba(49, 70, 89, 0.1);\n      width: 5rem;\n      height: 3rem; }\n      .play_2lSr .profits_jOUn td a {\n        margin: 0 0.3rem; }\n      .play_2lSr .profits_jOUn td input {\n        width: 4rem; }\n      .play_2lSr .profits_jOUn td.readonly_2taR input {\n        border-bottom-color: transparent; }\n\n.result_1BAA {\n  margin: 2rem auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.25rem; }\n  .result_1BAA .resultTable_wdxe {\n    margin: 1rem; }\n    .result_1BAA .resultTable_wdxe tr {\n      border-bottom: 1px solid rgba(49, 70, 89, 0.1);\n      height: 2.5rem;\n      text-align: center; }\n      .result_1BAA .resultTable_wdxe tr td {\n        width: 10rem; }\n",""]),t.locals={create:"create_2xCJ",configFields:"configFields_1Ky4",privatePriceTable:"privatePriceTable_2JFc",readonly:"readonly_2taR",btnSwitch:"btnSwitch_1CYy",play:"play_2lSr",line:"line_1ltt",highlight:"highlight_ox-r",title:"title_3Si8",profits:"profits_jOUn",result:"result_1BAA",resultTable:"resultTable_wdxe",easyIn:"easyIn_8fva"}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var a=(o=r,l=btoa(unescape(encodeURIComponent(JSON.stringify(o)))),u="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(l),"/*# ".concat(u," */")),i=r.sources.map(function(e){return"/*# sourceURL=".concat(r.sourceRoot).concat(e," */")});return[n].concat(i).concat([a]).join("\n")}var o,l,u;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2],"{").concat(n,"}"):n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},a=0;a<this.length;a++){var i=this[a][0];null!=i&&(r[i]=!0)}for(var o=0;o<e.length;o++){var l=e[o];null!=l[0]&&r[l[0]]||(n&&!l[2]?l[2]=n:n&&(l[2]="(".concat(l[2],") and (").concat(n,")")),t.push(l))}},t}},function(e,t,n){var r,a,i={},o=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===a&&(a=r.apply(this,arguments)),a}),l=function(e){var t={};return function(e,n){if("function"==typeof e)return e();if(void 0===t[e]){var r=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,n);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(e){r=null}t[e]=r}return t[e]}}(),u=null,s=0,c=[],p=n(31);function f(e,t){for(var n=0;n<e.length;n++){var r=e[n],a=i[r.id];if(a){a.refs++;for(var o=0;o<a.parts.length;o++)a.parts[o](r.parts[o]);for(;o<r.parts.length;o++)a.parts.push(b(r.parts[o],t))}else{var l=[];for(o=0;o<r.parts.length;o++)l.push(b(r.parts[o],t));i[r.id]={id:r.id,refs:1,parts:l}}}}function d(e,t){for(var n=[],r={},a=0;a<e.length;a++){var i=e[a],o=t.base?i[0]+t.base:i[0],l={css:i[1],media:i[2],sourceMap:i[3]};r[o]?r[o].parts.push(l):n.push(r[o]={id:o,parts:[l]})}return n}function m(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var a=l(e.insertAt.before,n);n.insertBefore(t,a)}}function h(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function y(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var r=function(){0;return n.nc}();r&&(e.attrs.nonce=r)}return v(t,e.attrs),m(e,t),t}function v(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function b(e,t){var n,r,a,i;if(t.transform&&e.css){if(!(i="function"==typeof t.transform?t.transform(e.css):t.transform.default(e.css)))return function(){};e.css=i}if(t.singleton){var o=s++;n=u||(u=y(t)),r=S.bind(null,n,o,!1),a=S.bind(null,n,o,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",v(t,e.attrs),m(e,t),t}(t),r=function(e,t,n){var r=n.css,a=n.sourceMap,i=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||i)&&(r=p(r));a&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var o=new Blob([r],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(o),l&&URL.revokeObjectURL(l)}.bind(null,n,t),a=function(){h(n),n.href&&URL.revokeObjectURL(n.href)}):(n=y(t),r=function(e,t){var n=t.css,r=t.media;r&&e.setAttribute("media",r);if(e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}.bind(null,n),a=function(){h(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else a()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=o()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return f(n,t),function(e){for(var r=[],a=0;a<n.length;a++){var o=n[a];(l=i[o.id]).refs--,r.push(l)}e&&f(d(e,t),t);for(a=0;a<r.length;a++){var l;if(0===(l=r[a]).refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete i[l.id]}}}};var g,E=(g=[],function(e,t){return g[e]=t,g.filter(Boolean).join("\n")});function S(e,t,n,r){var a=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=E(t,a);else{var i=document.createTextNode(a),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var a,i=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?e:(a=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(a)+")")})}},function(e,t,n){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))(function(a,i){function o(e){try{u(r.next(e))}catch(e){i(e)}}function l(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){e.done?a(e.value):new n(function(t){t(e.value)}).then(o,l)}u((r=r.apply(e,t||[])).next())})},o=this&&this.__generator||function(e,t){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:l(0),throw:l(1),return:l(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function l(i){return function(l){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!(a=(a=o.trys).length>0&&a[a.length-1])&&(6===i[0]||2===i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=t.call(e,o)}catch(e){i=[6,e],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,l])}}};Object.defineProperty(t,"__esModule",{value:!0});var l=n(0),u=n(5),s=n(1),c=n(4),p=n(33),f=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={price:"",num:"",newRoundTimers:[]},t.shout=function(){var e=t,n=e.props,r=n.frameEmitter,a=n.gameState.groups,i=n.playerState.groupIndex,o=e.state,l=Number(o.price),u=Number(o.num);l&&u?(r.emit(p.MoveType.shout,{price:l,num:Math.floor(u),roundIndex:a[i].roundIndex},function(e){return c.Toast.error(e)}),t.setState({price:"",num:""})):c.Toast.warn("输入的值无效")},t.nextRound=function(){var e=t.props,n=e.frameEmitter,r=e.gameState.groups[e.playerState.groupIndex].roundIndex;n.emit(p.MoveType.nextRound,{nextRoundIndex:r+1})},t.dynamicAction=function(){var e=t,n=e.props,r=n.gameState.groups,a=n.playerState,i=a.groupIndex,o=(a.positionIndex,a.rounds),u=n.game.params.rounds,s=e.state,f=s.price,d=s.num,m=s.newRoundTimers,h=r[i],y=(h.rounds,h.roundIndex),v=o[y].status;if(v===p.PlayerStatus.shouted)return l.createElement(c.MaskLoading,{label:"您已出价，请等待其他玩家..."});if(v===p.PlayerStatus.result){var b=m[y];return y===u-1?l.createElement(c.MaskLoading,{label:"等待老师结束实验..."}):l.createElement(c.MaskLoading,{label:"即将进入下一轮..."+(p.NEW_ROUND_TIMER-(b||0))})}return l.createElement("div",null,l.createElement("li",null,l.createElement(c.Label,{label:"输入您的价格"}),l.createElement(c.Input,{type:"number",value:f,onChange:function(e){return t.setState({price:e.target.value})}})),l.createElement("li",null,l.createElement(c.Label,{label:"输入您的配额数量"}),l.createElement(c.Input,{type:"number",value:d,onChange:function(e){return t.setState({num:e.target.value})}})),l.createElement("li",null,l.createElement(c.Button,{width:c.ButtonProps.Width.large,label:"出价",onClick:t.shout.bind(t)})))},t.dynamicResult=function(){var e=t.props,n=e.gameState.groups,r=e.playerState,a=r.rounds,i=r.groupIndex,o=r.role,s=n[i],c=s.roundIndex,p=s.rounds;return 0===c?null:l.createElement("table",{className:u.profits},l.createElement("thead",null,l.createElement("tr",null,l.createElement("td",null,"轮次"),l.createElement("td",null,"成交价格"),l.createElement("td",null,["购买股数","出售股数"][o]),l.createElement("td",null,"心理价值"),l.createElement("td",null,"收益"))),Array(p.length).fill(null).map(function(e,t){var n=p[t],r=a[t];return void 0===n.strikePrice?null:l.createElement("tbody",{key:"tb"+t},l.createElement("tr",null,l.createElement("td",null,t+1),l.createElement("td",null,n.strikePrice),l.createElement("td",null,r.actualNum),l.createElement("td",null,r.privateValue),l.createElement("td",null,r.profit.toFixed(2))))}))},t}return a(t,e),t.prototype.componentDidMount=function(){return i(this,void 0,void 0,function(){var e,t=this;return o(this,function(n){return(e=this.props.frameEmitter).on(p.PushType.newRoundTimer,function(e){var n=e.roundIndex,r=e.newRoundTimer;t.setState(function(e){var t=e.newRoundTimers.slice();return t[n]=r,{newRoundTimers:t}})}),e.emit(p.MoveType.getPosition),[2]})})},t.prototype.render=function(){var e=this.props,t=e.game.params,n=t.groupSize,r=t.rounds,a=e.gameState.groups,i=e.playerState,o=i.role,s=i.groupIndex,p=i.rounds;if(void 0===s)return l.createElement(c.MaskLoading,{label:"正在匹配玩家..."});var f=a[s],d=(f.rounds,f.roundIndex);return l.createElement("section",{className:u.play},l.createElement("div",{className:u.title},"集合竞价市场"),l.createElement("div",{className:u.line},l.createElement("div",null,"游戏总人数"),l.createElement("div",{className:u.highlight},n)),l.createElement("div",{className:u.line},l.createElement("div",null,"游戏总轮数"),l.createElement("div",{className:u.highlight},r)),l.createElement("div",{className:u.line},l.createElement("div",null,"正在进行轮次"),l.createElement("div",{className:u.highlight},d+1," ")),l.createElement("div",{className:u.line},l.createElement("div",null,"您的角色"),l.createElement("div",{className:u.highlight},["买家","卖家"][o])),l.createElement("div",{className:u.line},l.createElement("div",null,"物品对于您的心理价值"),l.createElement("div",{className:u.highlight},p[d].privateValue)),l.createElement("div",{className:u.line,style:{marginBottom:"2rem"}},l.createElement("div",null,["您的初始资金","您的股票配额"][o]),l.createElement("div",{className:u.highlight},[p[d].startingPrice,p[d].startingQuota][o])),this.dynamicAction(),this.dynamicResult())},t}(s.Core.Play);t.Play=f},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.namespace="TogetherBidMarket",function(e){e.shout="shout",e.getPosition="getPosition",e.nextRound="nextRound"}(t.MoveType||(t.MoveType={})),function(e){e[e.dealTimer=0]="dealTimer",e[e.newRoundTimer=1]="newRoundTimer"}(t.PushType||(t.PushType={})),function(e){e[e.prepared=0]="prepared",e[e.shouted=1]="shouted",e[e.result=2]="result"}(t.PlayerStatus||(t.PlayerStatus={})),t.NEW_ROUND_TIMER=3},function(e,t,n){"use strict";var r,a=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(5),l=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return a(t,e),t.prototype.render=function(){var e=this.props.playerState.profits;return i.createElement("div",{className:o.result},i.createElement("table",{className:o.resultTable},i.createElement("tbody",null,i.createElement("tr",null,i.createElement("td",null,"轮次"),i.createElement("td",null,"收益")),e.map(function(e,t){return i.createElement("tr",{key:t},i.createElement("td",null,t+1),i.createElement("td",null,e))}))))},t}(n(1).Core.Result);t.Result=l}]);