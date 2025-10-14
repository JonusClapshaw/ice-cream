import express from 'express';

//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

//Define the port number where our server will listen 
const PORT = 3001;

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    //res.send('Welcome to ice cream!');
    res.sendFile(`${import.meta.dirname}/views/home.html`);
})

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})