//VIEW
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers.js");
//CONNECTION
const app = express();
const PORT = process.env.PORT || 3001;
//DATABASE(MODEL)
const sequelize = require('./config/connection');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
//session parameters
const sess = {
    secret: process.env.DB_SESSION_SECRET,
    cookie: { maxAge: 7000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    })
};
//activate connection
app.use(session(sess));

const hbs = exphbs.create({helpers});
//designate engine and set variable name
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
//activate middleware
app.use(express.json());
app.use(express.urlencoded({ extented: true}));
app.use(express.static(path.join(__dirname, "public")));
//bring in major arteries...
app.use(require("./controllers/"));
//snyc all database models
sequelize.sync({ force: false }).then(() => {
  console.log('syced')
  app.listen(PORT, () => console.log("Now listening"));
});


