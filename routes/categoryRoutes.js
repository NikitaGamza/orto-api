import express, { query } from 'express';
import Category from '../models/categoryModel.js';

const categoryRouter = express.Router();

categoryRouter.get('/', async (req, res) => {
  const category = await Category.find();
  res.json(category);
});

categoryRouter.post('/', async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const newCategory = await Category.create(body);
    newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

categoryRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.status(200).json(deleteCategory);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export default categoryRouter;
