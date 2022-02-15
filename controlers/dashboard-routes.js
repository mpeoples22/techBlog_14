//Router and connection
const router = require('express').Router();
const sequelize = require('../config/connection');
//data modeling and route protection
const {Post, User, Comment} = required('../models');
const withAuth = require('../utils/auth');

// dashboard, only for logged in user/get all paths
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    //cycle through each object and render html
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true}));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//Edit post
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id

        },
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',  
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model:User,
                attributes: ['username']
            }
        ]
    })
    //message if post not found
    .then(dbPostData => {
        if (!dbPostData){
            res.status(404).json({
                message: 'No post found with this id'});
                return;
        }
    //edit post when found
       const post = dbPostData.get({ plain: true });
       res.render('edit-post', {post, logged: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;
//sequelize connection....