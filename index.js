const express = require("express")
const app = express()
const PORT = 3000

app.use(express.json())

app.get("/", (_, res) => res.send("Hello world"))

const accessToken = require("./access-token")
const authSignature = require("./auth-signature")

app.post("/snap/access-token", accessToken)
// TODO: return real data from your database
app.post("/snap/transfer-va/inquiry", authSignature, (req, res) => res.json(req.body))
// TODO: return real data from your database
app.post("/snap/transfer-va/payment", authSignature, (req, res) => res.json(req.body))
app.use((_, res) => res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.'
}))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
