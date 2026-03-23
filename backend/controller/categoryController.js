import Category from "../schema/categorySchema.js";
import slugify from "slugify";

const addCategory = async (req, res) => {
  try {
    const { name, parentCategory, description } = req.body;

    const newCategorySlug = slugify(name, { lower: true, strict: true });

    //search in Database for any category that already has this slug
    const existingCategory = await Category.findOne({ slug: newCategorySlug });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `A category with this name already Exists as ${existingCategory.name}`,
      });
    }

    //verify if the parent exists or not
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res
          .status(404)
          .json({
            success: false,
            message: "The specified Parent Category doesn't exist",
          });
      }
    }

    const newCategory = new Category({ ...req.body, slug: newCategorySlug });
    const savedCategory = await newCategory.save();
    return res.status(201).json({
      success: true,
      message: "Category Added successfully",
      savedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
    const {id} = req.params;
    const {parentCategory} = req.body;

    try {
       //
       if(parentCategory) {
        if(id === parentCategory){
             return res.status(400).json({success: false, message: 'A category can not be its own parent'});
        }

        //check if the new parent is currently the child of this category
        const subCategory = await Category.findOne({
            _id: parentCategory,
            parentCategory: id
        });

        if(subCategory){
            return res.status(400).json({
                success: false,
                message: "can not set a sub category as parent"
            })
        }
       }
       const updated = await Category.findByIdAndUpdate(id, req.body, { new: true});
       res.status(200).json({success: true, updated})
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
    
}
export { addCategory, updateCategory };
