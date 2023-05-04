// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendEmail = async (name, link) => {
//   const { EMAIL, PASS } = process.env;

//   const config = {
//     service: "gmail",
//     auth: {
//       user: EMAIL,
//       pass: PASS,
//     },
//     tls: { rejectUnauthorized: false },
//   };
//   const transporter = nodemailer.createTransport(config);

//   const message = {
//     from: EMAIL,
//     to: name,
//     subject: "Verification from the best API in the world :) ",
//     html: ` <div>
//       <h1>Hi,${name}</h1>
//       <p>click the button below to verify</p>
//       <a href="${link}"><button>Veryfy</button></a><br>
//       <a href="${link}">${link}</a>
//     </div>`,
//   };
//   await transporter.sendMail(message);
// };
// module.exports = sendEmail;
