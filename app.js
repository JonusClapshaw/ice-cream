import express from 'express';

//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

const orders = [];
//Define the port number where our server will listen 
const PORT = 3001;

app.set ('view engine', 'ejs');

app.use (express.urlencoded({ extended: true }));

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    //res.send('Welcome to ice cream!');
    res.render('home');
});

app.get('/confirm', (req, res) => {
    res.render('confirmation');
});

app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

app.post('/submit-order', (req, res) => {
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        flavor: req.body.flavor,
        method: req.body.method,
        toppings: req.body.toppings,
        comment: req.body.comment
    }

    orders.push(order);
    console.log(orders);

    res.render('confirmation', {order});

});

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
});