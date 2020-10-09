const router = require('express').Router();
const {Order, Tea} = require('../models/indexModel');


/* CREATE -- TEA ORDER */

router.post('/addtocart/:id', (req, res) => {
  Tea.findOne({where: {id: req.params.id}})
    .then(tea => {
      // console.log(req.user.firstName)
      Order.create({      
        quantity: req.body.order.quantity,
        userId: req.user.id,
        // userFirst: req.user.firstName,
        // userLast: req.user.lastName,
        teaId: tea.id})
      })
    .then(order => res.status(200).json({teaOrder: order, message: 'tea order created!'}))
    .catch(err => res.status(500).json({error: err.message}))
})

/* READ -- TEA ORDER */

router.get('/order/:id', (req, res)=> {
  Order.findOne({where: {id: req.params.id, userId: req.user.id}})
    .then(order => res.status(200).json(order))
    .catch(err => res.status(500).json({ error: err }))
})

router.get('/orders', (req, res) => {
  Order.findAll({ where: { userId : req.user.id }})
    .then(order => res.status(200).json(order))
    .catch(err => res.status(500).json({error: err}))
})


/* UPDATE -- TEA INFO */

router.put('/editcart/:id', (req, res) => {
  if (!req.errors) {
    Order.update(req.body.order, { where: { id: req.params.id, userId: req.user.id }})
    .then(order => res.status(200).json(order))
    .catch(err => res.status(500).json({error: err}))
  } else {
    res.status(500).json({error: err})
  }
})


/* DELETE -- TEA ORDER */

router.delete('/deletecart/:id', (req, res) => {
  Order.destroy({ where: {id: req.params.id, userId: req.user.id }})
    .then(order => res.status(200).json(order))
    .catch(err => res.status(500).json({ error: err}))
})

module.exports = router;