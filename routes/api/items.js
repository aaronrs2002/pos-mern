const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//item model
const Item = require("../../models/Items");

//@route GET api/items
//@desc GEt All Items
//@access Public
router.get("/", (req, res) => {
  Item.find()
    .sort({ name: 1 })
    .then(items => {
      res.json(items);
    });
});

// @route   POST api/items
// @desc    Create An Item
// @access  Private
router.post("/", auth, (req, res) => {
  const newItem = new Item({
    id: req.body.id,
    category: req.body.category,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    modifyOption: req.body.modifyOption,
    canModify: req.body.canModify
  });

  newItem.save().then(item => res.json(item));
});

//@route Delete api/items
//@desc Delete a post
//@access Private
router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      item.remove().then(() => res.json({ deleted: true }));
    })
    .catch(err => res.status(404).json({ deleted: false }));
});

// this is our update method
/* this method overwrites existing data in our database*/
router.put("/updateData/", (req, res) => {
  //const id = req.params.id;
  const { id, update } = req.body;
  Item.findByIdAndUpdate(id, req.body, { new: true }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json(data);
  });
});

module.exports = router;
