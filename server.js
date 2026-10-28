const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

const sellers = [];
const products = [];

app.get("/", (req, res) => {
let html = "<h1>Marketplace Application - v3</h1>";

```
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

html += "</ul><hr>";

html += "<h2>Add Product</h2>";
html += '<form method="POST" action="/product">';
html += '<input name="name" placeholder="Product Name" required>';
html += '<input name="price" type="number" min="0.01" step="0.01" placeholder="Price" required>';
html += '<button type="submit">Add Product</button>';
html += "</form>";

html += "<hr><h2>All Products</h2><ul>";

products.forEach((p) => {
    html += "<li>" + p.name + " - Rs. " + p.price + "</li>";
});

html += "</ul>";

res.send(html);
```

});

app.post("/seller", (req, res) => {
sellers.push({
name: req.body.name,
email: req.body.email
});

```
res.redirect("/");
```

});

app.post("/product", (req, res) => {
const price = Number(req.body.price);

```
if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).send("Please enter a valid price.");
}

products.push({
    name: req.body.name,
    price: price
});

res.redirect("/");
```

});

app.listen(3000, () => {
console.log("Marketplace v3 running at http://localhost:3000");
});
