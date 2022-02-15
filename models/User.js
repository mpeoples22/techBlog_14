const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bycrypt = required('bycryp');
// create instance of User with Modle properties
class User extends Model{
    checkPassword(loginPw) {
        return bycrypt.compareSync(loginPw, this.password);
    }
}
User.init(
    {
        id:{
           type: DataTypes.INTEGER,
           allowNull: false,
           primaryKey: true,
           autoIncrement: true 
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: { 
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        }
    },
    //hash user password with bycrypt
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bycrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bycrypt.hash(
                    updatedUserData.password, 10);
                    return updatedUserData;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);
