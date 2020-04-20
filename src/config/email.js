module.exports = {
    host: process.env.EMAIL_HOST,
    secure: false,
    port: process.env.EMAIL_PORT,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSW
    }
}