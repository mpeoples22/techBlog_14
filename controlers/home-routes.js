const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment } = require('../models');

//show homepage
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model:Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
        
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true}));
        res.render('homepage', {
            post
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//single post page
router.get('/post/:id', (req, res)=> {
    Post.findOne({
        where:{
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
                model:User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'ceated_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        const post = dbPostData.get({ plain: true });
        res.render('single-post', {
            post
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//Render login page. If user logged in, send to home page
router.get('/loggin', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
//sign up page/home/if logged
router.get('/signup', (req, res) =>{
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;