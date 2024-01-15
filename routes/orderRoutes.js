import express from 'express';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();

orderRouter.get('/', async (req, res) => {
  const order = await Order.find();
  res.send(order);
});

orderRouter.post('/', async (req, res) => {
  const body = req.body;
  // TODO: валидация
  const newOrder = await Order.create(body);
  //   newOrder.save();

  console.log(body);
  res.json(newOrder);
});

orderRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteOrder = await Order.findByIdAndDelete(id);
    res.status(200).json(deleteOrder);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
orderRouter.put('/done', async (req, res) => {
  const orderDone = req.body;
  console.log(req.body);
  const editDoneOrder = await Order.findByIdAndUpdate(
    orderDone._id,
    orderDone,
    {
      new: true,
    }
  );
  res.json(editDoneOrder);
});
orderRouter.put('/take', async (req, res) => {
  const orderTake = req.body;
  console.log(req.body);
  const editTakeOrder = await Order.findByIdAndUpdate(
    orderTake._id,
    orderTake,
    {
      new: true,
    }
  );
  res.json(editTakeOrder);
});
export default orderRouter;
