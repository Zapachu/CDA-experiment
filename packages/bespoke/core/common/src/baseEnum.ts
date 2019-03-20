export enum Env {
    production = 'production',
    development = 'development',
    testing = 'testing'
}

export enum Language {
    zh = 'zh',
    en = 'en'
}

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
}

export enum PassportStrategy {
    local = 'local'
}

export enum AcademusRole {
    student = 0,
    teacher = 1
}

export enum SocketEvent {
    //region baseEvent
    connection = 'connection',
    disconnect = 'disconnect',
    online = 'online',
    move = 'move',
    push = 'push',
    sendBack = 'sendBack',
    //endregion
    //region stateEvent
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
    changeGameState_diff = 'CGD',
    changePlayerState_diff = 'CPD',
    syncGameState_msgpack = 'SGM',
    syncPlayerState_msgpack = 'SPM',
    //endregion
}

export enum CoreMove {
    switchGameStatus = 'switchGameStatus'
}

export enum LogLevel {
    log,
    trace,
    debug,
    info,
    warn,
    error,
    fatal
}

export enum ResponseCode {
    invalidInput,
    success,
    notFound,
    serverError
}

export enum GameStatus {
    notStarted,
    started,
    paused,
    over
}

export enum Actor {
    owner = 'o',
    player = 'p',
    clientRobot = 'cr',
    serverRobot = 'sr'
}

