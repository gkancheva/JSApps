const baseUrl = 'https://baas.kinvey.com/';
const appKey = 'app-key';
const appSecret = 'app-secret';
const db = 'advertisements';
const authHeaders = {
    Authorization: 'Basic ' + btoa(appKey + ':' + appSecret)
};

function registerUser() {
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=password]').val()
    };
    $.ajax({
        method: 'POST',
        url: baseUrl + 'user/' + appKey + '/',
        headers: authHeaders,
        data: JSON.stringify(userData),
        contentType: 'application/json',
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess(user) {
        saveAuthInSession(user);
        showHideMenuLinks();
        listAdvertisements();
        showInfo('User registration successful.');
    }
}

function saveAuthInSession(user) {
    let userAuth = user._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = user._id;
    sessionStorage.setItem('userId', userId);
    let username = user.username;
    $('#loggedInUser').text(
        "Welcome, " + username + "!");
}

function getUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " + sessionStorage.getItem('authToken')
    };
}

function loginUser() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=password]').val()
    };
    $.ajax({
        method: "POST",
        url: baseUrl + "user/" + appKey + "/login",
        headers: authHeaders,
        data: JSON.stringify(userData),
        contentType: 'application/json',
        success: loginSuccess,
        error: handleAjaxError
    });

    function loginSuccess(user) {
        saveAuthInSession(user);
        showHideMenuLinks();
        listAdvertisements();
        showInfo('Login successful.');
    }
}

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');
}
