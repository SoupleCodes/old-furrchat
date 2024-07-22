type EmojiMap = { [key: string]: string }; // Interface for emoji key-value pairs

const emoticons: string[] = [
  "[̲̅$̲̅(̲̅1̲̅)̲̅$̲̅]",
  "[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]",
  "[̲̅$̲̅(̲̅1̲̅0̲̅)̲̅$̲̅]",
  "[̲̅$̲̅(̲̅ιοο̲̅)̲̅$̲̅]",
  "( ͡° ͜ʖ ͡°)",
  "ヽ༼ຈل͜ຈ༽ﾉ",
  "ಠ_ಠ",
  "ಠ__ಠ",
  "ಠ益ಠ",
  "⎛⎝(•ⱅ•)⎠⎞",
  "◥▅◤",
  "◢▅◣",
  "(๑ˇεˇ๑)",
  "(◕‿◕✿)",
  "( ༎ຶ ۝ ༎ຶ )",
  "(=ʘᆽʘ=)∫",
  "ฅ(^•ﻌ•^ฅ)",
  "ʕ •ᴥ•ʔ",
  "ʕ ·(エ)· ʔ",
  "ʕ – ㉨ – ʔ",
  "⊂(￣(ｴ)￣)⊃",
  "(>_<)",
  "<(>_<)>",
  "(>w<)",
  "(';')",
  "(^ゞ^)",
  "(^_^;)",
  "(-_-;)",
  "(~_~;)",
  "(・.・;)",
  "(・_・;)",
  "(・・;)",
  "^_^;",
  "(#^.^#)",
  "(^^;)",
  "(⁄ ⁄•⁄ω⁄•⁄ ⁄)",
  "(^.^)y-.o○",
  "(-.-)y-°°°",
  "(-_-)zzz",
  "(^_-)",
  "(^_-)-☆",
  "((+_+))",
  "(+o+)",
  "(°°)",
  "(°-°)",
  "(°.°)",
  "(°_°)",
  "(°_°>)",
  "(°レ°)",
  "(o|o)",
  "<(｀^´)>",
  "^_^",
  "(°o°)",
  "(^_^)/",
  "(^O^)／",
  "(^o^)／",
  "(^^)/",
  "(≧∇≦)/",
  "(/◕ヮ◕)/",
  "(^o^)丿",
  "∩(·ω·)∩",
  "(·ω·)",
  "^ω^",
  "_(__)_",
  "_(._.)_",
  "(凸ಠ益ಠ)凸",
  "＼(°ロ＼)",
  "(／ロ°)／",
  "('_')",
  "(/_;)",
  "(T_T)",
  "(:_;)",
  "(;O;)",
  "(ToT)",
  "(Ｔ▽Ｔ)",
  ";_;",
  ";-;",
  ";n;",
  "Q.Q",
  "T.T",
  "TnT",
  "Q_Q",
  "(ー_ー)!!",
  "(-.-)",
  "(-_-)",
  "(；一_一)",
  "(=_=)",
  "(=^・^=)",
  "(=^・・^=)",
  "=^_^=",
  "(..)",
  "(._.)",
  "^m^",
  "(－‸ლ)",
  ">^_^<",
  "(’-’*)",
  "(＾ｖ＾)",
  "(＾▽＾)",
  "(・∀・)",
  "(´∀`)",
  "(⌒▽⌒）",
  "＼(^o^)／",
  "(^o^)/",
  "(~o~)",
  "(~_~)",
  `(-"-)`,
  "(ーー゛)",
  "(^_^メ)",
  "(-_-メ)",
  "(~_~メ)",
  "(－－〆)",
  "(・へ・)",
  "(^0_0^)",
  "(^0_0)",
  "(●＾o＾●)",
  "(＾ｖ＾)",
  "(＾ｕ＾)",
  "(＾◇＾)",
  "( ^)o(^ )",
  "(^O^)",
  "(^o^)",
  "(*^▽^*)",
  "(✿◠‿◠)",
  "(￣ー￣)",
  "(￣□￣;)",
  "°o°",
  "°O°",
  "(*´▽｀*)",
  "(*°∀°)=3",
  "ᕕ( ᐛ )ᕗ",
  "（ ﾟ Дﾟ)",
  "(°◇°)",
  "(*￣m￣)",
  "ヽ(´ー｀)┌",
  "¯_(ツ)_/¯",
  "¯(°_o)/¯",
  "(´･ω･`)",
  "(‘A`)",
  "(づ￣ ³￣)づ",
  "(*^3^)/~☆",
  ".....φ(・∀・＊)",
  "(-_-)",
  "zzz(︶｡︶✽)",
  "(ノಠ益ಠ)ノ彡┻━┻",
  "(╯°□°）╯︵ ┻━┻",
];

