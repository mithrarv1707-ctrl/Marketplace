const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

const sellers = [];
const products = [];

let nextProductId = 1;

app.get("/", (req, res) => {
    let html = `
    <html>
    <head>
        <title>Marketplace v3</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 30px; background: #f4f6f9; }
            h1 { color: #243b64; }
            section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            input, select, button { padding: 10px; margin: 5px; }
            button { cursor: pointer; }
            li { margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>Marketplace Application - v3</h1>
        <p>Advanced Marketplace with Product Search and Categories</p>

        <section>
            <h2>Add Seller</h2>
            <form method="POST" action="/seller">
                <input name="name" placeholder="Seller Name" required>
                <input name="email" type="email" placeholder="Email" required>
                <button type="submit">Add Seller</button>
            </form>

            <h3>Registered Sellers</h3>
            <ul>
                ${sellers.map(s => `<li>${escapeHtml(s.name)} - ${escapeHtml(s.email)}</li>`).join("")}
            </ul>
        </section>

        <section>
            <h2>Add Product</h2>
            <form method="POST" action="/product">
                <input name="name" placeholder="Product Name" required>
                <input name="price" type="number" min="0.01" step="0.01" placeholder="Price" required>
                <select name="category" required>
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit">Add Product</button>
            </form>
        </section>

        <section>
            <h2>Search Products</h2>
            <form method="GET" action="/">
                <input name="search" placeholder="Search by product name"
                       value="${escapeHtml(String(req.query.search || ""))}">
                <select name="category">
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit">Search</button>
                <a href="/">Clear</a>
            </form>
        </section>

        <section>
            <h2>Available Products</h2>
            <ul id="products">
    `;

    const search = String(req.query.search || "").toLowerCase();
    const category = String(req.query.category || "");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search) &&
        (!category || product.category === category)
    );

    if (filteredProducts.length === 0) {
        html += "<li>No matching products found.</li>";
    } else {
        filteredProducts.forEach(product => {
            html += `
                <li>
                    <strong>${escapeHtml(product.name)}</strong>
                    — Rs. ${product.price.toFixed(2)}
                    — Category: ${escapeHtml(product.category)}
                    <form method="POST" action="/product/${product.id}" style="display:inline">
                        <button type="submit">Delete</button>
                    </form>
                </li>
            `;
        });
    }

    html += `
            </ul>
            <p>Total products: ${filteredProducts.length}</p>
        </section>
    </body>
    </html>
    `;

    res.send(html);
});

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

app.post("/seller", (req, res) => {
    sellers.push({
        name: req.body.name,
        email: req.body.email
    });

    res.redirect("/");
});

app.post("/product", (req, res) => {
    const name = String(req.body.name || "").trim();
    const price = Number(req.body.price);
    const allowedCategories = ["Electronics", "Clothing", "Books", "Home", "Other"];
    const category = req.body.category;

    if (!name || !Number.isFinite(price) || price <= 0 ||
        !allowedCategories.includes(category)) {
        return res.status(400).send("Please enter valid product details.");
    }

    products.push({
        id: nextProductId++,
        name,
        price,
        category
    });

    res.redirect("/");
});

app.post("/product/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return res.status(404).send("Product not found.");
    }

    products.splice(index, 1);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Marketplace v3 running on port 3000");
});