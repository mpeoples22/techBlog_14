//import express router, comment model, and route restrictor method
const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require('../../utils/auth');

//all comments
router.get("/", (req, res) => {
  Comment.findall()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create comment
router.post("/", withAuth, (req, res) => {
    if (req.session) {
      Comment.create({
          comment_text: req.body.comment_text,
          post_id: req.body.post_id,
          user_id: req.session.user_id
      })  
      .then((dbCommentData) => res.json(dbCommentData))
      .catch((err) => {
          console.log(err);
          res.status(400).json(err);
      });
    }
});
// delete a comment
router.delet("/ :id", withAuth, (req, res) => {
      Comment.destroy({
          where: {
              id: req.params.id,
          },
      })
        .then((dbCommentData) => {
          if (dbCommentData) {
              res.status(404).json({
                  Message: "No comment found with this id" })
              return;
          }
          res.json(dbCommentData);
        })
        .catch((err) => {
            console.log(err);
        });
});
module.exports = router;