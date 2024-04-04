const { contact, saveContacts } = require("../Utils/contact");
const { orders, saveOrders } = require("../Utils/orders");

const router = require("express").Router();


router.get("/", (req, res) => {
    res.render("openadmin");
})



router.get("/dash", (req, res) => {
    if (req.query.pass != "mahmoud123") return res.redirect("/");
    res.render("admin", {
        orders: orders
    });
});

router.get("/msgs", (req, res) => {
    if (req.query.pass != "mahmoud123") return res.redirect("/");

    let msgs = Object.keys(contact).map(r => contact[r]);
    
    res.render("msgs", {
        msgs
    });
})



router.use((req, res, next) => {
    let isAdmin = req.headers.authorization;

    if (isAdmin != "mahmoud123") return res.status(403).send("Kein Zugriff!");
    req.isAdmin = true;
    next();

});


router.delete("/contact", (req, res) => {
    let {uid} = req.body;

    let _contact = contact[uid];
    if (!_contact) return res.status(400).send("Etwas stimmt nicht!");

    delete contact[uid];
    saveContacts();
    res.sendStatus(200);
    

})

router.get("/order/:id",(req, res) => {
    let order = orders.find(o => o.number == req.params.id);
    if (!order) return res.status(400).send("Keine Bestellung gefunden!");
    res.json(order);
    
})
router.post("/status/:number", (req, res) => {

    let order = orders.find(o => o.number == req.params.number);
    if (!order) return res.status(400).send("Keine Bestellung gefunden!");
    if (Number(req.body.status) > 3 || Number(req.body.status) < 0) return res.status(400).send("Ungültiger Status!");
    order.status = req.body.status;
    saveOrders();
    
    res.status(200).send("success");
});

router.post("/delete/:number", (req, res) => {
    let order = orders.find(o => o.number == req.params.number);
    if (!order) return res.status(400).send("Keine Bestellung gefunden!");
    orders.splice(orders.indexOf(order), 1);
    saveOrders();
    res.status(200).send("success");
});


module.exports = router;