const Category = require('../models/category');
const shortid = require('shortid');
const slugify = require('slugify');


async function createCategories(categories, parentId = null){
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else{
    category = categories.filter((cat) => cat.parentId == parentId);
  }
  for(let cate of category){
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: await createCategories(categories, cate._id)
    });
  }
  return categoryList;
};


exports.addCategory = async(req, res) => {

  console.log(req.body);
  // return res.status(200).json({message: req.body});
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  }
  if(req.body.categoryPicture){
    categoryObj.categoryImage = req.body.categoryPicture[0];
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }
  console.log(categoryObj);
  const cat = new Category(categoryObj);
  await cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(201).json({ category });
    }
  });
}

exports.getCategory = async(req, res) => {
  await Category.find({})
  .exec(async(error, categories) => {
    if (error) return res.status(400).json({ error });
    if(categories){
      const categoryList = await createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
}

exports.updateCategories = async (req, res) => {
  const {_id, name, parentId, type} = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for(let i=0; i<name.length; i++){
      const category = {
        name: name[i],
        type: type[i]
      };
      if(parentId[i] !== ""){
        category.parentId = parentId[i];
      }
      const updateCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true});
      updatedCategories.push(updateCategory);
    }
    return res.status(201).json({updatedCategories});
  } else {
    const category = {
      name,
      type
    };
    if(parentId !== ""){
      category.parentId = parentId;
    }
    const updateCategory = await Category.findOneAndUpdate({_id}, category, {new: true});
    return res.status(201).json({updateCategory});
  }
}

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for(let i=0; i< ids.length; i++){
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deletedCategories.push(deleteCategory);
  }
  if(deletedCategories.length == ids.length){
    return res.status(201).json({message: 'Categories removed'});
  }else{
    return res.status(400).json({message: 'Something went wrong'});
  }
}