const emojiData: EmojiMap = {
  ":lick:": "/furrchat/assets/smilies/a_puh.gif",
  ":ban:": "/furrchat/assets/smilies/ban.gif",
  ":bday:": "/furrchat/assets/smilies/bdaybiggrin.gif",
  ":beer:": "/furrchat/assets/smilies/bier.gif",
  ":chubby:": "/furrchat/assets/smilies/chubby.gif",
  ":clown:": "/furrchat/assets/smilies/clown.gif",
  ":confused:": "/furrchat/assets/smilies/confused.gif",
  ":cool:": "/furrchat/assets/smilies/coool.gif",
  " B) ": "/furrchat/assets/smilies/coool.gif",
  " B-) ": "/furrchat/assets/smilies/coool.gif",
  " 8) ": "/furrchat/assets/smilies/coool.gif",
  ":devilwhip:": "/furrchat/assets/smilies/devil_whip.gif",
  ":devil:": "/furrchat/assets/smilies/devil.gif",
  ":spain:": "/furrchat/assets/smilies/es.png",
  ":finland:": "/furrchat/assets/smilies/fi.png",
  ":france:": "/furrchat/assets/smilies/fr.png",
  ":frown:": "/furrchat/assets/smilies/frown.gif",
  " :( ": "/furrchat/assets/smilies/frown.gif",
  ":frusty:": "/furrchat/assets/smilies/frusty.gif",
  ":fyou:": "/furrchat/assets/smilies/fyou.gif",
  ":hooligan:": "/furrchat/assets/smilies/got-hooligan.gif",
  ":headshakefast:": "/furrchat/assets/smilies/headshakesmile-fast.gif",
  ":hypocrite:": "/furrchat/assets/smilies/hypocrite2.gif",
  ":king:": "/furrchat/assets/smilies/koning.gif",
  ":skorea:": "/furrchat/assets/smilies/kr.png",
  ":drool:": "/furrchat/assets/smilies/kwijl.gif",
  ":list:": "/furrchat/assets/smilies/lijstje.gif",
  ":loveit:": "/furrchat/assets/smilies/loveit.gif",
  ":lurk:": "/furrchat/assets/smilies/lurk.gif",
  ":marry:": "/furrchat/assets/smilies/marrysmile.gif",
  ":nerd:": "/furrchat/assets/smilies/nerd.png",
  ":noo:": "/furrchat/assets/smilies/nooo.gif",
  ":nothumbs:": "/furrchat/assets/smilies/nosthumbs.gif",
  ":offtopic:": "/furrchat/assets/smilies/offtopic.gif",
  ":service:": "/furrchat/assets/smilies/pimatyourservice.gif",
  ":poland:": "/furrchat/assets/smilies/pl.png",
  ":die:": "/furrchat/assets/smilies/plzdie.gif",
  ":puh:": "/furrchat/assets/smilies/puh.gif",
  ":puh2:": "/furrchat/assets/smilies/puh2.gif",
  ":puhbye:": "/furrchat/assets/smilies/puhbye.gif",
  ":puke:": "/furrchat/assets/smilies/pukey.gif",
  ":cow:": "/furrchat/assets/smilies/rc5.gif",
  ":redcard:": "/furrchat/assets/smilies/redcard.gif",
  ":bored:": "/furrchat/assets/smilies/saai.gif",
  ":shiny:": "/furrchat/assets/smilies/shiny.gif",
  ":sleeping:": "/furrchat/assets/smilies/slapen.gif",
  ":zzz:": "/furrchat/assets/smilies/sleepey.gif",
  ":sleephappy:": "/furrchat/assets/smilies/sleephappy.gif",
  " :) ": "/furrchat/assets/smilies/smile.gif",
  " :D ": "/furrchat/assets/smilies/smile.gif",
  " :-D ": "/furrchat/assets/smilies/smile.gif",
  ":snap:": "/furrchat/assets/smilies/smiliecam.gif",
  ":steam:": "/furrchat/assets/smilies/steam.gif",
  ":toilet_puke:": "/furrchat/assets/smilies/toilet-puke.gif",
  ":wink:": "/furrchat/assets/smilies/wink.gif",
  ":winkthumbs:": "/furrchat/assets/smilies/winkthumbs.gif",
  ":worship:": "/furrchat/assets/smilies/worshippy.gif",
  ":yawn:": "/furrchat/assets/smilies/yawnee.gif",
  ":yes:": "/furrchat/assets/smilies/yes.gif",
  ":yum:": "/furrchat/assets/smilies/yummie.gif",
  ":zoom:": "/furrchat/assets/smilies/zoefzoef.gif",
};

