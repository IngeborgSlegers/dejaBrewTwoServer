const router = require("express").Router();
const { Address, User } = require("../models/indexModel");
const { validateAccess } = require("../middleware");

router.post("/newaddress", async (req, res) => {
  try {
    let requestAddress = req.body.address;

    let { addressName, address1, address2, zipcode, state, city } =
      requestAddress;

    let locatedUser = await User.findOne({ where: { id: req.user.id } });
    // if there is no user found?
    let locatedAddresses = await Address.findAll({
      where: { userId: locatedUser.id },
    });

    const addressMatches = (locatedAddresses) => {
      // let numberOfMatches;
      let returnData = {
        matchingProperties: 0,
        matchingAddresses: [],
      };

      for (let i = 0; i < locatedAddresses.length; i++) {
        let address = locatedAddresses[i];
        let addressKeys = Object.keys(address.dataValues).filter(
          (key) =>
            key !== "id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "userId"
        );

        for (let j = 0; j < addressKeys.length; j++) {
          if (requestAddress[j] === address[j]) {
            returnData.matchingProperties += 1;
          }
        }
        returnData.matchingAddresses.push(address);
      }
      return returnData;
    };

    let matchingAddress = addressMatches(locatedAddresses);

    if (matchingAddress.matchingProperties > 1) {
      res.status(200).json({
        message: "Address already exists for this user.",
        matchingAddresses: matchingAddress.matchingAddresses,
      });
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
      });
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
    let locatedAddresses = await Address.findAll({ where: { userId } });
    res.status(200).json({
      message: `User #${userId} address successfully retrieved!`,
      locatedAddresses
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
