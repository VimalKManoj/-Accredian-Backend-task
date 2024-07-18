const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/referals", async (req, res, next) => {
  try {
    const referals = await prisma.referral.findMany({});
    res.status(200).json({referals , message:'success'});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while getting the referral" });
  }
});
router.post("/referals", async (req, res, next) => {

  console.log(req.body)
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

    res.status(201).json({referral , message:'success'});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the referral" });
  }
});

module.exports = router;
