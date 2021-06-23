const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Address } = require("../models/indexModel");
const { validateSession, validateAccess } = require("../middleware");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/register", async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    role,
    phoneNumber,
  } = req.body.user;
  try {
    let registerUser = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 13),
      role,
      phoneNumber,
    });

    let token = jwt.sign(
      { id: registerUser.id, role: registerUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    res.status(200).json({
      user: registerUser,
      token: token,
      message: "User registration success.",
    });
  } catch (err) {
    console.log(err);
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email already in use.",
      });
    } else {
      res.status(500).json({
        messagge: "Failed to register user.",
      });
    }
  }
});

router.post("/signin", async (req, res) => {
  let { email, password } = req.body.user;
  try {
    let loginUser = await User.findOne({
      where: { email },
    });
    if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
      const token = jwt.sign(
        { id: loginUser.id, role: loginUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24,
        }
      );
      res.status(200).json({
        user: loginUser,
        token: token,
        message: "User login success",
      });
    } else {
      res.status(401).json({ error: "Login Failed" });
    }
  } catch (err) {
    res.status(500).send({ error: "Error logging in" });
  }
});

router.delete("/:id", validateSession, async (req, res) => {
  try {
    const locatedUser = await User.findOne({ where: { id: req.params.id } });
    await User.destroy({ where: { id: locatedUser.id } });
    res.status(200).json({
      message: "User successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      err: err,
      message: "Unable to locate user",
    });
  }
});

// Admin routes
router.get("/admin/allusers", validateAccess, async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: [
        {
          model: Address,
        },
      ],
    });
    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({
      err: error,
      message: "Unable to locate users",
    });
  }
});

router.delete("/admin/:userId", validateAccess, async (req, res) => {
  try {
    const {userId} = req.params;
    const locatedUser = await User.findOne({where: {userId}});
    await User.destroy({where: {id: locatedUser.id}});
    res.status(200).json({message: `User #${locatedUser.id} successfully deleted!`})
  } catch (error) {
    res.status(500).json({
      err: error,
      message: "Unable to locate users",
    });
  }
})

module.exports = router;
