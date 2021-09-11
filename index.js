const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const app = express();

const publishable_key = "pk_test_51JOGAdSINuiPRWxBGVjXE4jSWn5hQiaYkRnsbtePVHBszLu6iZkwJH8ALoX9jolWY7K0ixew6cLssIjApeHMygPB00QJYIxJxD";
const secret_key = "sk_test_51JOGAdSINuiPRWxBWuS2037hIPdhLJfO3fGSbYyR7GHGhfjqU6jzc4n4xyWOPZHjVr2s2xC8hWr6mNjYToFrClaP00kUKuTmur";

const stripe = require("stripe")(secret_key);

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static("views"));

//view engine set up
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("Home", {
        key: publishable_key
    })

})

app.post("/payment", (req, res) => {

    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Rutuja Labhshetwar',
        address: {
            line1: "N-7,Sunshine Colony",
            postal_code: "110092",
            city: "New Delhi",
            state: "Delhi",
            country: "India"
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: 7000,
                description: "Donation",
                currency: "INR",
                customer: customer.id
            });
        })
        .then((charge) => {

            res.render("Success", {
                key: publishable_key
            })
        })
        .catch((err) => {
            res.send(err);           //if some error occurs
        })
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`App is listening on ${port}`);
})