const express = require('express')
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require('cors');
const router = express.Router();
const app = express()

require('dotenv').config()

let port = process.env.PORT || 3000

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

router.get("/", async (req, res) => {
    return res.status(200).json({
        status: true,
        code: 200,
        message: `Email sender service`
    })
});

router.post("/", async (req, res) => {
    const {
        email_to, name_to = "Sobat Pengen Bisa", 
        subject = "Pengen Bisa", 
        message = "Hai"
    } = req.body

    if(!email_to) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: "\'email_to\' is not exist!"
        })
    }

    let mailertogo_user = process.env.MAILERTOGO_SMTP_USER;
    let mailertogo_password = process.env.MAILERTOGO_SMTP_PASSWORD;

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: mailertogo_user,
            pass: mailertogo_password
        }
    });

    let from = `"Pengen Bisa" <noreply@pengenbisa.com>`;
    let to = `"${name_to}" <${email_to}`;

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        html: message
    });

    return res.status(200).json({
        status: true,
        code: 200,
        message: `Message send: ${info.messageId}`
    })
});

app.use("/", router);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})