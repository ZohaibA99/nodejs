//create a local server 
//port 3000 
//localhost:3000/
const express = require('express');
const app = express();

const myRouter = require('./my-router.js');

app.use('/my-router', myRouter);

app.all('/anything', (req,res, next) => {
    console.log("anthing method");
    next();
})

//chaining http methods using application routing
app
.route('/blog')
.get((req, res) => {
    res.send("result of first method")
})
.post((req, res) => {
    //some code exicution
})
.put((req, res) => {
    console.log("update method")
})

app.use((req, res, next) => {
    console.log('Our middleware');
    next();
})

//passing data via form 1: use the express.urlencoded method
app.use(express.urlencoded({extended: false}))

//2: now your http method utilized
app.post('/login', (req, res, next) => {
    const {email, password} = req.body
    res.send(`${email} ${password}`);
})

app.get('/' , (req, res) => {
    res.send("Hello world");
});

app.get('/contact', (req, res) => {
    res.send("<h1>Contact Page</h1>");
});

//regex
//? 0 or 1 
//app.get('/con?tact', (req, res)) //cotact //contact
app.get("/con?tact", (req, res) => {
    res.send("<h1>?</h1>");
})

//+ -> 1 or more times //contact //connntact
app.get("/con+tact", (req, res) => {
    res.send("<h1>+</h1>");
})


//* -> any number of characters can appear in place of this previos one /con123tact
app.get("/con*tact", (req, res) => {
    res.send("<h1>*</h1>");
})

//passing a parameter to the url
//use the ":" to declare parameters
///contact/123 id=> 123
app.get('/contact/:id', (req, res) => {
    res.send(`${req.params.id}`)
});

//Route with Get Parameters
//http://localhost:3000/contacts?skip=0&limit=10
app.get('/contacts', (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    res.send(`${skip} ${limit}`)
})



//Using JSON Parser
app.use(express.json());

app.post('/login', (req, res, next) => {
    const {email, passowrd} = req.body;
});


app.listen(3000, () => {
    console.log("Example app is listening at port 3000");
});