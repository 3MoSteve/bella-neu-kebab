const { foods } = require("../Utils/foods");
const { orders, saveOrders } = require("../Utils/orders");

const router = require("express").Router();

router.get("/:id", (req, res) => {
    let id= req.params.id;

    if (!id) return res.redirect("/");
    let _food = foods.find(d => d.id == id);
    if (!_food) return res.redirect("/");
    res.json(_food);
});
let genNumber = () => {
    let str = "";
    for (let i = 0; i < 10; i++) {
        str += Math.floor(Math.random() * 9)+1;
    }
    return str;

}
function replaceLastTwoDigitsWithUhr(str) {
    // Überprüfe, ob der String mindestens zwei Zeichen lang ist
    if (str.length >= 2) {
        // Extrahiere die letzten beiden Zeichen
        const lastTwoDigits = str.slice(-2);
        // Überprüfe, ob die letzten beiden Zeichen Zahlen sind
        if (!isNaN(lastTwoDigits)) {
            // Ersetze die letzten beiden Zeichen durch "Uhr"
            return str.slice(0, -2) + "Uhr";
        }
    }
    // Gib den ursprünglichen String zurück, wenn keine Änderung vorgenommen wurde
    return str;
}

router.post("/order", (req, res) => {
    const data = {order: req.body.order, user: req.body.user};
    let _number = genNumber();
    data.number = _number;
    data.status = 0;
    data.date = replaceLastTwoDigitsWithUhr(new Date().toLocaleString("de"));
    
    orders.push(data);
    saveOrders();

    res.status(200).send({number: _number})
});

router.get("/:number/delete", (req, res) => {
    let num = req.params.number;
    let ord = orders.find(r =>r.number == num);
    if (ord == null) return res.redirect("/");
    let index = orders.findIndex(r => r.number == num);
    orders.splice(index, 1);
    saveOrders();
    res.redirect("/");
})
module.exports = router;