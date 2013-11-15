var autowoot, autoqueue, hideVideo, userList, skippingVideo = !1,
    COOKIE_WOOT = "autowoot",
    COOKIE_QUEUE = "autoqueue",
    COOKIE_HIDE_VIDEO = "hidevideo",
    COOKIE_USERLIST = "userlist",
    MAX_USERS_WAITLIST = 50,
    BUTTON_ON = "ActiveButton",
    BUTTON_OFF = "InactiveButton",
    AktualnaVerzia = "1.16";

function checkVersion() {
    $.getScript("http://autowoot.itoffice.sk/bin/lastVersion.js", function() {
        console.log("Loaded actualversion");
        LastVersion !== AktualnaVerzia ? 0 == $("#PoslednaVerzia").length && $("body").append('<div id="PoslednaVerzia" style="position:absolute;top:50px;z-index:3">NEW VERSION AVAILABLE !<br> <br>Click on you bookmark to update the AutoWoot.<br><br>Your version: ' + AktualnaVerzia + "<br>New version: " + LastVersion + "</div>") : $("#PoslednaVerzia").remove()
    })
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
$("#chat-button").click(function() {
    $("#user-lists").css("z-index", "1");
    $("#chat").css("z-index", "2")
}, zmensiChat, zmensiUsers);
$("#users-button").click(function() {
    $("#user-lists").css("z-index", "2");
    $("#chat").css("z-index", "1")
}, zmensiUsers, zmensiChat);

function zmensiChat() {
    $("#chat").removeAttr("style");
    $("#chat").css("position", "absolute");
    $("#chat").css("right", "0px");
    $("#chat").css("height", $(window).height() - 100);
    $("#chat").css("width", "295px");
    $("#chat").css("z-index", "2");
    $("#chat-messages").css("width", "295px");
    $("#chat-messages").css("height", $(window).height() - 320);
    $("#chat-messages").css("position", "relative");
    $("#chat-messages").css("margin-top", "125px");
    $("#chat-messages").css("margin-right", "10px");
    $("#chat-header").css("width", "295px");
    $("#chat-popout-button").css("left", "215px");
    $("#chat-input").css("width", "245px");
    $("#chat-input-field").css("width", "225px");
    $("#user-lists").css("z-index", "1")
}
function zmensiUsers() {
    $("#user-lists").removeAttr("style");
    $("#user-lists").css("position", "absolute");
    $("#user-lists").css("right", "0px");
    $("#user-lists").css("height", "432px");
    $("#user-lists").css("width", "245px");
    $("#user-lists").css("display", "block");
    $(".list-header").css("display", "none")
}
zmensiChat();

function displayUI() {
    clearInterval(intervalVerzia);
    clearInterval(intervalAutoDj);
    $("#plugbot-ui").remove();
    $("#plugbot-likebox").remove();
    $(".PoslednaVerzia").remove();
    $("#chat-header").prepend('<div id="plugbot-ui"></div><div id="plugbot-likebox"></div>');
    var a = autowoot ? BUTTON_ON : BUTTON_OFF,
        b = autoqueue ? BUTTON_ON : BUTTON_OFF,
        d = hideVideo ? BUTTON_ON : BUTTON_OFF,
        c = userList ? BUTTON_ON : BUTTON_OFF;
    $("#plugbot-ui").append('<input type="button" id="plugbot-btn-woot" class="' + a + '" value="W"><input type="button" id="plugbot-btn-queue" class="' + b + '" value="DJ"><input type="button" id="plugbot-btn-hidevideo" class="' + d + '" value="Hide"><input type="button" id="plugbot-btn-skipvideo" class="' + BUTTON_OFF + '" value="Skip"><input type="button" id="plugbot-btn-userlist" class="' + c + '" value="U"><br><label class="zmenitstatuslabel"><select class="zmenitstatus" id="zmenitstatus"><option value="Available">Zmeni\u0165 status / Change status</option><option value="Available">Available</option><option value="AFK">AFK</option><option value="Working">Working</option><option value="Gaming">Gaming</option></select></label>');
    $("#plugbot-likebox").append('<table cellpadding="10"><tr><td align="left"><b>Like?</b></td><td align="right"><span style="color:red;font-weight:bold" onClick="$(\'#plugbot-likebox\').hide();"><img src="http://www.cantoneseclass101.com/livesearch/images/close-icon.gif" border="0" style="cursor:pointer"></span></td></tr><tr><td><iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fpages%2FPlugDJ-Scripts-2014%2F139180666256075&amp;width=200&amp;height=62&amp;colorscheme=dark&amp;show_faces=false&amp;header=false&amp;stream=false&amp;show_border=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:62px;" allowTransparency="true"></iframe></td></tr></table>');
    checkVersion();
    $("#zmenitstatus").change(function() {
        var a = $(this).find("option:selected").text();
        "Available" == a && (API.on(API.setStatus(API.STATUS.AVAILABLE)), API.on(API.sendChat("/me " + a)));
        "AFK" == a && (API.on(API.setStatus(API.STATUS.AFK)), API.on(API.sendChat("/me " + a)));
        "Working" == a && (API.on(API.setStatus(API.STATUS.WORKING)), API.on(API.sendChat("/me " + a)));
        "Gaming" == a && (API.on(API.setStatus(API.STATUS.SLEEPING)), API.on(API.sendChat("/me " + a)))
    });
    $("#playlist-meta").click(zmensiChat)
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
    $("#plugbot-btn-skipvideo").on("click", function() {
        $(this).removeClass(skippingVideo ? BUTTON_ON : BUTTON_OFF);
        skippingVideo = !skippingVideo;
        $(this).addClass(skippingVideo ? BUTTON_ON : BUTTON_OFF);
        hideVideo != skippingVideo && $("#plugbot-btn-hidevideo").click();
        $("#button-sound").click()
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
    skippingVideo && ($("#plugbot-btn-skipvideo").css("class", BUTTON_ON).text("skip video"), $("#button-sound").click(), skippingVideo = !1);
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
    $("#plugbot-userlist").append('<div style="background-color:transparent;padding-top:7px;padding-bottom:7px;border-top:1px solid silver;border-bottom:1px solid silver"><h1 style="text-indent:12px;color:#fff;font-size:14px;font-variant:small-caps;">AutoWoot v' + AktualnaVerzia + '</h1><h1 style="text-indent:12px;color:#orange;font-size:14px;font-variant:small-caps;"> by P\u15e3\u15e7\u2022\u2022\u2022N\u03b1rcis\u2022\u2022 <a href="http://plug.dj/friendly-house-cz-sk/" style="color:lime">my room</a></h1></div><br><h1 style="text-indent:12px;color:#fff;font-size:14px;font-variant:small-caps;">Online:  ' + API.getUsers().length + "</h1>");
    var a = [];
    for (b in API.getUsers()) a.push(API.getUsers()[b]);
    for (b in a) {
        var b = a[b];
        appendUser(b)
    }
}

function appendUser(a) {
    var b = a.username,
        d = a.permission;
    a.admin && (d = 99);
    var c;
    switch (d) {
    case 0:
        c = "normal";
        break;
    case 1:
        c = "residentDJ";
        break;
    case 2:
        c = "bouncer";
        break;
    case 3:
        c = "manager";
        break;
    case 4:
    case 5:
        c = "host";
        break;
    case 99:
        c = "host"
    }
    API.getDJs()[0].username == b ? "normal" === c ? drawUserlistItem("void", "#8FE3FF", b) : drawUserlistItem(c + "_current.png", "#8FE3FF", b) : "normal" === c ? drawUserlistItem("void", colorByVote(a.vote), b) : drawUserlistItem(c + imagePrefixByVote(a.vote), colorByVote(a.vote), b)
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

function drawUserlistItem(a, b, d) {
    "void" !== a && $("#plugbot-userlist").append('<img src="http://autowoot.itoffice.sk/bin/autowoot-icons/' + a + '" align="left" style="margin-left:6px;margin-top:2px" />');
    $("#plugbot-userlist").append('<p style="cursor:pointer;' + ("void" === a ? "" : "text-indent:6px !important;") + "color:" + b + ";" + (API.getDJs()[0].username == d ? "font-weight:bold;font-size:13px;text-shadow:2px 2px 1px #000" : "") + "\" onclick=\"$('#chat-input-field').val($('#chat-input-field').val() + '@" + d + " ').focus();\">" + d + "</p>")
}
$("#plugbot-userlist").remove();
$("#plugbot-css").remove();
$("#plugbot-js").remove();
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
$("body").prepend('<style type="text/css" id="plugbot-css">  #plugbot-ui { margin-top:50px; }   #plugbot-likebox {    position: absolute;     top: 0px;    right:295px;   z-index:3;  background-color:#333;}   #plugbot-ui p {     background-color: #222;   height: 32px;     float:left; padding-top: 8px;     padding-left: 8px;     padding-right: 6px;     cursor: pointer;     font-variant: small-caps;     width: 84px;     font-size: 15px;     margin: 0;   }    #plugbot-ui p:hover { background-color:#333; }   #plugbot-ui h2 {     background-color: #0b0b0b;     height: 112px;     width: 156px;     margin: 0;     color: #fff;     font-size: 13px;     font-variant: small-caps;     padding: 8px 0 0 12px;     border-top: 1px dotted #292929;   }    #plugbot-userlist {  padding: 8px 0px 20px 0px;   position:absolute; top:50px;height:100%;overflow:auto}    #plugbot-userlist p {     margin: 0;     padding-top: 4px;     text-indent: 24px; font-size: 10px;   }    #plugbot-userlist p:first-child {     padding-top: 0px !important;   }   #plugbot-ui p {     background-color: #222;   height: 32px;     padding-top: 8px;     padding-left: 8px;     padding-right: 6px;     cursor: pointer;     font-variant: small-caps;     width: 84px;     font-size: 15px;     margin: 0;   }    #plugbot-ui h2 {     background-color: #0b0b0b;     height: 112px;     width: 156px;     margin: 0;     color: #fff;     font-size: 13px;     font-variant: small-caps;     padding: 8px 0 0 12px;     border-top: 1px dotted #292929;   }    #plugbot-userlist {     background: -moz-linear-gradient(left,  rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%);  background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(0,0,0,0.65)), color-stop(100%,rgba(0,0,0,0)));  background: -webkit-linear-gradient(left,  rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);  background: -o-linear-gradient(left,  rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);  background: -ms-linear-gradient(left,  rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);  background: linear-gradient(to right,  rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);     border-left: 0 !important;   padding: 8px 0px 20px 0px;     width: 12%; z-index:2; position:absolute; top:50px;}    #plugbot-userlist p:hover::before { content: "@ "; }     #PoslednaVerzia { background-color:red;color:white;font-weight:bold;font-size:11px;tet-align:center;padding:10px }     #plugbot-queuespot {    color: #42A5DC;     text-align: left;     font-size: 15px;     margin-left: 8px;  }.InactiveButton {-moz-box-shadow: 0px 1px 0px 0px #ffffff; -webkit-box-shadow: 0px 1px 0px 0px #ffffff; box-shadow: 0px 1px 0px 0px #ffffff; background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ffffff), color-stop(1, #f6f6f6)); background:-moz-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-webkit-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-o-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:-ms-linear-gradient(top, #ffffff 5%, #f6f6f6 100%); background:linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff", endColorstr="#f6f6f6",GradientType=0); background-color:#ffffff; -moz-border-radius:6px; -webkit-border-radius:6px; border-radius:6px; border:1px solid #dcdcdc; display:inline-block; color:#666666; font-family:arial; font-size:15px; font-weight:bold; padding:8px 19px; text-decoration:none; text-shadow:0px 1px 0px #ffffff; } .InactiveButton:hover {background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f6f6f6), color-stop(1, #ffffff)); background:-moz-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-webkit-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-o-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:-ms-linear-gradient(top, #f6f6f6 5%, #ffffff 100%); background:linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#f6f6f6", endColorstr="#ffffff",GradientType=0); background-color:#f6f6f6; } .InactiveButton:active {position:relative; top:1px; }.ActiveButton {-moz-box-shadow:inset 0px 1px 0px 0px #54a3f7; -webkit-box-shadow:inset 0px 1px 0px 0px #54a3f7; box-shadow:inset 0px 1px 0px 0px #54a3f7; background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #007dc1), color-stop(1, #0061a7)); background:-moz-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-webkit-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-o-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:-ms-linear-gradient(top, #007dc1 5%, #0061a7 100%); background:linear-gradient(to bottom, #007dc1 5%, #0061a7 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#007dc1", endColorstr="#0061a7",GradientType=0); background-color:#007dc1; -moz-border-radius:10px; -webkit-border-radius:10px; border-radius:10px; display:inline-block; color:#ffffff; font-family:arial; font-size:15px; font-weight:bold; padding:10px 10px; text-decoration:none; text-shadow:0px 1px 0px #154682; } .ActiveButton:hover {background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1)); background:-moz-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-webkit-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-o-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:-ms-linear-gradient(top, #0061a7 5%, #007dc1 100%); background:linear-gradient(to bottom, #0061a7 5%, #007dc1 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#0061a7", endColorstr="#007dc1",GradientType=0); background-color:#0061a7; } .ActiveButton:active {position:relative; top:1px; }.InactiveButton, .ActiveButton { height:75px;margin:0%; padding:5px 5px 5px 5px;font-size:13px;width:20%;clear:both;border:0px;border-radius:0px;}select.zmenitstatus {width:100%;height:40px;padding:3px; margin: 0; -webkit-border-radius:4px; -moz-border-radius:4px; border-radius:4px; -webkit-box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; -moz-box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; box-shadow: 0 3px 0 #ccc, 0 -1px #fff inset; background: #f8f8f8; color:#888; border:0px;border-top:1px solid silver; outline:none; display: inline-block; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer; } @media screen and (-webkit-min-device-pixel-ratio:0) {select.zmenitstatus {padding-right:18px} } label.zmenitstatuslabel {position:relative} label.zmenitstatuslabel:after {content:"<>"; font:11px "Consolas", monospace; color:#aaa; -webkit-transform:rotate(90deg); -moz-transform:rotate(90deg); -ms-transform:rotate(90deg); transform:rotate(90deg); right:4px; top:2px; padding:0 0 2px; border-bottom:1px solid #ddd; position:absolute; pointer-events:none; } label.zmenitstatuslabel:before {content:""; right:4px; top:0px; width:20px; height:20px; background:#f8f8f8; position:absolute; pointer-events:none; display:block; } ');

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
}
var intervalVerzia = setInterval(checkVersion, 2E3),
    intervalAutoDj = setInterval(queueUpdate, 1E3);
intervalVerzia;
intervalAutoDj;
