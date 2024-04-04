const fs = require("fs");

const path = require("path");

const orders = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/orders.json"), "utf8"));
const saveOrders = () => {
    fs.writeFileSync(path.join(__dirname, "../data/orders.json"), JSON.stringify(orders, null, 2), "utf8");
}

module.exports = {orders, saveOrders};