export enum NationCode {
    'China' = 86,
    'American' = 1,
    'Hongkong' = 852,
    'Singapore' = 65,
    'UK' = 44,
    'Andorra' = 376,
    'United Arab Emirates' = 971,
    'Afghanistan' = 93,
    'Antigua and Barbuda' = 1268,
    'Anguilla' = 1264,
    'Albania' = 355,
    'Armenia' = 374,
    'Angola' = 244,
    'Argentina' = 54,
    'American Samoa' = 1684,
    'Austria' = 43,
    'Australia' = 61,
    'Aruba' = 297,
    'Azerbaijan' = 994,
    'Bosniaand Herzegovina' = 387,
    'Barbados' = 1246,
    'Bangladesh' = 880,
    'Belgium' = 32,
    'Burkina Faso' = 226,
    'Bulgaria' = 359,
    'Bahrain' = 973,
    'Burundi' = 257,
    'Benin' = 229,
    'Bermuda' = 1441,
    'Brunei' = 673,
    'Bolivia' = 591,
    'Caribisch Nederland' = 599,
    'Brazil' = 55,
    'Bahamas' = 1242,
    'Bhutan' = 975,
    'Botswana' = 267,
    'Belarus' = 375,
    'Belize' = 501,
    'Canada' = 1,
    'Democratic Republic of theCongo' = 243,
    'Central African Republic' = 236,
    'Republic Of The Congo' = 242,
    'Switzerland' = 41,
    'Ivory Coast' = 225,
    'Cook Islands' = 682,
    'Chile' = 56,
    'Cameroon' = 237,
    'Colombia' = 57,
    'CostaRica' = 506,
    'Cuba' = 53,
    'Cape Verde' = 238,
    'Curacao' = 599,
    'Cyprus' = 357,
    'Czech' = 420,
    'Germany' = 49,
    'Djibouti' = 253,
    'Denmark' = 45,
    'Dominica' = 1767,
    'dominican republic' = 1809,
    'Algeria' = 213,
    'Ecuador' = 593,
    'Estonia' = 372,
    'Egypt' = 20,
    'Eritrea' = 291,
    'Spain' = 34,
    'Ethiopia' = 251,
    'Finland' = 358,
    'Fiji' = 679,
    'Micronesia' = 691,
    'Faroe Islands' = 298,
    'France' = 33,
    'Gabon' = 241,
    'United Kingdom' = 44,
    'Grenada' = 1473,
    'Georgia' = 995,
    'French Guiana' = 594,
    'Ghana' = 233,
    'Gibraltar' = 350,
    'Greenland' = 299,
    'Gambia' = 220,
    'Guinea' = 224,
    'Guadeloupe' = 590,
    'Equatorial Guinea' = 240,
    'Greece' = 30,
    'Guatemala' = 502,
    'Guam' = 1671,
    'Guinea-Bissau' = 245,
    'Guyana' = 592,
    'Hong Kong' = 852,
    'Honduras' = 504,
    'Croatia' = 385,
    'Haiti' = 509,
    'Hungary' = 36,
    'Indonesia' = 62,
    'Ireland' = 353,
    'Israel' = 972,
    'India' = 91,
    'Iraq' = 964,
    'Iran' = 98,
    'Iceland' = 354,
    'Italy' = 39,
    'Jamaica' = 1876,
    'Jordan' = 962,
    'Japan' = 81,
    'Kenya' = 254,
    'Kyrgyzstan' = 996,
    'Cambodia' = 855,
    'Kiribati' = 686,
    'Comoros' = 269,
    'Saint Kitts and Nevis' = 1869,
    'Korea Democratic Rep.' = 850,
    'South Korea' = 82,
    'Kuwait' = 965,
    'Cayman Islands' = 1345,
    'Kazakhstan' = 7,
    'Laos' = 856,
    'Lebanon' = 961,
    'Saint Lucia' = 1758,
    'Liechtenstein' = 423,
    'Sri Lanka' = 94,
    'Liberia' = 231,
    'Lesotho' = 266,
    'Lithuania' = 370,
    'Luxembourg' = 352,
    'Latvia' = 371,
    'Libya' = 218,
    'Morocco' = 212,
    'Monaco' = 377,
    'Moldova' = 373,
    'Montenegro' = 382,
    'Madagascar' = 261,
    'Marshall Islands' = 692,
    'Macedonia' = 389,
    'Mali' = 223,
    'Myanmar' = 95,
    'Mongolia' = 976,
    'Macau' = 853,
    'Mauritania' = 222,
    'Montserrat' = 1664,
    'Malta' = 356,
    'Mauritius' = 230,
    'Maldives' = 960,
    'Malawi' = 265,
    'Mexico' = 52,
    'Malaysia' = 60,
    'Mozambique' = 258,
    'Namibia' = 264,
    'New Caledonia' = 687,
    'Niger' = 227,
    'Nigeria' = 234,
    'Nicaragua' = 505,
    'Netherlands' = 31,
    'Norway' = 47,
    'Nepal' = 977,
    'Nauru' = 674,
    'New Zealand' = 64,
    'Oman' = 968,
    'Panama' = 507,
    'Peru' = 51,
    'French Polynesia' = 689,
    'Papua New Guinea' = 675,
    'Philippines' = 63,
    'Pakistan' = 92,
    'Poland' = 48,
    'Saint Pierreand Miquelon' = 508,
    'Puerto Rico' = 1787,
    'Portugal' = 351,
    'Palau' = 680,
    'Paraguay' = 595,
    'Qatar' = 974,
    'Réunion Island' = 262,
    'Romania' = 40,
    'Serbia' = 381,
    'Russia' = 7,
    'Rwanda' = 250,
    'Saudi Arabia' = 966,
    'Solomon Islands' = 677,
    'Seychelles' = 248,
    'Sudan' = 249,
    'Sweden' = 46,
    'Slovenia' = 386,
    'Slovakia' = 421,
    'Sierra Leone' = 232,
    'San Marino' = 378,
    'Senegal' = 221,
    'Somalia' = 252,
    'Suriname' = 597,
    'Sao Tome and Principe' = 239,
    'ElSalvador' = 503,
    'Syria' = 963,
    'Swaziland' = 268,
    'Turksand Caicos Islands' = 1649,
    'Chad' = 235,
    'Togo' = 228,
    'Thailand' = 66,
    'Tajikistan' = 992,
    'East Timor' = 670,
    'Turkmenistan' = 993,
    'Tunisia' = 216,
    'Tonga' = 676,
    'Turkey' = 90,
    'Trinidadand Tobago' = 1868,
    'Taiwan' = 886,
    'Tanzania' = 255,
    'Ukraine' = 380,
    'Uganda' = 256,
    'United States' = 1,
    'Uruguay' = 598,
    'Uzbekistan' = 998,
    'Saint Vincent and The Grenadines' = 1784,
    'Venezuela' = 58,
    'VirginIslands,British' = 1284,
    'Vietnam' = 84,
    'Vanuatu' = 678,
    'Samoa' = 685,
    'Yemen' = 967,
    'Mayotte' = 269,
    'South Africa' = 27,
    'Zambia' = 260,
    'Zimbabwe' = 263,
}

export enum ThirdPartyLib {
    egret,
    phaser,
}

export enum SyncStrategy {
    default,
    msgPack,
    diff
}
