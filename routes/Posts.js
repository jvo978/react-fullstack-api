const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes]})

    const likedPosts = await Likes.findAll({
        where: {
            UserId: req.user.id
        }
    })
    res.json({listOfPosts: listOfPosts, likedPosts: likedPosts })
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findByPk(id)
    res.json(post)
})

router.get("/byUserId/:id", async (req, res) => {
    const id = req.params.id
    const listOfPosts = await Posts.findAll({
        where: {
            UserId: id
        },
        include: [Likes]
    })
    res.send(listOfPosts)
})

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username
    post.UserId = req.user.id
    const postCreated = await Posts.create(post);
    res.json(postCreated)
})

router.put("/title", validateToken, async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update({ title: newTitle }, {
        where: {
            id: id
        }
    })
    res.json(newTitle)
})

router.put("/postText", validateToken, async (req, res) => {
    const { newPostText, id } = req.body;
    await Posts.update({ postText: newPostText }, {
        where: {
            id: id
        }
    })
    res.json(newPostText)
})

router.delete("/:postId", async (req, res) => {
    const postId = req.params.postId
    Posts.destroy({
        where: {
            id: postId
        }
    })
    res.json("Delete Successfully!")
})

module.exports = router;