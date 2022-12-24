const Product = require('../models/product');
const shortId = require('shortid');
const slugify = require('slugify');
const Category = require('../models/category');

exports.createProduct = async(req, res) => {

  console.log(req.body);
  // return;

  const {
    name, price, description, category, quantity, productPicture
  } = req.body;
  console.log(productPicture);

  let productPictures = [];
  if (productPicture.length > 0) {
    productPictures = await productPicture.map((pic) => {
      console.log(pic);
      return { img: pic };
    })
  }
  console.log(productPictures);

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id
  });

  await product.save(((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  }));
};

exports.getProductsBySlug = async(req, res) => {
  const { slug } = req.params;
  await Category.findOne({ slug: slug })
    .select('_id type')
    .exec(async(error, category) => {
      if (error) {
        return res.status(400).json({ error })
      }
      if (category) {
        await Product.find({ category: category._id })
          .exec((error, products) => {

            if (error) {
              return res.status(400).json({ error })
            }
            if(category.type){
              if (products.length > 0) {
                res.status(200).json({
                  products,
                  priceRange: {
                    under5k: 5000,
                    under10k: 10000,
                    under15k: 15000,
                    under20k: 20000,
                    under30k: 30000,
                  },
                  productsByPrice: {
                    under5k: products.filter(product => product.price <= 5000),
                    under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
                    under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
                    under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
                    under30k: products.filter(product => product.price > 20000 && product.price <= 30000),

                  }
                });
              }else{
                res.status(200).json({ products });
              }
            }
          });
      }
    });
};

exports.getProductDetailsById = async(req, res) => {
  const { productId } = req.params;
  if(productId){
    await Product.findOne({ _id: productId })
    .exec((error, product) => {
      if(error) return res.status(400).json({ error });
      if(product){
        res.status(200).json({ product });
      }
    })
  }else{
    return res.status(400).json({ error: 'Params required' });
  }
}

// new update
exports.deleteProductById = async(req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    await Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};