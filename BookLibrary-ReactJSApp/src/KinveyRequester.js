import $ from 'jquery';

const KinveyRequester = (function () {
    const baseUrl = "https://baas.kinvey.com/";
    const appId = "kid_rkEYvWdMx";
    const appSecret = 'ba206b47d7884ac89fe2121176f40d01';
    const db = 'books';
    const authHeaders = {
        'Authorization': "Basic " + btoa(appId + ":" + appSecret),
    };

    //User ajax requests
    function loginUser(username, password) {
        return $.ajax({
            method: "POST",
            url: baseUrl + "user/" + appId + "/login",
            headers: authHeaders,
            data: { username, password }
        });
    }

    function registerUser(username, pass) {
        return $.ajax({
            method: "POST",
            url: baseUrl + "user/" + appId,
            headers: authHeaders,
            data: { username, pass }
        });
    }

    function getUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
        };
    }

    function logoutUser() {
        return $.ajax({
            method: "POST",
            url: baseUrl + "user/" + appId + "/_logout",
            headers: getUserAuthHeaders(),
        });
    }

    //Books ajax requests
    function getAllBooks() {
        return $.ajax({
            method: "GET",
            url: baseUrl + "appdata/" + appId + "/" + db,
            headers: getUserAuthHeaders(),
        });
    }

    function createBook(title, author, description) {
        return $.ajax({
            method: "POST",
            url: baseUrl + "appdata/" + appId + "/" + db,
            headers: getUserAuthHeaders(),
            data: { title, author, description }
        });
    }

    function getBookById(bookId) {
        return $.ajax({
            method: "GET",
            url: baseUrl + "appdata/" + appId + "/" + db + "/" + bookId,
            headers: getUserAuthHeaders()
        });
    }

    function editBook(bookId, title, author, description) {
        return $.ajax({
            method: "PUT",
            url: baseUrl + "appdata/" + appId + "/" + db + "/" + bookId,
            headers: getUserAuthHeaders(),
            data: { title, author, description }
        });
    }

    function deleteBook(bookId) {
        return $.ajax({
            method: "DELETE",
            url: baseUrl + "appdata/" + appId + "/" + db + "/" + bookId,
            headers: getUserAuthHeaders()
        });
    }
    
    return {
        loginUser,
        registerUser,
        logoutUser,
        getAllBooks,
        createBook,
        getBookById,
        editBook,
        deleteBook
    }
})();

export default KinveyRequester;