const discordEmojis: EmojiMap = {
  ":ea:": "<:3a:1251187519882662012>",
  ":3:": "<:3:1226320165302571087>",
  ":debugman:": "<:DebugMan:1226320526037880916>",
  ":garftrue:": "<:GarfTrue:1228207760047472670>",
  ":100:": "<a:MiscHundred:1226319950570983434>",
  ":POWER:": "<:POWER:1215322815105077279>",
  ":cat:aaa:": "<:aaaaaaaaaaa:1149352246572761120>",
  ":acatonmeower:": "<:acatonmeower:1021912187163394138>",
  ":ameowdundundun:": "<a:ameowdundundun:1226319768236331140>",
  ":amogos:": "<:amogos:1226314396377288726>",
  ":angular:": "<:angular:1255562415958130768>",
  ":atticus:": "<:atticus:1221630557369405440>",
  ":atticusaijkndemw:": "<:atticusaijkndemw:1212216821625917450>",
  ":bear:": "<:bear:1255229843126358016>",
  ":blank:": "<:blank:1018231234553446411>",
  ":blobheart:": "<:blobheart:1226319886867763240>",
  ":bluray:": "<:bluray:1255229893625643140>",
  ":boogie:": "<a:boogie:1226311710818959401>",
  ":bred:": "<:bred:959422100458844160>",
  ":catlick:": "<:catlick:1180505322851414206>",
  ":caughtin4k:": "<a:caughtin4k:1102387987838402574>",
  ":cd:": "<:cd:1255229891893395457>",
  ":chainbrokerestartingnow:": "<:chainbrokerestartingnow:1149502765542953021>",
  ":cheese:": "<:cheese:1255229898617000067>",
  ":consume:": "<:consume:1224195139082125322>",
  ":cta:": "<:cta:1226913189590073494>",
  ":cydia:": "<:cydia:1227268820213698611>",
  ":dango:": "<:dango:1254883210643374263>",
  ":darkstar:": "<:darkstar:957320841044045905>",
  ":demonetized:": "<:demonetized:1226320307673894953>",
  ":downvote:": "<:downvote:1010035793819091068>",
  ":drinkmilk:": "<:drinkmilk:1151681105615929435>",
  ":drunkmeow:": "<:drunkmeow:1026159952038985829>",
  ":duckspinningcube:": "<a:duckspinningcube:1152410546893770783>",
  ":ducky:": "<:ducky:1001974772051234950>",
  ":duckyspeen:": "<a:duckyspeen:995024774348668968>",
  ":dvd:": "<:dvd:1251187522432798808>",
  ":eepy:": "<:eepy:1254884335514030212>",
  ":finalboss:": "<:finalboss:954783074586095636>",
  ":flipper:": "<:flipper:1011498926819520572>",
  ":fortune:": "<:fortune:1210379302328078356>",
  ":freya:": "<:freya:1244778372953935922>",
  ":fubgingcloudlink:": "<:fubgingcloudlink:1224195287178936392>",
  ":goobert:": "<:goobert:1254882434898464922>",
  ":goobertyuhhuh:": "<:goobertyuhhuh:1255229895726858273>",
  ":gun:": "<:gun:1015228426778578966>",
  ":halfstar:": "<:halfstar:957320841241169991>",
  ":happymeow:": "<:happymeow:954779471330816040>",
  ":harry:": "<:harry:1251187517433057411>",
  ":hat:": "<:hat:1251187521140949083>",
  ":hooray:": "<a:hooray:1230023947777609808>",
  ":kick:": "<a:kick:1231078387704139967>",
  ":luna:": "<:luna:1221632755851591740>",
  ":madmeow:": "<:madmeow:954780476067946638>",
  ":mainispain:": "<:mainispain:939326396977795113>",
  ":marker:": "<:marker:1238203265229914132>",
  ":me:": "<:me:1221628997025267752>",
  ":melm:": "<:melm:1248842290806657035>",
  ":meo:": "<:meo:1255229897463431198>",
  ":meowspin:": "<:meowspin:1017901487810170940>",
  ":meowy2:": "<:meowy2:1214405335666925568>",
  ":meowybutton:": "<:meowybutton:950192902708019200>",
  ":meowyhadsomepepsi:": "<:meowyhadsomepepsi:1224195086951383113>",
  ":meowyplanet:": "<a:meowyplanet:1008194232282009640>",
  ":meowyplanets:": "<a:meowyplanets:1008194354197831800>",
  ":meowyspin:": "<a:meowyspin:1008194132067483678>",
  ":meowytroll:": "<:meowytroll:1111415513462079628>",
  ":miau:": "<:miau:1237207275870097519>",
  ":mikeisgettingsickofyou:": "<:mikeisgettingsickofyou:1143348848085962855>",
  ":noodle:": "<:noodle:1227131494183473233>",
  ":notstonks:": "<:notstonks:1255200842894803075>",
  ":nuhhuh:": "<:nuhhuh:1233290735999258664>",
  ":octocat:": "<:octocat:1254884597724872764>",
  ":oswal:": "<:oswal:1226912603931148338>",
  ":ow:": "<:ow:1251723597630931065>",
  ":penguinmod:": "<:penguinmod:1255200838008442890>",
  ":pixelmeowy:": "<:pixelmeowy:1125502216090951840>",
  ":planktonpog:": "<:planktonpog:995896283833323520>",
  ":progresspride:": "<:progresspride:1255562425625870397>",
  ":qbabyblue:": "<:qbabyblue:1255190936376578149>",
  ":qbabyorange:": "<:qbabyorange:1255190939429896192>",
  ":qbabypink:": "<:qbabypink:1255190938108821514>",
  ":qbby:": "<:qbby:1255190940570882089>",
  ":quacker:": "<:quacker:959421966148857906>",
  ":qucy:": "<:qucy:1255190933721579591>",
  ":qudy:": "<:qudy:1255190934975418519>",
  ":ratestar:": "<:ratestar:957320841538982018>",
  ":react:": "<:react:1255562420697567334>",
  ":rehehehehehehe:": "<:rehehehehehehe:1123971249442406521>",
  ":robotop:": "<:robotop:1148967341409976411>",
  ":ron:": "<:ron:1251187515189104730>",
  ":sadmeow:": "<:sadmeow:954781179704393769>",
  ":scratch:": "<:scratch:1255200839975567483>",
  ":sd:": "<:sd:1255229890651881492>",
  ":shake:": "<a:shake:1227279789472354435>",
  ":shakespeare:": "<:shakespeare:982709311702716457>",
  ":soon:": "<:soon:932400780072349726>",
  ":sphere:": "<a:sphere:1227279796715917362>",
  ":spin:": "<a:spin:1227279798015889498>",
  ":squish:": "<a:squish:1227279787072946189>",
  ":stonks:": "<:stonks:1251187639504343040>",
  ":stretchcat:": "<:stretchcat:1210253516417798194>",
  ":sus:": "<:sus:1199167654972375090>",
  ":svelte:": "<:svelte:1255562419397464145>",
  ":tehduck:": "<:tehduck:1055226916409458808>",
  ":thehorror:": "<:thehorror:1158484835090833508>",
  ":think:": "<:think:1226311619064234086>",
  ":this:": "<:this:1068710522561773719>",
  ":thubsup:": "<:thubsup:1229994631840927774>",
  ":toasty:": "<:toasty:1226314396377288726>",
  ":treboog:": "<:treboog:1254882433900351533>",
  ":treboogyuhhuh:": "<:treboogyuhhuh:1255229894733070346>",
  ":trol:": "<:trol:1010322254065848361>",
  ":trolleyproblem:": "<:trolleyproblem:1255562426653478953>",
  ":turbowarp:": "<:turbowarp:1255200839170261032>",
  ":uggh:": "<:uggh:1227845267496243242>",
  ":upvote:": "<:upvote:1010035340851023892>",
  ":vue:": "<:vue:1255562417694441553>",
  ":wallace:": "<:wallace:1254884015014674585>",
  ":waluigi:": "<:waluigi:1255562422580805634>",
  ":wario:": "<:wario:1255562424241618944>",
  ":whar:": "<:whar:1143938761919570000>",
  ":wiwwy:": "<:wiwwy:953882510167773184>",
  ":wooftheheck:": "<:wooftheheck:1217544930847625427>",
  ":wow:": "<:wow:952755842095132752>",
  ":yippe:": "<a:yippe:1226318495147495505>",
  ":yuhhuh2:": "<:yuhhuh:1227131494183473233>",
  ":yuhhuh:": "<:yuhhuh:1227268820213698611>",
  ":zed:": "<:zed:1208625071766114364>",
  ":snooga1:": "<:snooga1:1258860425294909442>",
  ":snooga2:": "<:snooga2:1258860426997797006>",
  ":snooga3:": "<:snooga3:1258860428122132556>",
  ":snooga4:": "<:snooga4:1258860429703385108>",
  ":snooga5:": "<:snooga5:1258860431284502628>",
  ":snooga6:": "<:snooga6:1258860432719085638>",
  ":snooga7:": "<:snooga7:1258860434497343590>",
  ":snooga8:": "<:snooga8:1258860443468824616>",
};

