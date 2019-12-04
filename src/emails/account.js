const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ssubedi1@go.olemiss.edu",
        subject: "Thanks for joining us",
        text: `Welcome to the app ${name}. Let me know how to get along with the app`
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ssubedi1@go.olemiss.edu",
        subject: "Cancellation email",
        text: `Goodbye ${name}. Let us know if there is anyway we could have improved our app`
    });
};

module.exports = {
    sendEmail: sendWelcomeEmail,
    cancelEmail: sendCancelEmail
};