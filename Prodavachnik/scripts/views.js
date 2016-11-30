function showHideMenuLinks() {
    $("#linkHome").show();
    if (sessionStorage.getItem('authToken')) {
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListAds").show();
        $("#linkCreateAd").show();
        $("#linkLogout").show();
    } else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListAds").hide();
        $("#linkCreateAd").hide();
        $("#linkLogout").hide();
    }
}

function showView(viewName) {
    $('main > section').hide();
    $('#' + viewName).show();
}

function showHomeView() {
    showView('viewHome');
}

function showRegisterView() {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showCreateAdv() {
    $('#formCreateAd').trigger('reset');
    showView('viewCreateAd');
}