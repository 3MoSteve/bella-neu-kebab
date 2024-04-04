const fs = require("fs");

const path = require("path");

const contact = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/contact.json"), "utf8"));
const saveContacts = () => {
    fs.writeFileSync(path.join(__dirname, "../data/contact.json"), JSON.stringify(contact, null, 2), "utf8");
}

module.exports = {contact, saveContacts};
