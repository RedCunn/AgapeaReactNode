const nodemailer = require('nodemailer');

const mail = {
    user: 'codeveloper@outlook.es',
    password: '3Preciosososo$'
}

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    tls: {
        rejectUnauthorized: false
    },
    secure: false,
    auth: {
        user: mail.user,
        pass: mail.password
    }
});

const sendEmail = async (email, subject, html) => {
    try {
        await transporter.sendMail({
            from: `Suunc CoDeveloper 👻" <${mail.user}>`, // sender address
            to: email, // list of receivers
            subject: `${subject}`, // Subject line
            text: "Estás a un solo paso del éxito.", // plain text body
            html, // html body
        });
    } catch (error) {
        console.log('Algo no fue bien en el envío del correo de confirmación: ', error);
    }
};


const getTemplate = (nombre, token) => {
    return `
    <head>
    </head>
    <div id="email_content">
    <img src="../public/img/agapeaemail.png" alt="">
    <h2>Bienvenida ${nombre} , ávida lectora: </h2>
    <p>estás a un paso de formar parte de la librería virtual Agapea.</p>
    <p>Sigue el siguiente link para activar tu cuenta: </p>
    <a href="http://localhost:3002/api/Cliente/confirm/${token}">Activar cuenta</a>
    </div>
    `
}

module.exports = {
    sendEmail,
    getTemplate
}