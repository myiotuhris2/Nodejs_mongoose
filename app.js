const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();
const mongoose=require('mongoose')
//const mongoConnect=require('./util/database').mongoConnect

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User=require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById("6a2fa43184a464fc29f0a219").then(user=>{
        req.user=user;//mongoose model with all methods available
        next();
    }).catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose.connect('mongodb+srv://sarkartrisha200_db_user:iSDaFHcqvBktUSpw@cluster0.dlu2ota.mongodb.net/shop?appName=Cluster0')
.then(result=>{
    console.log('Connected')
    User.findOne().then(user=>{
        if(!user){
        const user=new User({
        name:'Max',
        email:'max@test.com',
        cart:[]
    })
    user.save()
    }
    })
    app.listen(3000);
})
.catch(error=>
    console.log(error)
)

    
