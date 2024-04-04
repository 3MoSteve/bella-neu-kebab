const { json } = require("express");
const { contact, saveContacts } = require("../Utils/contact");
const { foods } = require("../Utils/foods");
const { orders } = require("../Utils/orders");

const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/order", (req, res) => {
    res.render("order", {foods})
})

router.get("/cart", (req, res) => {
    res.render("cart");
})

router.get("/status/:num", (req, res) => {
    let dat = orders.find(r => r.number == req.params.num);

    res.render("status", {
            data: (dat || {}),
            hideorshow: dat?true:false
    });

});

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
router.post("/contact", json(), (req, res) => {
    const {
        firstName, lastName, email, phone, message
    } = req.body;
    if (!firstName || !lastName || !email || !message) return res.status(400).send("Bitte füllen Sie die felder richtig auf!");
    if (message.length < 100 || message.length > 2000) return res.status(400).send("Ihre Nachricht muss mindestens 100 zeichen enthalten und maximal 2000 zeichen!");
    let _uid = Math.random().toString(36).slice(2) + Date.now();
    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        message: message,
        uid: _uid,
        date: replaceLastTwoDigitsWithUhr(new Date().toLocaleString("de"))
    };
    contact[_uid] = data;
    saveContacts();
    res.send("Ihre Nachricht wurde erfolgreisch an uns Versendet! Bitte haben Sie geduld bis Sie einen Antwort erhalten.");


});





router.get("/contact", (req, res) => {
    res.render("contact");
});




module.exports = router;