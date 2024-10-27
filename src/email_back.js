const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or any other service (like Outlook, Yahoo)
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-email-password',  // App-specific password or OAuth token
  },
});

app.post('/send-confirmation', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Appointment Confirmed!',
    text: `Dear ${email},\n\nYour appointment has been successfully confirmed.\n\nThank you for choosing MediMap+!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Email not sent');
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).send('Email sent successfully');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
