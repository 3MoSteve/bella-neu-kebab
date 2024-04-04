const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");



app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const routesDir = path.join(__dirname, "routes");
fs.readdirSync(routesDir).forEach(File => {
    const _path = path.join(routesDir, File);
    const name = path.parse(File).name;
    if (!File.endsWith(".js")) return;
    try {
        let _code = require(_path);
        app.use(`/${(name=="index"?"":name)}`, _code);
        console.log(`[ExpressJS] ${name} Router loaded!`);
    }catch(e) {

    console.log(`[ExpressJS] ${name} Router failed to load.`);
    console.error(e);

    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
})