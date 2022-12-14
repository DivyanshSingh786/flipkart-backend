const Page = require('../../models/page');

exports.createPage = async(req, res) => {
  console.log(req.body);
  const { banners, products } = req.body;
  // return;
  if (banners.length > 0) {
    req.body.banners = banners.map((banner, index) => ({
      img: banner,
      navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
    }));
  }
  if (products.length > 0) {
    req.body.products = products.map((product, index) => ({
      img: product,
      navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`
    }));
  }

  req.body.createdBy = req.user._id;

  await Page.findOne({ category: req.body.category })
    .exec(async(error, page) => {
      if (error) return res.status(400).json({ error });
      if (page) {
        await Page.findOneAndUpdate({ category: req.body.category }, req.body)
          .exec((error, updatePage) => {
            if (error) return res.status(400).json({ error });
            if (updatePage) {
              return res.status(201).json({ page: updatedPage });
            }
          })
      } else {
        const page = new Page(req.body);

        await page.save((error, page) => {
          if (error) return res.status(400).json({ error });
          if (page) {
            return res.status(201).json({ page });
          }
        });
      }
    })
}

exports.getPage = async(req, res) => {
  const { category, type } = req.params;
  if(type === "page"){
    await Page.findOne({ category: category })
    .exec((error, page) => {
      if(error) return res.status(400).json({error});
      if(page) return res.status(200).json({page});
    })
  }
}