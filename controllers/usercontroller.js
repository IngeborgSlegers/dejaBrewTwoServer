const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/indexModel");
const {
  validateSession,
  validateAccess,
} = require("../middleware");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/register", async (req, res) => {
  let { firstName, lastName, email, password, role } = req.body.user;
  try {
    let registerUser = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 13),
      role,
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
    console.log(err)
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
    if (loginUser && await bcrypt.compare(password, loginUser.password)) {
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

router.delete("/:id", validateSession, validateAccess, (req, res) => {
  console.log("delete request", req);
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      User.destroy({ where: { id: user.id } }).then((deleteSuccess) => {
        res.status(200).json({
          deleteSuccess: deleteSuccess,
          message: `User ${user.firstName} ${user.lastName} successfully deleted`,
        });
      });
      // .catch((err) => {
      //   res.status(500).json({
      //     err: err,
      //     message: "Unable to delete user",
      //   });
      // })
    })
    .catch((err) =>
      res.status(500).json({
        err: err,
        message: "Unable to locate user",
      })
    );
});

module.exports = router;
