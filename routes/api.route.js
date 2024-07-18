const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const prisma = new PrismaClient();

router.get("/referals", async (req, res, next) => {
  try {
    const referals = await prisma.referral.findMany({});
    res.status(200).json({ referals, message: "success" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while getting the referral" });
  }
});
router.post("/referals", async (req, res, next) => {
  console.log(req.body);
  const {
    referrerName,
    referrerEmail,
    refereeName,
    refereeEmail,
    courseName,
    message,
  } = req.body;

  if (
    !referrerName ||
    !referrerEmail ||
    !refereeName ||
    !refereeEmail ||
    !courseName
  ) {
    return res.status(400).send("All fields except message are required");
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseName,
        message,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "email@gmail.com", pass: "password" },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: refereeEmail,
      subject: "You have been referred to a course!",
      text: `Hi ${refereeName},\n\n${referrerName} has referred you to the course: ${courseName}.\n\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(201).json({ referral, message: "success" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the referral" });
  }
});

module.exports = router;
