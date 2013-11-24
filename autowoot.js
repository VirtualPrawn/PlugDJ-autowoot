function zobrazDialog() {
    $("#narcis-dialog").show()
}
function zatvorPozadia() {
    $("#narcis-dialog").hide()
}
function zmenitPozadie(a) {
    $("body").removeAttr("style");
    $("body").removeAttr("class");
    $("body").addClass("pozadie" + a);
    $(".background").remove()
}
var autowoot, autoqueue, hideVideo, userList, skippingVideo = !1,
    COOKIE_WOOT = "autowoot",
    COOKIE_QUEUE = "autoqueue",
    COOKIE_HIDE_VIDEO = "hidevideo",
    COOKIE_USERLIST = "userlist",
    MAX_USERS_WAITLIST = 50,
    BUTTON_ON = "ActiveButton",
    BUTTON_OFF = "InactiveButton",
    AktualnaVerzia = "1.182";

function checkVersion() {
    $.getScript("http://autowoot.itoffice.sk/bin/lastVersion.js", function() {
        console.log("Loaded actualversion");
        LastVersion !== AktualnaVerzia ? 0 == $("#PoslednaVerzia").length && $("body").append('<div id="PoslednaVerzia" style="position:absolute;top:50px;z-index:3">NEW VERSION AVAILABLE !<br><br>Click on you bookmark to update the AutoWoot.<br><br>Your version: ' + AktualnaVerzia + "<br>New version: " + LastVersion + "</div>") : $("#PoslednaVerzia").remove()
    })
}

function vymazReklamu() {
    document.cookie = "VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";
    console.log("Vymazan\u00e1 reklama..")
}

function initAPIListeners() {
    API.on(API.DJ_ADVANCE, djAdvanced);
    API.on(API.WAIT_LIST_UPDATE, queueUpdate);
    API.on(API.VOTE_UPDATE, queueUpdate);
    API.on(API.USER_JOIN, queueUpdate);
    API.on(API.DJ_UPDATE, queueUpdate);
    API.on(API.VOTE_UPDATE, function(a) {
        userList && populateUserlist()
    });
    API.on(API.USER_JOIN, function(a) {
        userList && populateUserlist()
    });
    API.on(API.USER_LEAVE, function(a) {
        userList && populateUserlist()
    })
}
$(window).resize(zmensiChat);
$("#chat-input-field").click(zmensiChat);
$("#chat-button").click(zmensiChat, zmensiUsers);
$("#users-button").click(zmensiUsers, zmensiChat);
$("#chat-input-field").attr("maxlength", "10000");
function zmensiChat() {
    $("#chat-messages").css("height", $(window).height() - 300);
    $("#chat-messages").css("margin-top", "85px")
}
function zmensiUsers() {}
zmensiChat();
clearInterval(intervalVerzia);
clearInterval(intervalAutoDj);
clearInterval(intervalZmensitChat);
var intervalVerzia = setInterval(checkVersion, 2E3),
    intervalAutoDj = setInterval(queueUpdate, 1E3),
    intervalZmensitChat = setInterval(zmensiChat, 1E3);

