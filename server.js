const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/api/accounts/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/accounts/:id", (req, res) => {
  db.select("*")
    .from("accounts")
    .where("id", "=", req.params.id)
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/accounts", (req, res) => {
  db("accounts")
    .insert(req.body, "id")
    .then(ids => {
      res.status(200).json({ id: ids, newData: req.body });
    }).catch(error => {
        res.status(500).json({ error: error})
    });
});


server.put("/api/accounts/:id", (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        res
          .status(200)
          .json({ count: count, id: req.params.id, updatedData: req.body });
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
});

server.delete("/api/accounts/:id", (req, res) => { 
    db("accounts")
      .where({ id: req.params.id })
      .del()
      .then(count => {
        res.status(200).json({
          count: count,
          message: `The data with ID: ${req.params.id} was removed`
        });
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
})
module.exports = server;