const GIFS: EmojiMap = {
  "Hello Chat!":
    "https://uploads.meower.org/attachments/E1vZKv7jDxcd2P1LdsbiVsLP/image0.gif",
  "Bye Chat!":
    "https://uploads.meower.org/attachments/mdgjL1irwbEJP6kC7lencoMd/image1.gif",
  "Whar?!": "https://media1.tenor.com/m/U8OLnFKZmrgAAAAd/shocked-surprised.gif",
  stare: "https://media.tenor.com/DFfCL02_DCcAAAAM/cat-look.gif",
  "dancing Y":
    "https://media.tenor.com/9zMHtfQLsjUAAAAi/capital-letter-letter.gif",
  "dancing E":
    "https://media.tenor.com/A5a-G4IqGOQAAAAi/dancing-letter-letter-e.gif",
  "dancing S":
    "https://media.tenor.com/IQQVfdxyOIQAAAAi/dancing-letter-letter.gif",
  "when u no answr":
    "https://uploads.meower.org/attachments/6p3e97Ai6zXzFlXFTjn0PKfr/gif",
  chippyyyy: "https://i.ibb.co/d4TsM8J/cat-chips.gif",
  "water car": "https://media1.tenor.com/m/dDu9uYP_2i0AAAAC/water-cat-cat.gif",
  "goofy cat": "https://media1.tenor.com/m/cor0ZSgUarIAAAAd/cat-goofy-cat.gif",
  "scary car": "https://media1.tenor.com/m/a37YNvV0XaAAAAAd/cat-black-fur.gif",
  "blast car": "https://media1.tenor.com/m/XCKZfD-GO48AAAAC/cat-blast-off.gif",
  lasercat: "https://media1.tenor.com/m/MzjQEZ1tPZ4AAAAC/cat-lasers.gif",
  nocommen: "https://media1.tenor.com/m/719_X3doMAoAAAAd/black-cat.gif",
  hirecattostareatu:
    "https://media1.tenor.com/m/PmpiSvg8bDAAAAAC/i-hired-this-cat-to-stare-at-you-hired.gif",
  "willsmith-slap":
    "https://gifdb.com/images/high/will-smith-slaps-chris-rock-9tdpd79yfmrq5p39.gif",
  "took-a-chunk":
    "https://uploads.meower.org/attachments/GrjtUveRiUr7mCARZIR4EGEf/mower.png",
  bunger:
    "https://uploads.meower.org/attachments/qA8nsPQ0ifB3is13YTD7WQxV/bunger.gif",
};

