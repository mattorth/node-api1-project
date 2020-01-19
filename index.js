// implement your API here
// import express
const express = require('express');

// import db
const db = require('./data/db.js');

// create server
const server = express();

// listen
server.listen(4000, () => {
    console.log("*** listening on port 4000");
})

// global middleware section
server.use(express.json());

//POST user
server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    db.insert(userInfo)
        .then(user => {
            if(userInfo.name && userInfo.bio) {
                res.status(201).json(user);
            } else {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database", err })
        })
});

// GET users
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({success: false, errorMessage: "The users information could not be retrieved"});
        });
});

// GET users by id
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params

    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, errorMessage: "The user information could not be retrieved." });
        });
});

// DELETE user
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(200).json({ success: true, deleted });
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed." });
        });
});

// PUT user
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json({ success: true, updated });
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        });
});


