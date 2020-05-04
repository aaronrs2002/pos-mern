const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//purshcase model
const Purchase = require("../../models/Purchase");

//@route GET api/items
//@desc GEt All Items
//@access Public
router.get("/", (req, res) => {
  Purchase.find()
    //.sort({ timestamp: 1 })
    .then(purchases => {
      res.json(purchases);
    });
});

// @route   POST api/items
// @desc    Create An Item
// @access  Private
router.post("/", auth, (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    const item = {
      name: req.body[i].name,
      quantity: req.body[i].quantity,
      itemCost: req.body[i].itemCost,
      extras: req.body[i].extras,
      remove: req.body[i].remove,
      details: req.body[i].details,
      table: req.body[i].table,
      status: req.body[i].status,
      timestamp: req.body[i].timestamp
    };

    const newPurchase = new Purchase(item);

    newPurchase.save().then(purchases => {
      res.json(req.body);
    });
  }
});

//@route Delete api/items
//@desc Delete a post
//@access Private
/*router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      item.remove().then(() => res.json({ deleted: true }));
    })
    .catch(err => res.status(404).json({ deleted: false }));
});*/

// this is our update method
/* this method overwrites existing data in our database*/
/**/ router.put("/updateData/", (req, res) => {
  //const id = req.params.id;
  const { id, update } = req.body;
  console.log("JSON.stringify(req.body): " + JSON.stringify(req.body));
  Purchase.findByIdAndUpdate(id, req.body, { new: true }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json(data);
  });
});

module.exports = router;