const defaultPFPS: string[] = [
  "/furrchat/assets/default_pfps/icon_33-aa0b2afc.svg",
  "/furrchat/assets/default_pfps/icon_32-b04ea763.svg",
  "/furrchat/assets/default_pfps/icon_31-69ab1d48.svg",
  "/furrchat/assets/default_pfps/icon_30-bb20f655.svg",
  "/furrchat/assets/default_pfps/icon_29-3b90bc5e.svg",
  "/furrchat/assets/default_pfps/icon_28-aba3f2a4.svg",
  "/furrchat/assets/default_pfps/icon_27-89761f19.svg",
  "/furrchat/assets/default_pfps/icon_26-ff79861f.svg",
  "/furrchat/assets/default_pfps/icon_25-cc78b147.svg",
  "/furrchat/assets/default_pfps/icon_24-6026f708.svg",
  "/furrchat/assets/default_pfps/icon_23-cd7c45d1.svg",
  "/furrchat/assets/default_pfps/icon_22-119ec697.svg",
  "/furrchat/assets/default_pfps/icon_21-2ef6b9a3.svg",
  "/furrchat/assets/default_pfps/icon_20-d1301d19.svg",
  "/furrchat/assets/default_pfps/icon_19-8ad18d14.svg",
  "/furrchat/assets/default_pfps/icon_18-dc1f4b4e.svg",
  "/furrchat/assets/default_pfps/icon_17-39e35340.svg",
  "/furrchat/assets/default_pfps/icon_16-e5e55f53.svg",
  "/furrchat/assets/default_pfps/icon_15-d1b06a28.svg",
  "/furrchat/assets/default_pfps/icon_14-6513f659.svg",
  "/furrchat/assets/default_pfps/icon_13-58e2dcbb.svg",
  "/furrchat/assets/default_pfps/icon_12-0f7ed126.svg",
  "/furrchat/assets/default_pfps/icon_11-521812d2.svg",
  "/furrchat/assets/default_pfps/icon_10-4bd3e33c.svg",
  "/furrchat/assets/default_pfps/icon_9-25c74dcc.svg",
  "/furrchat/assets/default_pfps/icon_8-515d5ae7.svg",
  "/furrchat/assets/default_pfps/icon_7-16e301c0.svg",
  "/furrchat/assets/default_pfps/icon_6-d72d5ba2.svg",
  "/furrchat/assets/default_pfps/icon_5-656d31e0.svg",
  "/furrchat/assets/default_pfps/icon_4-078d1185.svg",
  "/furrchat/assets/default_pfps/icon_3-79effa11.svg",
  "/furrchat/assets/default_pfps/icon_2-03a60034.svg",
  "/furrchat/assets/default_pfps/icon_1-3649891f.svg",
  "/furrchat/assets/default_pfps/icon_0-ab82a5ad.svg",
];

