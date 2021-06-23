const router = require("express").Router();
const { Address, User } = require("../models/indexModel");
const { validateAccess } = require("../middleware");


router.post("/newaddress", async (req, res) => {
  try {
    let requestAddress = req.body.address;

    let {
      addressName,
      address1,
      address2,
      zipcode,
      state,
      city,
    } = requestAddress;

    let locatedUser = await User.findOne({ where: { id: req.user.id } });
    let locatedAddresses = await Address.findAll({
      where: { userId: locatedUser.id },
    });  
        let matchingAddress = locatedAddresses.reduce((acc, address) => {
          // console.log("acc", acc)
          // console.log("address", address)
          // foreach key in address get the value from requestAddress
          let addressKeys = Object.keys(address.dataValues).filter(
            (key) =>
              key !== "id" &&
              key !== "createdAt" &&
              key !== "updatedAt" &&
              key !== "userId"
          );

          let numberOfMatches = addressKeys.reduce(
            (accumulator, currentValue) => {
              let count = 0;
              requestAddress[currentValue] === address[currentValue]
                ? (count = accumulator + 1)
                : (count = accumulator);

              return count;
            },
            0
          );
          console.log("numberOfMatches", numberOfMatches)
          let addressesFound = 0;
          console.log("acc", acc)
          if (numberOfMatches >= 5) {addressesFound = acc + 1} else { addressesFound = acc };
          console.log("addressesFound", addressesFound)
          return {addressesFound, address};
        }, 0);
        // console.log("matchingAddress", matchingAddress)
      if(matchingAddress > 1){
        res.status(200).json({
        message: "Address already exists for this user.",
        matchingAddress,
      })
     } else {
        let newAddress = await Address.create({
          addressName,
          address1,
          address2,
          zipcode,
          state,
          city,
          userId: locatedUser.id,
        });
        res.status(200).json({
          message: "Address successfully created!",
          address: newAddress,
        })
      }
  } catch (error) {
    res.status(500).json({
      error: "failed",
      err: error,
    });
  }
});

router.get("/address", async (req, res) => {
  try {
    let { userId } = req.user.id;
    let locatedAddress = await Address.findAll({ where: { userId } });
    res.status(200).json({
      message: `User #${userId} address successfully retrieved!`,
    });
  } catch (err) {
    res.status(500).json({
      error: "failed",
    });
  }
});

router.get("/adminaddress", validateAccess, async (req, res) => {
  try {
    let allAddresses = await Address.findAll({ include: [{ model: User }] });
    res.status(200).json({ addresses: allAddresses });
  } catch (error) {
    res.status(500).json({
      error: "failed",
    });
  }
});

module.exports = router;
