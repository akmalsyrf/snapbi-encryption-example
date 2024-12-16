const express = require("express")
const app = express()
const PORT = 3000

app.get("/", (_, res) => res.send("Hello world"))
app.use((_, res) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found on this server.' });
});

const authSignature = require("./auth-signature")

app.post("/inquiry", authSignature, (req, res) => res.json(req.body))
app.post("/pay", authSignature, (req, res) => res.json(req.body))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
