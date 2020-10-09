const router = require("express").Router();

const { Tea } = require("../models/indexModel");

/************************************
 * CREATE -- TEA INFO - deprecated *
 ************************************/
router.post("/", (req, res) => {
  if (!req.errors) {
    const teaFromRequest = {
      teaName: req.body.teaName,
      teaType: req.body.teaType,
      teaDescription: req.body.teaDescription,
      temp: req.body.temp,
      steepTime: req.body.steepTime,
      teaPrice: req.body.teaPrice,
    };
    Tea.create(teaFromRequest)
      .then((tea) => res.status(200).json(tea))
      .catch((err) => res.json(req.errors));
  } else {
    res.status(500).json(req.errors);
  }
});

/***********************
 * CREATE -- TEA INFO *
 ***********************/
router.post("/new", async (req, res) => {
  try {
    const { name, type, description, temp, steepTime, price } = req.body.tea;
    let newTea = await Tea.create({
      name,
      type,
      description,
      temp,
      steepTime,
      price,
    });
    res.json({
      message: "Tea Created",
      tea: newTea,
    });
  } catch (err) {
    res.status(500).json({
      error: "failed",
    });
  }
});

/***********************
 * READ -- TEA INFO *
 ***********************/

router.get("/", (req, res) => {
  Tea.findAll()
    .then((tea) => res.status(200).json(tea))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:teaType", (req, res) => {
  Tea.findAll({ where: { teaType: req.params.teaType } })
    .then((tea) => res.status(200).json(tea))
    .catch((err) => res.status(500).json({ error: err }));
});

/***********************
 * UPDATE -- TEA INFO *
 ***********************/
router.put("/:id", (req, res) => {
  if (!req.errors) {
    Tea.update(req.body, { where: { id: req.params.id } })
      .then((tea) => res.status(200).json(tea))
      .catch((err) => res.json(req.errors));
  } else {
    res.status(500).json(req.errors);
  }
});

/***********************
 * DELETE -- TEA INFO *
 ***********************/
router.delete("/:id", (req, res) => {
  Tea.destroy({ where: { id: req.params.id } })
    .then((tea) => res.status(200).json(tea))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
