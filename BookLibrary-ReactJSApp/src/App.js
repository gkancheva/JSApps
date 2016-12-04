import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';

import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import RegisterView from './Views/RegisterView';
import BooksView from './Views/BooksView';
import CreateBookView from './Views/CreateBookView';
import EditBookView from './Views/EditBookView';
import DeleteBookView from './Views/DeleteBookView';
import KinveyRequester from './KinveyRequester';

import $ from 'jquery';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            username: sessionStorage.getItem('username'),
            userId: sessionStorage.getItem('userId')
        });
    }

    render() {
        return (
            <div className="App">
              <header>
                <NavBar
                    username={this.state.username}
                    homeClicked={this.showHomeView.bind(this)}
                    loginClicked={this.showLoginView.bind(this)}
                    registerClicked={this.showRegisterView.bind(this)}
                    booksClicked={this.showBooksView.bind(this)}
                    createBookClicked={this.showCreateBookView.bind(this)}
                    logoutClicked={this.logout.bind(this)}
                />
                <div id="loading-box">Loading...</div>
                <div id="info-box">Info message.</div>
                <div id="error-box">Error message!</div>
              </header>
              <div id="main"></div>
              <Footer/>
            </div>
        );
    }

    componentDidMount() {
        $(document).on({
            ajaxStart: function () {
                $('#loading-box').show();
            },
            ajaxStop: function () {
                $('#loading-box').hide();
            }
        });
        $(document).ajaxError(
            this.handleAjaxError.bind(this)
        );

        $('#info-box, #error-box').click(function () {
            $(this).fadeOut();
        });

        this.showHomeView();
    }

    handleAjaxError(event, response) {
        let errorMsg = JSON.stringify(response);
        if(response.readyState === 0) {
          errorMsg = 'Cannot connect due to network error.';
        }
        if(response.responseJSON && response.responseJSON.description) {
          errorMsg = response.responseJSON.description;
        }
        this.showError(errorMsg);
    }

    showError (errMsg) {
        $('#error-box').text('Error: ' + errMsg).show();
    }

    showInfo(msg) {
        $('#info-box').text(msg).show();
        setTimeout(function () {
            $('#info-box').fadeOut();
        }, 3000);
    }

    showView(component) {
        ReactDOM.render(
            component,
            document.getElementById('main')
        );
        $('#error-box').hide();
    }

    showHomeView() {
        this.showView(<HomeView username={this.state.username}/>);
    }

    showLoginView() {
        this.showView(<LoginView onsubmit={this.login.bind(this)}/>);
    }

    showRegisterView() {
        this.showView(<RegisterView onsubmit={this.register.bind(this)}/>)
    }

    showBooksView() {
        KinveyRequester
            .getAllBooks()
            .then(loadBooksSuccess.bind(this));

        function loadBooksSuccess(books) {
            this.showInfo("Books loaded.");
            this.showView(
                <BooksView
                    books={books}
                    userId={this.state.userId}
                    editBookClicked={this.prepareBookForEdit.bind(this)}
                    deleteBookClicked={this.confirmBookDelete.bind(this)}
                />
            );
        }
    }

    showCreateBookView() {
        this.showView(<CreateBookView onsubmit={this.createBook.bind(this)} />);
    }

    createBook(title, author, description) {
        KinveyRequester
            .createBook(title, author, description)
            .then(createBookSuccess.bind(this));

        function createBookSuccess() {
            this.showBooksView();
            this.showInfo("Book created.");
        }
    }

    prepareBookForEdit(bookId) {
        KinveyRequester
            .getBookById(bookId)
            .then(loadBookForEditSuccess.bind(this));

        function loadBookForEditSuccess(bookInfo) {
            this.showView(
                <EditBookView
                    onsubmit={this.editBook.bind(this)}
                    bookId={bookInfo._id}
                    title={bookInfo.title}
                    author={bookInfo.author}
                    description={bookInfo.description}
                />
            );
        }
    }

    editBook(bookId, title, author, description) {
        KinveyRequester.editBook(bookId, title, author, description)
            .then(editBookSuccess.bind(this));

        function editBookSuccess() {
            this.showBooksView();
            this.showInfo("Book created.");
        }
    }

    confirmBookDelete(bookId) {
        KinveyRequester
            .getBookById(bookId)
            .then(loadBookForDeleteSuccess.bind(this));

        function loadBookForDeleteSuccess(bookInfo) {
            this.showView(
                <DeleteBookView
                    onsubmit={this.deleteBook.bind(this)}
                    bookId={bookInfo._id}
                    title={bookInfo.title}
                    author={bookInfo.author}
                    description={bookInfo.description}
                />
            );
        }
    }

    deleteBook(bookId) {
        KinveyRequester
            .deleteBook(bookId)
            .then(deleteBookSuccess.bind(this));

        function deleteBookSuccess() {
            this.showBooksView();
            this.showInfo("Book deleted.");
        }
    }

    register(username, password) {
        KinveyRequester
            .registerUser(username, password)
            .then(registerSuccess.bind(this));

        function registerSuccess(userData) {
            this.saveAuthInSession(userData);
            this.showInfo("Registered successful!");
            this.showBooksView();
        }
    }

    login(username, password) {
        KinveyRequester
            .loginUser(username, password)
            .then(loginSuccess.bind(this));

        function loginSuccess(userData) {
            this.saveAuthInSession(userData);
            this.showBooksView();
            this.showInfo("Login successful!");
        }
    }

    saveAuthInSession(userData) {
      sessionStorage.setItem('authToken', userData._kmd.authtoken);
      sessionStorage.setItem('userId', userData._id);
      sessionStorage.setItem('username', userData.username);

      this.setState({
          username: userData.username,
          userId: userData._id
      })
    }

    logout() {
        KinveyRequester.logoutUser();
        sessionStorage.clear();
        this.setState({username: null, userId: null});
        this.showInfo('Logout successful.');
        this.showHomeView();
    }
}