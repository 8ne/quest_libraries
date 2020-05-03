// ----------------------------------------------------------------------------------------------------
// MARK Initialisation of FeedBack
// ----------------------------------------------------------------------------------------------------
function initFeedBack () {
    // ----------------------------------------------------------------------------------------------------
    // MARK Create FeedBack-Button
    // ----------------------------------------------------------------------------------------------------
    $('body').append(
        '<div id="feedback_button" style="height:100px;width:100px;top:0px;left:0px"></div>'
    );
    // ----------------------------------------------------------------------------------------------------
    // MARK Create FeedBack-Form
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // MARK Send FeedBack
    // ----------------------------------------------------------------------------------------------------
    Email.send({
        Host : "smtp.scriptgames.de",
        Username : "kontakt@scriptgames.de",
        Password : "y8rAQ6295L73",
        To : 'svenherr@web.de',
        From : "kontakt@scriptgames.de",
        Subject : "This is the subject",
        Body : "And this is the body"
    }).then(
      message => alert("...")
    );
}

// ----------------------------------------------------------------------------------------------------
// MARK Send-Mail-Impementation from SmtpJS.com
// ----------------------------------------------------------------------------------------------------
/* SmtpJS.com - v3.0.0 */
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };