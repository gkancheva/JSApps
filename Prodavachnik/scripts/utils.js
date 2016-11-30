function showInfo(msg) {
    $('#infoBox').text(msg);
    $('#infoBox').show();
    setTimeout(function() {
        $('#infoBox').fadeOut();
    }, 3000);

}

function handleAjaxError(error) {
    let errorMsg = JSON.stringify(error);
    if (error.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (error.responseJSON &&
        error.responseJSON.description)
        errorMsg = error.responseJSON.description;
    showError(errorMsg);
}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}