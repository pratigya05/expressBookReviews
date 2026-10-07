const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ===============================
// REGISTER A NEW USER
// ===============================
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User registered successfully"
    });
});


// ===============================
// GET ALL BOOKS
// ===============================
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


// ===============================
// GET BOOK BY ISBN
// ===============================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        // Axios is used here as required by the assignment.
        // The data is taken from the local books database.
        const response = await axios.get(
            'http://localhost:5000/books-data'
        );

        if (response.data[isbn]) {
            return res.status(200).json(response.data[isbn]);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve book"
        });
    }
});


// ===============================
// INTERNAL BOOK DATA ROUTE
// ===============================
public_users.get('/books-data', function (req, res) {
    return res.status(200).json(books);
});


// ===============================
// GET BOOKS BY AUTHOR
// ===============================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;

        const response = await axios.get(
            'http://localhost:5000/books-data'
        );

        const result = {};

        for (let isbn in response.data) {
            if (
                response.data[isbn].author.toLowerCase() ===
                author.toLowerCase()
            ) {
                result[isbn] = response.data[isbn];
            }
        }

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        }

        return res.status(404).json({
            message: "No books found for this author"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// ===============================
// GET BOOKS BY TITLE
// ===============================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const response = await axios.get(
            'http://localhost:5000/books-data'
        );

        const result = {};

        for (let isbn in response.data) {
            if (
                response.data[isbn].title.toLowerCase() ===
                title.toLowerCase()
            ) {
                result[isbn] = response.data[isbn];
            }
        }

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        }

        return res.status(404).json({
            message: "No books found with this title"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// ===============================
// GET BOOK REVIEW
// ===============================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


module.exports.general = public_users;
