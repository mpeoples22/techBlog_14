const User = require('./User');
const Post =  require('./Post');
const Comment = require('./Comment');


//Associatins between models

User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    oneDelete: 'cascade',
    hooks: true
});
User.hasMany(Comment, {
    foreignKey: "user_id",
    onDelete: 'cascade',
    hook: true
});
Post.hasMany(Comment, {
    foreignkey: 'post_id',
    onDelet: 'cascade',
    hook: true
});

module.exportsn  = {User, Post, Comment};