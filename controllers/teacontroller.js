const router = require("express").Router();

const { Tea } = require("../models/indexModel");

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
router.get("/", async (req, res) => {
  try {
    const teas = await Tea.findAll();
    if (teas) {
      res.status(200).json({
        data: teas,
        message: "Data retrieval success.",
      });
    } else {
      res.status(404).json({
        message: "No data available.",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve data.",
    });
  }
});

/************************************************
 * READ, UPDATE, and DELETE by :id -- TEA INFO *
 ***********************************************/
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const teaId = req.params.id;
      const locatedTea = await Tea.findOne({
        where: {
          id: teaId,
        },
      });
      if (locatedTea) {
        res.status(200).json({
          data: locatedTea.toJSON(),
        });
      } else {
        res.status(404).json({
          message: "Tea not found.",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: "Failed to interact with teas.",
      });
    }
  })
  .put(async (req, res) => {
    try {
      const { tea } = req.body;
      const toUpdate = await Tea.findOne({
        where: {
          id: req.params.id,
        },
      });
      console.log("toUpdate Tea", toUpdate.name);
      console.log("tea", tea);
      if (tea && toUpdate) {
        // toUpdate = tea;
        await toUpdate.save(tea);
        res.status(200).json({
          message: "Successfully update tea",
        });
      } else {
        res.status(404).json({
          message:
            "Tea object missing, tea not found, or user unauthorized to edit.",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: `Failed to interact with tea ${req.params.id}`,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const toRemove = await Tea.findOne({
        where: {
          id: req.params.id,
        },
      });
      toRemove
        ? toRemove.destroy()
        : res.status(404).json({
            message: "Tea not found.",
          });
      res.status(200).json({
        message: `Successfully deleted tea ${req.params.id}`,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to interact with Tea List",
      });
    }
  });

/************************************
 * UPDATE -- TEA INFO - deprecated *
 ***********************************/
router.put("/:id", (req, res) => {
  if (!req.errors) {
    Tea.update(req.body, { where: { id: req.params.id } })
      .then((tea) => res.status(200).json(tea))
      .catch((err) => res.json(req.errors));
  } else {
    res.status(500).json(req.errors);
  }
});

/************************************
 * DELETE -- TEA INFO - deprecated *
 ***********************************/
router.delete("/:id", (req, res) => {
  Tea.destroy({ where: { id: req.params.id } })
    .then((tea) => res.status(200).json(tea))
    .catch((err) => res.status(500).json({ error: err }));
});

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

/*********************************
 * READ -- TEA INFO - deprecated*
 ********************************/

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

module.exports = router;
