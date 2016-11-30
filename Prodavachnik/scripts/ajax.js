function listAdvertisements() {
    $('#ads').empty();
    showView('viewAds');
    $.ajax({
        method: "GET",
        url: baseUrl + "appdata/" + appKey + "/" + db,
        headers: getUserAuthHeaders(),
        success: loadAdvertisementsSuccess,
        error: handleAjaxError
    });

    function loadAdvertisementsSuccess(advs) {
        showInfo('Advertisements loaded.');
        if (advs.length == 0) {
            $('#ads').text('No advertisements in the library.');
        } else {
            let advTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th>',
                    '<th>Description</th>',
                    '<th>Publisher</th>',
                    '<th>Date published</th>',
                    '<th>Price</th>',
                    '<th>Actions</th>'));
            for (let adv of advs) {
                appendAdvertisement(adv, advTable);
            }
            $('#ads').append(advTable);
        }

        function appendAdvertisement(adv, table) {
            let viewLink = $('<a href="#">[View]</a>')
                .click(function () {
                    displayAd(adv._id);
                });
            let links = [viewLink];
            if (adv._acl.creator == sessionStorage['userId']) {
                let deleteLink = $('<a href="#">[Delete]</a>')
                    .click(function () {
                        deleteAdv(adv._id);
                    });
                let editLink = $('<a href="#">[Edit]</a>')
                    .click(function () {
                        loadAdvForEdit(adv._id);
                    });
                links = [viewLink, ' ', deleteLink, ' ', editLink];
            }
            table.append($('<tr>').append(
                $('<td>').text(adv.title),
                $('<td>').text(adv.description),
                $('<td>').text(adv.publisher),
                $('<td>').text(adv.datePublished),
                $('<td>').text(adv.price),
                $('<td>').append(links)
            ));
        }
    }
}

function createAdv() {
    const userUrl = `${baseUrl}user/${appKey}/${sessionStorage.getItem('userId')}`;
    $.get({
        url: userUrl,
        headers: getUserAuthHeaders(),
        success: afterPublisherRequest,
        error: showError
    });

    function afterPublisherRequest(publisher) {
        let advData = {
            title: $('#formCreateAd input[name=title]').val(),
            description: $('#formCreateAd textarea[name=description]').val(),
            publisher: publisher.username,
            datePublished: $('#formCreateAd input[name=datePublished]').val(),
            price: Number($('#formCreateAd input[name=price]').val()),
            image: $('#formCreateAd input[name=image]').val()
        };

        $.ajax({
            method: "POST",
            url: baseUrl + "appdata/" + appKey + "/" + db,
            headers: getUserAuthHeaders(),
            data: advData,
            success: createAdvSuccess,
            error: handleAjaxError
        });
    }

    function createAdvSuccess(response) {
        listAdvertisements();
        showInfo('Advertisement created.');
    }
}

function loadAdvForEdit(advId) {
    $.ajax({
        method: "GET",
        url: baseUrl + "appdata/" + appKey + "/" + db + "/" + advId,
        headers: getUserAuthHeaders(),
        success: loadAdvForEditSuccess,
        error: handleAjaxError
    });

    function loadAdvForEditSuccess(adv) {
        $('#formEditAd input[name=id]').val(adv._id);
        $('#formEditAd input[name=title]').val(adv.title);
        $('#formEditAd input[name=publisher]').val(adv.publisher);
        $('#formEditAd textarea[name=description]').val(adv.description);
        $('#formEditAd input[name=datePublished]').val(adv.datePublished);
        $('#formEditAd input[name=price]').val(adv.price);
        $('#formEditAd input[name=image]').val(adv.image);
        showView('viewEditAd');
    }
}

function editAdv() {
    let advData = {
        title: $('#formEditAd input[name=title]').val(),
        description: $('#formEditAd textarea[name=description]').val(),
        publisher: $('#formEditAd input[name=publisher]').val(),
        price: $('#formEditAd input[name=price]').val(),
        datePublished: $('#formEditAd input[name=datePublished]').val(),
        image: $('#formEditAd input[name=image]').val()
    };

    $.ajax({
        method: "PUT",
        url: baseUrl + "appdata/" + appKey + "/" + db + "/"
        + $('#formEditAd input[name=id]').val(),
        headers: getUserAuthHeaders(),
        data: advData,
        success: editAdvSuccess,
        error: handleAjaxError
    });

    function editAdvSuccess(response) {
        listAdvertisements();
        showInfo('Book edited.');
    }
}

function deleteAdv(advId) {
    $.ajax({
        method: "DELETE",
        url: baseUrl + "appdata/" + appKey + "/" + db + "/" + advId,
        headers: getUserAuthHeaders(),
        success: deleteAdvSuccess,
        error: handleAjaxError
    });
    function deleteAdvSuccess(response) {
        listAdvertisements();
        showInfo('Advertisement deleted.');
    }
}

function displayAd(advId) {
    $.ajax({
        method: "GET",
        url: baseUrl + "appdata/" + appKey + "/" + db + "/" + advId,
        headers: getUserAuthHeaders(),
        success: loadDetailsAdvSuccess,
        error: handleAjaxError
    });

    $('#viewDetailsAd').empty();

    function loadDetailsAdvSuccess(adv) {
        let html = $('<div>');
        html.append(
            $('<img>').attr('src', adv.image),
            $('<br>'),
            $('<label>').text('Price: '),
            $('<div>').text(adv.price),
            $('<label>').text('Title: '),
            $('<h1>').text(adv.title),
            $('<label>').text('Description: '),
            $('<p>').text(adv.description),
            $('<label>').text('Publisher: '),
            $('<div>').text(adv.publisher),
            $('<label>').text('Date published: '),
            $('<div>').text(adv.datePublished)
        );
        $('#viewDetailsAd').append(html);
        showView('viewDetailsAd');
    }
}