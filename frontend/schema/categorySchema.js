import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },

  //if this is null then its a main category
  //if it has an ID, then it is a sub category of that ID.
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  //a short message to hover on top of the category
  toolTip: { type: String, maxLength: 60 },
});

categorySchema.pre("save", function (next) {
  if (this.parentCategory && this.parentCategory.equals(this._id)) {
    return next(new Error(" A category can not be its own parent"));
  }

  // --- 1. SLUG GENERATION ---
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") //removes any characters that is not a word or spaces inside the word.
      .split(/\s+/g) //splits where it find spaces single or multiple in between the words
      .join("-"); // join these words with underscore between the words to get.
  }
  next();
});

export default mongoose.model("Category", categorySchema);