const userEmojis: EmojiMap = {
  Souple: "👑",
  ij: "👑",
  noodles: "🧀",
  kiwi: "🥝",
  cat: "🐱",
};

const PBJTime: EmojiMap = {
  ":banana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time.gif",
  ":redbanana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-1.gif",
  ":superbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-2.gif",
  ":babybanana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-3.gif",
  ":banana2:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-4.gif",
  ":legstretchbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-6.gif",
  ":hulabanana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-7.gif",
  ":manybananas:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-8.gif",
  ":grandpabanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-9.gif",
  ":banana3:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-10.gif",
  ":elvisbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-11.gif",
  ":explodbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-12.gif",
  ":banana4:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-13.gif",
  ":santabanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-14.gif",
  ":bananaSMASH:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-15.gif",
  ":alienbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-16.gif",
  ":firebanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-17.gif",
  ":derpybanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-18.gif",
  ":bananadance4:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-19.gif",
  ":bananadance5:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-20.gif",
  ":bananadance6:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-21.gif",
  ":bananadance7:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-22.gif",
  ":bananadance8:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-23.gif",
  ":bananadance9:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-24.gif",
  ":carrotbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-25.gif",
  ":bananadance11:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-26.gif",
  ":bananadance12:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-27.gif",
  ":bananaoncow:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-28.gif",
  ":bananadance14:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-30.gif",
  ":bananadance15:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-32.gif",
  ":bananadevil:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-33.gif",
  ":bananadance17:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-36.gif",
  ":bananadance18:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-37.gif",
  ":bananadance19:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-38.gif",
  ":bananadance20:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-39.gif",
  ":bananadance21:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-40.gif",
  ":bananadance26:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-41.gif",
  ":bananaoncomputer:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-42.gif",
  ":bananadance28:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-43.gif",
  ":jumpinjackbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-44.gif",
  ":bananadance30:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-45.gif",
  ":bananadance31:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-46.gif",
  ":justbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-47.gif",
  ":bananamailslot:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-48.gif",
  ":bananadance34:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-49.gif",
  ":bananadance35:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-50.gif",
  ":bananadance36:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-51.gif",
  ":bananadance38:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-53.gif",
  ":bananadance39:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-54.gif",
  ":bananadance40:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-55.gif",
  ":bananadance41:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-56.gif",
  ":bananadance42:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-57.gif",
  ":bananadance43:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-58.gif",
  ":bananadance44:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-59.gif",
  ":bananadance45:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-60.gif",
  ":LAME:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-62.gif",
  ":bananadance48:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-63.gif",
  ":bananadance51:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-66.gif",
  ":bananadance52:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-67.gif",
  ":bananadance53:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-68.gif",
  ":militarybanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-69.gif",
  ":bananadance55:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-70.gif",
  ":wavingbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-71.gif",
  ":bananawaving:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-72.gif",
  ":bananadance58:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-73.gif",
  ":bananawithwhip:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-74.gif",
  ":bananaonllama:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-75.gif",
  ":bananadance61:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-76.gif",
  ":tusors:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-77.gif",
  ":bananadance63:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-78.gif",
  ":bananadance65:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-80.gif",
  ":bananadance68:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-83.gif",
  ":broccolinana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-85.gif",
  ":bananadance71:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-86.gif",
  ":batnana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-88.gif",
  ":smooshedbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-89.gif",
  ":bananadance75:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-90.gif",
  ":bananadance76:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-91.gif",
  ":bananadance78:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-93.gif",
  ":nobanana:": "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-94.gif",
  ":jumpingbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-95.gif",
  ":bananadance82:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-97.gif",
  ":bananadance83:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-98.gif",
  ":bananadance85:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-100.gif",
  ":bananadance86:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-101.gif",
  ":bananadance87:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-102.gif",
  ":bananainelevator:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-103.gif",
  ":bananadance90:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-105.gif",
  ":upsidedownbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-106.gif",
  ":bananadance92:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-107.gif",
  ":jetpackbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-108.gif",
  ":bananadance96:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-111.gif",
  ":bananadance97:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-112.gif",
  ":bananadance99:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-114.gif",
  ":bananadance100:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-115.gif",
  ":bananadance105:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-120.gif",
  ":bananadance107:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-122.gif",
  ":goblinbanana:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-124.gif",
  ":bananadance110:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-125.gif",
  ":bananadance111:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-126.gif",
  ":bananadance112:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-127.gif",
  ":bananadance113:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-128.gif",
  ":bananadance115:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-130.gif",
  ":bananadance116:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-131.gif",
  ":bananadance117:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-132.gif",
  ":bananadance118:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-133.gif",
  ":bananadance120:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-135.gif",
  ":bananadance121:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-136.gif",
  ":bananadance122:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-137.gif",
  ":bananadance123:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-138.gif",
  ":bananadance124:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-139.gif",
  ":bananadance125:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-140.gif",
  ":bananadissappearing:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-141.gif",
  ":bananadance127:":
    "/furrchat/assets/smilies-pbj/peanut-butter-jelly-time-142.gif",
};

const headingOptions = [
  { label: "Heading 1", value: "#" },
  { label: "Heading 2", value: "##" },
  { label: "Heading 3", value: "###" },
  { label: "Heading 4", value: "####" },
  { label: "Heading 5", value: "#####" },
  { label: "Heading 6", value: "######" },
];

export {
  defaultPFPS,
  emojiData,
  discordEmojis,
  emoticons,
  GIFS,
  userEmojis,
  headingOptions,
  PBJTime,
};