const fs = require("fs");

const path = require("path");

const foods = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/foods.json"), "utf8"));
const saveFoods = () => {
    fs.writeFileSync(path.join(__dirname, "../data/foods.json"), JSON.stringify(foods, null, 2), "utf8");
}

module.exports = {foods, saveFoods};
