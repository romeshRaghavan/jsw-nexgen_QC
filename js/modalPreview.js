/*
Cross-browser Modal Popup using Javascript (JQuery)
*/

//Modal popup background ID. 
//This value should be unique so that it does not conflict with other IDs in the page.
var _ModalPopupBackgroundID = 'backgroundPopup_XYZ_20110418_Custom';

function ShowModalPopup(modalPopupID) {

    //Setting modal popup window

    //Boolean to detect IE6.
    var isIE6 = (navigator.appVersion.toLowerCase().indexOf('msie 6') > 0);

    var popupID = "#" + modalPopupID;

    //Get popup window margin top and left
    var popupMarginTop = j(popupID).height() / 2;
    var popupMarginLeft = j(popupID).width() / 2;

    //Set popup window left and z-index
    //z-index of modal popup window should be higher than z-index of modal background
    j(popupID).css({
        'left': '50%',
        'z-index': 9999
    });

    //Special case for IE6 because it does not understand position: fixed
    if (isIE6) {
        j(popupID).css({
            'top': j(document).scrollTop(),
            'margin-top': j(window).height() / 2 - popupMarginTop,
            'margin-left': -popupMarginLeft,
            'display': 'block',
            'position': 'absolute'
        });
    }
    else {
        j(popupID).css({
            'top': '50%',
            'margin-top': -popupMarginTop,
            'margin-left': -popupMarginLeft,
            'display': 'block',
            'position': 'fixed'
        });
    }

    //Automatically adding modal background to the page.
    var backgroundSelector = j('<div id="' + _ModalPopupBackgroundID + '" ></div>');

    //Add modal background to the body of the page.
    backgroundSelector.appendTo('body');

    //Set CSS for modal background. Set z-index of background lower than popup window.
    backgroundSelector.css({
        'width': j(document).width(),
        'height': j(document).height(),
        //'display': 'none',
        //'background-color': '#555555',
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': 9990
    });

    backgroundSelector.fadeTo('fast', 0.8);
}

function HideModalPopup(modalPopupID) {
    //Hide modal popup window
    j("#" + modalPopupID).css('display', 'none');

    //Remove modal background from DOM.
    j("#" + _ModalPopupBackgroundID).remove();
}