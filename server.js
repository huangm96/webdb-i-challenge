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
        res.status(500).json({ error:error, message: "The accounts information could not be retrieved." });
    });
});

server.get("/api/accounts/:id", (req, res) => {
  db.select("*")
    .from("accounts")
    .where("id", "=", req.params.id)
    .first()
    .then(account => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(400).json({ message: "invalid account id" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({
          error: error,
          message: "The account information could not be retrieved."
        });
    });
});

server.post("/api/accounts",validateAccountInfo,(req, res) => {
  db("accounts")
    .insert(req.body, "id")
    .then(ids => {
      res.status(200).json({ id: ids, newData: req.body });
    }).catch(error => {
        res.status(500).json({
          error: error,
          message: "The account information could not be saved."
        });
    });
});


server.put("/api/accounts/:id",validateId, (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        res
          .status(200)
          .json({ count: count, id: req.params.id, updatedData: req.body });
      })
      .catch(error => {
        res.status(500).json({
          error: error,
          message: "The account information could not be modified."
        });
      });
});

server.delete("/api/accounts/:id",validateId, (req, res) => { 
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
        res.status(500).json({
          error: error,
          message: "The account information could not be removed."
        });
      });
})

function validateAccountInfo(req, res, next) {
    if (!req.body) {
        res.status(400).json({message:"please provide the account info"})
    } else if (!req.body.name || !req.body.budget) {
        res.status(400).json({ message: "missing required name or/and budget" });
    } else {
        next();
    }
}

function validateId(req, res, next) {
     db.select("*")
       .from("accounts")
       .where("id", "=", req.params.id)
       .first()
       .then(account => {
         if (account) {
             next();
         } else {
           res.status(400).json({ message: "invalid account id" });
         }
       })
       .catch(error => {
         res.status(500).json(error);
       });
}
module.exports = server;
