const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware")

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then(hash => {
        Users.create({
            username: username,
            password: hash
        })
        res.json("Success");
    })
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username }})
    if (!user) { 
        res.json({ error: "User does not exist!" })
    }

    bcrypt.compare(password, user.password).then(async match => {
        if (!match) {
            res.json({ error: "Wrong username and password combination!"})
        } else {
            const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
            res.json({token: accessToken, username: user.username, id: user.id});
        }
    });
});

router.get("/check", validateToken, (req, res) => {
    res.json(req.user)
})

router.get("/basicInfo/:id", async (req, res) => {
    const { id } = req.params;
    const basicInfo = await Users.findByPk(id, {
        attributes: {
            exclude: ["password"]
        }
    })
    res.json(basicInfo)
})

router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await Users.findOne({ where: {
        username: req.user.username
    }})

    if (!user) { 
        res.json({ error: "User does not exist!" })
    }

    bcrypt.compare(oldPassword, user.password).then(async match => {
        if (!match) {
            res.json({ error: "Wrong password entered!"})
        } else {
            bcrypt.hash(newPassword, 10).then((hash) => {
                Users.update({ password: hash}, { where: {
                      id: user.id
                  }})
                  res.json('Success')
               })
        }
    });
})

module.exports = router;