function displayUI() {
    $("body").append('<div id="narcis-dialog"></div>');
    $("#narcis-dialog").append('<div onClick="zatvorPozadia()" style="float:right"><img src="http://www.malanijewelers.com/close_button.png"></div>');
    $("#narcis-dialog").append('<h2 style="color:white">Change background</h2>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'l\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/011.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'k\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/010.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'j\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/009.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'i\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/008.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'h\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/007.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'g\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/006.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'f\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/005.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'e\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/004.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'d\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/003.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'c\')" src="http://i.imgur.com/kL7jJbc.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'b\')" src="http://autowoot.itoffice.sk/bin/autowoot-backgrounds/001.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div class="vyberPozadie"><img onClick="zmenitPozadie(\'a\')" src="http://plug.dj/_/static/images/custom/winter/background.4387d75.jpg" width="200" height="100"></div>');
    $("#narcis-dialog").append('<div style="margin-top:100px;clear:both;text-align:center">Here you can change the background. Simply click on the image. If you have any bugs, please tell me! <br><a href="https://www.facebook.com/pages/PlugDJ-Scripts-2014/139180666256075?fref=ts" target="_blank" style="color:#76CCEE">https://www.facebook.com/pages/PlugDJ-Scripts-2014/</a><br><br>Custom images will be available soon!</div>');
    $("#plugbot-ui").remove();
    $("#plugbot-likebox").remove();
    $("#PoslednaVerzia").remove();
    $("#chat-header").prepend('<div id="plugbot-ui"></div><div id="plugbot-likebox"></div>');
    var a = autowoot ? BUTTON_ON : BUTTON_OFF,
        b = autoqueue ? BUTTON_ON : BUTTON_OFF,
        e = hideVideo ? BUTTON_ON : BUTTON_OFF,
        c = userList ? BUTTON_ON : BUTTON_OFF;
    $("#plugbot-ui").append('<input type="button" id="plugbot-btn-woot" class="' + a + '" value="Woot!"><input type="button" id="plugbot-btn-queue" class="' + b + '" value="AutoDJ"><input type="button" id="plugbot-btn-hidevideo" class="' + e + '" value="Hide"><input type="button" onClick="zobrazDialog()" class="InactiveButton" value="B"><input type="button" id="plugbot-btn-userlist" class="' + c + '" value="Users"><br><label class="zmenitstatuslabel"><select class="zmenitstatus" id="zmenitstatus"><option value="Available">Zmeni\u0165 status / Change status</option><option value="Available">Available</option><option value="AFK">AFK</option><option value="Working">Working</option><option value="Gaming">Gaming</option></select></label>');
    $("#plugbot-likebox").append('<table cellpadding="10"><tr><td align="left"><b>Like?</b></td><td align="right"><span style="color:red;font-weight:bold" onClick="$(\'#plugbot-likebox\').hide();"><img src="http://www.cantoneseclass101.com/livesearch/images/close-icon.gif" border="0" style="cursor:pointer"></span></td></tr><tr><td><iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fpages%2FPlugDJ-Scripts-2014%2F139180666256075&amp;width=200&amp;height=62&amp;colorscheme=dark&amp;show_faces=false&amp;header=false&amp;stream=false&amp;show_border=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:62px;" allowTransparency="true"></iframe></td></tr><tr><td></td></tr></table>');
    checkVersion();
    $("#zmenitstatus").change(function() {
        var a = $(this).find("option:selected").text();
        "Available" == a && (API.on(API.setStatus(API.STATUS.AVAILABLE)), API.on(API.sendChat("/me " + a)));
        "AFK" == a && (API.on(API.setStatus(API.STATUS.AFK)), API.on(API.sendChat("/me " + a)));
        "Working" == a && (API.on(API.setStatus(API.STATUS.WORKING)), API.on(API.sendChat("/me " + a)));
        "Gaming" == a && (API.on(API.setStatus(API.STATUS.SLEEPING)), API.on(API.sendChat("/me " + a)))
    });
    $("#playlist-meta").click(zmensiChat);
    $("#dialog-restricted-media").click(zmensiChat);
    $(".dialog-frame").click(zmensiChat)
}

function initUIListeners() {
    $("#plugbot-btn-userlist").on("click", function() {
        $(this).removeClass(userList ? BUTTON_ON : BUTTON_OFF);
        userList = !userList;
        $(this).addClass(userList ? BUTTON_ON : BUTTON_OFF);
        $("#plugbot-userlist").css("visibility", userList ? "visible" : "hidden");
        userList ? populateUserlist() : $("#plugbot-userlist").empty();
        jaaulde.utils.cookies.set(COOKIE_USERLIST, userList)
    });
    $("#plugbot-btn-woot").click(function() {
        $(this).removeClass(autowoot ? BUTTON_ON : BUTTON_OFF);
        autowoot = !autowoot;
        $(this).addClass(autowoot ? BUTTON_ON : BUTTON_OFF);
        autowoot && $("#woot").click();
        jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot)
    });
    $("#plugbot-btn-hidevideo").on("click", function() {
        $(this).removeClass(hideVideo ? BUTTON_ON : BUTTON_OFF);
        hideVideo = !hideVideo;
        $(this).addClass(hideVideo ? BUTTON_ON : BUTTON_OFF);
        $(this).text(hideVideo ? "skryt\u00e9 video" : "skry\u0165 video");
        $("#yt-frame").animate({
            height: hideVideo ? "0px" : "271px"
        }, {
            duration: "fast"
        });
        $("#playback .frame-background").animate({
            opacity: hideVideo ? "0" : "0.91"
        }, {
            duration: "medium"
        });
        jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo)
    });
    $("#plugbot-btn-queue").on("click", function() {
        $(this).removeClass(autoqueue ? BUTTON_ON : BUTTON_OFF);
        autoqueue = !autoqueue;
        $(this).addClass(autoqueue ? BUTTON_ON : BUTTON_OFF);
        queueUpdate();
        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue)
    })
}

