import nodemailer from "nodemailer";

const sendEmail = async function(email,subject,message){
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.PORT,
        secure: false, // true for 465 and false for other ports
        auth:{
            user:process.env.SMTP_USERNAME,
            pass:process.env.SMTP_PASSWORD
        },
    })
// send email with defined transport object

await transporter.sendMail({
    from:process.env.SMTP_FROM_EMAIL,//sender email
    to: email,
    subject: subject,
    html: message
})

}
export default sendEmail;