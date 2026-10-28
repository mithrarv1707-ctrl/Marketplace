const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

const sellers = [];

app.get("/", (req, res) => {
    let html = "<h1>Marketplace Application - v1</h1>";

    html += "<h2>Add Seller</h2>";
    html += '<form method="POST" action="/seller">';
    html += '<input name="name" placeholder="Seller Name" required>';
    html += '<input name="email" type="email" placeholder="Email" required>';
    html += '<button type="submit">Add Seller</button>';
    html += "</form>";

    html += "<h2>Registered Sellers</h2><ul>";

    sellers.forEach((s) => {
        html += "<li>" + s.name + " - " + s.email + "</li>";
    });

    html += "</ul>";

    res.send(html);
});

app.post("/seller", (req, res) => {
    sellers.push({
        name: req.body.name,
        email: req.body.email
    });

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Marketplace v1 running on port 3000");
});