function djAdvanced(a) {
    hideVideo && ($("#yt-frame").css("height", "0px"), $("#playback .frame-background").css("opacity", "0.0"));
    skippingVideo && ($("#plugbot-btn-skipvideo").css("class", BUTTON_ON).text("skip video"), $(".icon-volume-half").click(), skippingVideo = !1);
    autowoot && $("#woot").click();
    userList && populateUserlist()
}
function queueUpdate() {
    autoqueue && !isInQueue() && joinQueue()
}
function isInQueue() {
    return -1 !== API.getBoothPosition() || -1 !== API.getWaitListPosition()
}

function joinQueue() {
    "is-wait" === $("#dj-button").attr("class") ? $("#dj-button").click() : API.getWaitList().length < MAX_USERS_WAITLIST && API.djJoin()
}

function populateUserlist() {
    $("#plugbot-userlist").remove();
    $("body").append('<div id="plugbot-userlist"></div>');
    $("#plugbot-userlist").append('<div style="background-color:transparent;padding-top:7px;padding-bottom:7px;"><h1 style="text-indent:39px;color:#fff;font-size:14px;font-variant:small-caps;">AutoWoot v' + AktualnaVerzia + '</h1><h1 style="text-indent:39px;color:#orange;font-size:14px;font-variant:small-caps;"> by P\u15e3\u15e7\u2022\u2022\u2022N\u03b1rcis\u2022\u2022</h1></div><br><h1 style="text-indent:29px;color:#fff;font-size:14px;font-variant:small-caps;">Online:  ' + API.getUsers().length + "</h1>");
    var a = [];
    for (b in API.getUsers()) a.push(API.getUsers()[b]);
    for (b in a) {
        var b = a[b];
        appendUser(b)
    }
}

function appendUser(a) {
    var b = a.username,
        e = a.permission,
        c = API.getBoothPosition(a.id);
    a.admin && (e = 99);
    var d;
    switch (e) {
    case 0:
        d = "normal";
        break;
    case 1:
        d = "residentDJ";
        break;
    case 2:
        d = "bouncer";
        break;
    case 3:
        d = "manager";
        break;
    case 4:
    case 5:
        d = "host";
        break;
    case 99:
        d = "host"
    }
    API.getDJs()[0].username == b ? drawUserlistItem("dj", "#fff", b, c) : "normal" === d ? drawUserlistItem("void", colorByVote(a.vote), b, c) : drawUserlistItem(d + imagePrefixByVote(a.vote), colorByVote(a.vote), b, c)
}

function colorByVote(a) {
    if (!a) return "#fff";
    switch (a) {
    case -1:
        return "#c8303d";
    case 0:
        return "#fff";
    case 1:
        return "#c2e320"
    }
}
function imagePrefixByVote(a) {
    if (!a) return "_undecided.png";
    switch (a) {
    case -1:
        return "_meh.png";
    case 0:
        return "_undecided.png";
    case 1:
        return "_woot.png"
    }
}

function drawUserlistItem(a, b, e, c) {
    "void" !== a && "dj" !== a ? $("#plugbot-userlist").append('<div class="obrazok"><img src="http://autowoot.itoffice.sk/bin/autowoot-icons/' + a + '" align="left" style="margin-left:5px;margin-top:2px;margin-right:4px;margin-top:3px;" /></div>') : "dj" === a ? $("#plugbot-userlist").append('<div class="obrazok">DJ&nbsp;</div>') : $("#plugbot-userlist").append('<div class="obrazok"></div>');
    $("#plugbot-userlist").append('<div class="nick"><p style="cursor:pointer;color:' + b + ";font-weight:bold;font-size:11px;text-shadow:2px 2px 1px #000\" onclick=\"$('#chat-input-field').val($('#chat-input-field').val() + '@" + e + " ').focus();position:relative;clear:both\">" + e + (-1 !== c && 0 !== c ? ' <span class="waitlistPozicia" style="position:absolute;right:5px;color:white;font-size:14px;font-weight:100;text-shadow:none;">' + c + "</span>" : "") + '</p></div><div style="clear:both">')
}
$("#plugbot-userlist").remove();
$("#plugbot-css").remove();
$("#plugbot-js").remove();
$("#narcis-dialog").remove();
var head = document.getElementsByTagName("head")[0],
    script = document.createElement("script");
script.type = "text/javascript";
script.src = "http://cookies.googlecode.com/svn/trunk/cookies.utils.jaaulde.js";
script.onreadystatechange = function() {
    "complete" == this.readyState && readCookies()
};
script.onload = readCookies;
head.appendChild(script);

