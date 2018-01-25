/**
 * Created by M on 12/10/15.
 */

var onboarding = true;
var showingRightClickHelp = false;

function onboardRestart() {
    $('#line').hide();
    $('#start').show();
}
function onboardClicked() {
    $('#start').hide();
    $('#line').show();
}

function onboardLined() {
    $('#line').hide();
    $('#rectangle').show();
}

function onboardEnd() {
    $('#rectangle').hide();
    onboarding = false;
}

