function startApp() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'XXX';
    const appSecret = 'XXX';
    const authHeaders = {
        Authorization: 'Basic ' + btoa(appKey + ':' + appSecret)
    };

    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');

    $("#buttonLoginUser").click(loginUser);
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooks);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logoutUser);
    $("#formLogin").submit(loginUser);
    $("#formRegister").submit(registerUser);
    $("#btnCreateBook").click(createBook);
    $("#btnEditBook").click(editBook);

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

    function showHideMenuLinks() {
        $("#linkHome").show();
        if (sessionStorage.getItem('authToken')) {
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListBooks").show();
            $("#linkCreateBook").show();
            $("#linkLogout").show();
        } else {
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListBooks").hide();
            $("#linkCreateBook").hide();
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

    function showCreateBookView() {
        $('#formCreateBook').trigger('reset');
        showView('viewCreateBook');
    }

    function getUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " +
            sessionStorage.getItem('authToken'),
        };
    }

    function listBooks() {
        $('#books').empty();
        showView('viewBooks');
        $.ajax({
            method: "GET",
            url: baseUrl + "appdata/" + appKey + "/books",
            headers: getUserAuthHeaders(),
            success: loadBooksSuccess,
            error: handleAjaxError
        });

        function loadBooksSuccess(books) {
            showInfo('Books loaded.');
            if (books.length == 0) {
                $('#books').text('No books in the library.');
            } else {
                let booksTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>Title</th><th>Author</th>',
                        '<th>Description</th><th>Actions</th>'));
                for (let book of books)
                    appendBookRow(book, booksTable);
                $('#books').append(booksTable);
            }

            function appendBookRow(b, table) {
                let links = [];
                if (b._acl.creator == sessionStorage['userId']) {
                    let deleteLink = $('<a href="#">[Delete]</a>')
                        .click(function () {
                            deleteBook(b);
                        });
                    let editLink = $('<a href="#">[Edit]</a>')
                        .click(function () {
                            loadBookForEdit(b);
                        });
                    links = [deleteLink, ' ', editLink];
                }
                table.append($('<tr>').append(
                    $('<td>').text(b.title),
                    $('<td>').text(b.author),
                    $('<td>').text(b.description),
                    $('<td>').append(links)
                ));
            }
        }

        function loadBookForEdit(book) {
            $.ajax({
                method: "GET",
                url: baseUrl + "appdata/" + appKey + "/books/" + book._id,
                headers: getUserAuthHeaders(),
                success: loadBookForEditSuccess,
                error: handleAjaxError
            });

            function loadBookForEditSuccess(book) {
                $('#formEditBook input[name=id]').val(book._id);
                $('#formEditBook input[name=title]').val(book.title);
                $('#formEditBook input[name=author]')
                    .val(book.author);
                $('#formEditBook textarea[name=descr]')
                    .val(book.description);
                showView('viewEditBook');
            }
        }
    }

    function createBook() {
        let bookData = {
            title: $('#formCreateBook input[name=title]').val(),
            author: $('#formCreateBook input[name=author]').val(),
            description: $('#formCreateBook textarea[name=descr]').val()
        };
        $.ajax({
            method: "POST",
            url: baseUrl + "appdata/" + appKey + "/books",
            headers: getUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: handleAjaxError
        });

        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }
    }

    function editBook(book) {
        let bookData = {
            title: $('#formEditBook input[name=title]').val(),
            author: $('#formEditBook input[name=author]').val(),
            description:
                $('#formEditBook textarea[name=descr]').val()
        };
        $.ajax({
            method: "PUT",
            url: baseUrl + "appdata/" + appKey + "/books/"
                + $('#formEditBook input[name=id]').val(),
            headers: getUserAuthHeaders(),
            data: bookData,
            success: editBookSuccess,
            error: handleAjaxError
        });

        function editBookSuccess(response) {
            listBooks();
            showInfo('Book edited.');
        }
    }

    function deleteBook(book) {
        $.ajax({
            method: "DELETE",
            url: baseUrl + "appdata/" + appKey + "/books/" + book._id,
            headers: getUserAuthHeaders(),
            success: deleteBookSuccess,
            error: handleAjaxError
        });
        function deleteBookSuccess(response) {
            listBooks();
            showInfo('Book deleted.');
        }
    }

    function logoutUser() {
        //TODO: invoke Kinvey REST _logout
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideMenuLinks();
        showView('viewHome');
        showInfo('Logout successful.');
    }

    function registerUser(event) {
        event.preventDefault();
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
            listBooks();
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

    function loginUser(event) {
        event.preventDefault();
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=password]').val()
        };
        console.dir(userData);
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
            listBooks();
            showInfo('Login successful.');
        }
    }

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
}
