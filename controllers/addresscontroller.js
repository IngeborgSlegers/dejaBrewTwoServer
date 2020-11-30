const router = require("express").Router();
const { Address, User } = require("../models/indexModel");

router.post("/newaddress", async (req, res) => {
  try {
    let { addressName, address1, address2, zipcode, state } = req.body.address;

    let locatedUser = await User.findOne({ where: { id: req.user.id } });
    let newAddress = await Address.create({
      addressName,
      address1,
      address2,
      zipcode,
      state,
      userId: locatedUser.id,
    });
    res.status(200).json({
      message: 'Address successfully created!',
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({
      error: "failed",
    });
  }
});

module.exports = router;