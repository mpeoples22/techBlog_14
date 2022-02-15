const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth');
const { unsubscribe } = require('./category-routes');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


//get users
router.get('/', (req, res) => {
  User.findall({
    attributes: { exclude: ['password'] }
  })
   .then(dbUserData => res.json(dbUserData))
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

//get user by id
router.get('/:id', (req, res)=> { 
  User.findOne({
    attributes: {exlcude: ['password']},
    where: {
        id: req.params.id
    },
    include: [
        {
            model: Post,
            attributes: ['id', 'title', 'post_text', 'created_at']
        },
    //also comment model
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: Post,
                attributes:['title']

            }
        }   
    ]
  })
   .then(dbUserData => {
     if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id'});
        return;
    }
    res.json(dbUserData); 
 })
   .catch(err => {
     console.log(err);
     res.status(500).json(err);
  });
});
// Create New User/Signup
router.post('/', (req, res) => {
  User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
  })
  .then(dbUserData => {
      req.session.save(() => {
        req.seesion.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData);
      });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});
//login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
       if (!dbUserData) {
           res.status(400).jason({message: 'No user with that email address!'});
           return;
       }
      const validPassword = dbUserData.checkPassword(req.body.password);

      if(!validPassword){
          res.status(400).json({message: 'Incorrect password!'});
          return;
      }

      req.session.save(() => {
      //declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!'});
      });
    });
});
//Logout
router.post('/logout', withAuth, (req, res) => {
  if (req.session.logginIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
  }
  else {
      res.status(404).end();
  }
});
// update user by id
router.put('/:id', withAuth, (reg, res) =>{
    unsubscribe.update(req.body, {
    where: {
       id: req.param.id
    }
})
 .then(dbUserData => {
     if (!dbUserData[0]){
         res.status(404).json({
             message: 'No user found with this id '});
     return;
     }
  res.json(dbUserData);
 })
 .catch(err => {
     console.log(err);
     res.status(500).json(err);
  });
});
//Delet user by id
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({message: 'No user found with this id'});
          return;
     }
     res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;