import express, { query } from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 2;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    // const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteProduct = await Product.findByIdAndDelete(id);

  res.json(deleteProduct);
});

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Товар не найден' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Товар не найден' });
  }
});

productRouter.post('/addproduct', async (req, res) => {
  const body = req.body;
  // TODO: валидация
  const newProduct = await Product.create(body);
  newProduct.save();

  console.log(body);
  res.json(newProduct);
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

productRouter.post('/upload', upload.array('images'), async (req, res) => {
  // console.log(req.body);

  const names = req.body.names.split(',');

  req.files.forEach((file, index) => {
    const filePath = path.join(
      './public/images/products',
      names[index] + '.jpg'
    );
    fs.writeFileSync(filePath, file.buffer);
  });

  res.json({});
});

productRouter.put('/', async (req, res) => {
  const product = req.body;

  console.log(product);

  const editedProduct = await Product.findByIdAndUpdate(product._id, product, {
    new: true,
  });

  res.json(editedProduct);
});

productRouter.patch('/', async (req, res) => {});

export default productRouter;

/*

1. отправляем файл
2. получаем ссылку на файл
3. собираем body -> отправляем по /addproduct

*/

// Создаем транспорт для отправки электронной почты
// const transporter = nodemailer.createTransport({
//   service: 'smtp.yandex.ru', // Используем сервис Yandex
//   host: "smtp.yandex.ru",
//   secure: false, // TLS требует, чтобы secureConnection был false
//   port: 465,
//   auth: {
//     user: 'noreply@fotrum.com',
//     pass: ''
//   }
// });

// const info = await transporter.sendMail({
//   from: '"Fred Foo 👻" <foo@example.com>', // sender address
//   to: "bar@example.com, baz@example.com", // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// })

// const storage = multer.diskStorage({
//   destination: './public/images/products',
//   filename: function (req, file, cb) {
//     console.log(req.body.names);
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

//new tree
