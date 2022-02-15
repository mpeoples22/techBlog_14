//
const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const sequelize = require("../../config/connetion");
const withAuth = require('../../utils/auth');



//get posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "post_text", "title", "created_at"],
        order: [["created_at", "DESC"]],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes:["username"],
            },
        ],
    })
      .then((dbPostData)=> res.json(dbPostData))
      .catch((err)=>{
          console.log(err);
          res.status(500).json(err);
      });
});

// get post with id
router.get("/:id", (req, res)=> {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include:[
         {
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
                model:User,
                attributes: ["username"],
            },
         },
        {
            model: User,
            attributes: ["username"],
        },
      ],
    })
    .then((dbPostData)=> {
        if (!dbPostData) {
          res.status(404).json({message: "No post found with this id"});
          return;
        }
     res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);  
    });
});
//create new post
router.post("/", withAuth, (req, res)=> {
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id,
    })
    .then((dbPostData)=> res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});
//update post 
router.put("/:id", withAuth, (req, res)=> {
    Post.update(req.body,
     {
            where: {
              id: req.params.id
            }
    })
    .then((dbPostData)=> {
      if(!dbPostData) {
          res.status(404).json({message: "No post found with this id" });
          return;
      }
     res.json(dbPostData); 
    })
    .catch((err)=> {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;