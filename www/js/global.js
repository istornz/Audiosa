elementProgress			= null;
pseudo					= null;
passwordHash			= null;
stateLogLoading			= false;
stateIllustrerLoading	= false;
customMetatag			= 0;
currentMetatag			= 0;
idPisteEdit				= null;
md5PisteEdit			= null;

function blurAction(state, div) {
    if (state == 1) div.className = "fullPageBlurred";
    else div.className = "";
}

$(window).on('popupbeforeposition', 'div:jqmData(role="popup")', function() {
    var notDismissible = $(this).jqmData('dismissible') === false;
    if (notDismissible) {
        $('.ui-popup-screen').off();
    }
});

function navigateToPopupID(page)
{
    $.mobile.changePage(page, 'pop', true, true);
}

function firstLetterUppercase(string)
{
    return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}