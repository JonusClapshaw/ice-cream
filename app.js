import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

const orders = [];
//Define the port number where our server will listen 
const PORT = 3009;

dotenv.config();

const pool = mysql2.createPool({
    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT


}).promise();

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

app.get('/db-test', async(req, res) => {


    // try/catch block for error handling
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        // Send the orders data back to the browser as JSON
        res.send(orders);
    } catch(err) {
        // If ANY error happened in the 'try' block, this code runs
        // Log the error to the server console (for developers to see)
        console.error('Database error:', err);

        // Send an error response to the browser
        // status(500) means "Internal Server Error"
        res.status(500).send('Database error: ' + err.message);
    }
});

app.get('/admin', async(req, res) => {

    try {
        // Fetch all orders from the database, newest first
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');

        // Optional: Format timestamps for better display
        orders.forEach(order => {
            order.formattedTimestamp = new Date(order.timestamp).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        });

        // Render the admin page with the orders
        res.render('admin', { orders: orders });

    } catch(err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Add a route for the form submission
// This handles POST requests to /submit-order (when the user submits the pizza order form)
app.post('/submit-order', async(req, res) => {
    // Wrap everything in try/catch to handle potential database errors
    try {
        // Get the order data from the form submission
        // req.body contains all the form fields (fname, lname, email, etc.)
        const order = req.body;

        // Convert the toppings array into a comma-separated string
        // HTML checkboxes submit as an array, but MySQL stores as TEXT
        order.toppings = Array.isArray(order.toppings) ? 
	    order.toppings.join(", ") : "";

        // Add a timestamp to track when this order was placed
        order.timestamp = new Date();

        // Log the order to the server console (helpful for debugging)
        console.log('New order received:', order);

        // Define an SQL INSERT query
        // The ? are PLACEHOLDERS that will be replaced with actual values
        // This prevents SQL injection (a common security vulnerability)

        const sql = `INSERT INTO orders (customer, email, flavor, cone, toppings, timestamp) VALUES (?, ?, ?, ?, ?, ?)`;

        // Create an array of parameters for each ? placeholder in order
        const params = [
            order.fname + order.lname,
            order.email,
            order.flavor,
            order.method,
            order.toppings,
            order.timestamp
        ];

        // Execute the query with the parameters
        const [result] = await pool.execute(sql, params);

        // Optional: You can access the newly inserted row's ID
        console.log('Order inserted with ID:', result.insertId);

        // Pass the order data to the confirmation page 
        res.render('confirmation', { order: order });

    } catch(err) {

        // If ANYTHING goes wrong, this runs
        console.error('Error inserting order:', err);

        // Check if it's a duplicate email error
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('An order with this email already exists.');
        } else {
            // Generic error message for other issues
            res.status(500).send('Sorry, there was an error processing your order. Please try again.');
        }
    }
});

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});