function readCookies() {
    var a = new Date;
    a.setFullYear(a.getFullYear() + 1);
    jaaulde.utils.cookies.setOptions({
        expiresAt: a
    });
    a = jaaulde.utils.cookies.get(COOKIE_WOOT);
    autowoot = null != a ? a : !0;
    a = jaaulde.utils.cookies.get(COOKIE_QUEUE);
    autoqueue = null != a ? a : !1;
    a = jaaulde.utils.cookies.get(COOKIE_HIDE_VIDEO);
    hideVideo = null != a ? a : !1;
    a = jaaulde.utils.cookies.get(COOKIE_USERLIST);
    userList = null != a ? a : !0;
    onCookiesLoaded()
}
$("body").prepend("<style type=\"text/css\" id=\"plugbot-css\">  #plugbot-ui { margin-top:50px; }   #plugbot-likebox {    position: absolute;     top: 0px;    right:435px;   z-index:3;  background-color:#333;}   #plugbot-ui p {     background-color: #222;   height: 32px;     float:left; padding-top: 8px;     padding-left: 8px;     padding-right: 6px;     cursor: pointer;     font-variant: small-caps;     width: 84px;     font-size: 15px;     margin: 0;   }    #plugbot-ui p:hover { background-color:#333; }   #plugbot-ui h2 {     background-color: #0b0b0b;     height: 112px;     width: 156px;     margin: 0;     color: #fff;     font-size: 13px;     font-variant: small-caps;     padding: 8px 0 0 12px;     border-top: 1px dotted #292929;   }   #plugbot-userlist p {   font-size: 11px;}   #plugbot-userlist .obrazok { width:15%; height:20px; color:white; font-weight:bold; text-align:center; float:left; }   #plugbot-userlist .nick {  float:left; font-size: 11px; width:80%;height:20px;line-height:20px;}    #plugbot-userlist p:first-child {     padding-top: 0px !important;   }   #plugbot-ui p {     background-color: #222;   height: 32px;     padding-top: 8px;     padding-left: 8px;     padding-right: 6px;     cursor: pointer;     font-variant: small-caps;     width: 84px;     font-size: 15px;     margin: 0;   }    #plugbot-ui h2 {     background-color: #0b0b0b;     height: 112px;     width: 156px;     margin: 0;     color: #fff;     font-size: 13px;     font-variant: small-caps;     padding: 8px 0 0 12px;     border-top: 1px dotted #292929;   }    #plugbot-userlist {  background-color:#1c1f25; background: rgb(17,17,17); background: -moz-linear-gradient(left,  rgba(17,17,17,1) 12%, rgba(68,68,68,1) 13%, rgba(28,31,37,1) 14%, rgba(28,31,37,1) 100%); background: -webkit-gradient(linear, left top, right top, color-stop(12%,rgba(17,17,17,1)), color-stop(13%,rgba(68,68,68,1)), color-stop(14%,rgba(28,31,37,1)), color-stop(100%,rgba(28,31,37,1))); background: -webkit-linear-gradient(left,  rgba(17,17,17,1) 12%,rgba(68,68,68,1) 13%,rgba(28,31,37,1) 14%,rgba(28,31,37,1) 100%); background: -o-linear-gradient(left,  rgba(17,17,17,1) 12%,rgba(68,68,68,1) 13%,rgba(28,31,37,1) 14%,rgba(28,31,37,1) 100%); background: -ms-linear-gradient(left,  rgba(17,17,17,1) 12%,rgba(68,68,68,1) 13%,rgba(28,31,37,1) 14%,rgba(28,31,37,1) 100%); background: linear-gradient(to right,  rgba(17,17,17,1) 12%,rgba(68,68,68,1) 13%,rgba(28,31,37,1) 14%,rgba(28,31,37,1) 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#111111', endColorstr='#1c1f25',GradientType=1 ); box-shadow:2px 0px 35px #111;border-right:1px solid grey;    border-left: 0 !important;   padding: 8px 0px 20px 0px;     width: 13%; z-index:2; position:absolute; top:50px;bottom:50px; overflow-y:auto; overflow-x:hidden}    #plugbot-userlist p:hover::before { content: \"@\"; }     #PoslednaVerzia { background-color:red;color:white;font-weight:bold;font-size:11px;tet-align:center;padding:10px }     #plugbot-queuespot {    color: #42A5DC;     text-align: left;     font-size: 15px;     margin-left: 8px;  }.InactiveButton {-moz-box-shadow: 0px 1px 0px 0px #ffffff; -webkit-box-shadow: 0px 1px 0px 0px #ffffff; box-shadow: 0px 1px 0px 0px #ffffff; background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ffffff), color-stop(1, #f6f6f6)); background:-moz-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-webkit-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-o-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-ms-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#ffffff\", endColorstr=\"#f6f6f6\",GradientType=0); background-color:#ffffff; -moz-border-radius:6px; -webkit-border-radius:6px; border-radius:6px; border:1px solid #dcdcdc; display:inline-block; color:#666666; font-family:arial; font-size:15px; font-weight:bold; padding:8px 19px; text-decoration:none; text-shadow:0px 1px 0px #ffffff; } .InactiveButton:hover {background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f6f6f6), color-stop(1, #ffffff)); background:-moz-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-webkit-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-o-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-ms-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#f6f6f6\", endColorstr=\"#ffffff\",GradientType=0); background-color:#f6f6f6; } .InactiveButton:active {position:relative; top:1px; }.ActiveButton {-moz-box-shadow:inset 0px 1px 0px 0px #54a3f7; -webkit-box-shadow:inset 0px 1px 0px 0px #54a3f7; box-shadow:inset 0px 1px 0px 0px #54a3f7; background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #007dc1), color-stop(1, #0061a7)); background:-moz-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-webkit-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-o-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-ms-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:linear-gradient(to bottom, #007dc1 5%, #0061a7 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#007dc1\", endColorstr=\"#0061a7\",GradientType=0); background-color:#007dc1; -moz-border-radius:10px; -webkit-border-radius:10px; border-radius:10px; display:inline-block; color:#ffffff; font-family:arial; font-size:15px; font-weight:bold; padding:10px 10px; text-decoration:none; text-shadow:0px 1px 0px #154682; } .ActiveButton:hover {background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1)); background:-moz-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-webkit-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-o-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-ms-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:linear-gradient(to bottom, #0061a7 5%, #007dc1 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#0061a7\", endColorstr=\"#007dc1\",GradientType=0); background-color:#0061a7; } .ActiveButton:active {position:relative; top:1px; }.InactiveButton, .ActiveButton { cursor:pointer; height:45px;margin:0%; padding:5px 5px 5px 5px;font-size:13px;width:20%;clear:both;border:0px;border-radius:0px;}select.zmenitstatus {width:100%;height:30px;padding:3px; margin: 0; -webkit-border-radius:4px; -moz-border-radius:4px; border-radius:4px; -webkit-box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; -moz-box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; background: #f8f8f8; color:#888; border:0px;border-top:1px solid silver; outline:none; display: inline-block; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer; } @media screen and (-webkit-min-device-pixel-ratio:0) {select.zmenitstatus {padding-right:18px} } label.zmenitstatuslabel {position:relative} label.zmenitstatuslabel:after {content:\"<>\"; font:11px \"Consolas\", monospace; color:#aaa; -webkit-transform:rotate(90deg); -moz-transform:rotate(90deg); -ms-transform:rotate(90deg); transform:rotate(90deg); right:4px; top:2px; padding:0 0 2px; border-bottom:1px solid #ddd; position:absolute; pointer-events:none; } label.zmenitstatuslabel:before {content:\"\"; right:4px; top:0px; width:20px; height:20px; background:#f8f8f8; position:absolute; pointer-events:none; display:block; } #narcis-dialog { position:absolute;z-index:100;width:900px;height:600px; background-color:#000;border:5px solid #555; padding:10px; left:50px;top:100px; display:none; }.vyberPozadie{ display:block;width:200px;height:100px;margin:10px;float:left;cursor:pointer }.pozadiea { background-image: url('http://plug.dj/_/static/images/custom/winter/background.4387d75.jpg'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadieb { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/001.jpg'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiec { background-image: url('http://i.imgur.com/d9RhTvW.jpg'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadied { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/003.jpg'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiee { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/004.jpg');  background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadief { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/005.jpg'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadieg { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/006.jpg');background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadieh { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/007.png'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiei { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/008.png'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiej { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/009.png'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiek { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/010.png'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}.pozadiel { background-image: url('http://autowoot.itoffice.sk/bin/autowoot-backgrounds/011.png'); background-position: -181px -94px; background-repeat:no-repeat;overflow:auto;}");

function onCookiesLoaded() {
    autowoot && $("#woot").click();
    hideVideo && ($("#yt-frame").animate({
        height: hideVideo ? "0px" : "271px"
    }, {
        duration: "fast"
    }), $("#playback .frame-background").animate({
        opacity: hideVideo ? "0" : "0.91"
    }, {
        duration: "medium"
    }));
    userList && populateUserlist();
    initAPIListeners();
    displayUI();
    initUIListeners()
};
