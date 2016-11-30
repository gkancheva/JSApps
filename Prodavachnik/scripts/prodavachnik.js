function startApp() {
    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');

    $('#linkHome').click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListAds").click(listAdvertisements);
    $("#linkCreateAd").click(showCreateAdv);
    $("#linkLogout").click(logoutUser);

    $("#btnRegisterUser").click(registerUser);
    $("#btnLoginUser").click(loginUser);
    $("#buttonCreateAd").click(createAdv);
    $("#buttonEditAd").click(editAdv);

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    $(document).on({
        ajaxStart: function() {
            $("#loadingBox").show()
        },
        ajaxStop: function() {
            $("#loadingBox").hide()
        }
    });
}