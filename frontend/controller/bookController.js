import Book from "../schema/bookModel.js";

//only admin access to add book
const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      discountPercentage,
      category,
      stock,
    } = req.body;

    // Safety Check: Did they actually upload images?
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload at least one book image." });
    }

    //mapping the cloudinary image urls
    const imageUrls = req.files.map(file => file.path)

      //created a new book instance with details
    const book = new Book({
      ...req.body,
      bookImage: imageUrls,
      seller: req.user._id,
    });

    const savedBook = await book.save();
    res.status(201).json({ success: true, savedBook });
  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

//get all books by public
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("author", "name email")
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//search book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author", "fullName email shopName -_id")
    if (!book) return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update book details admin only
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

      //image uploads
      if(req.files && req.files.length > 0){
        const newImageUrls = req.files.map(file => file.path);

        req.body.bookImage = [...book.bookImage, newImageUrls];
      }

    //update book fields
    Object.assign(book, req.body);

    //save triggers the pre-save hook to recalculate prices
    const updatedBook = await book.save();

    //populating the data instead of IDS in main and category
    await updatedBook.populate([
      { path: "category.main", select: "name -_id" },
      { path: "category.subcategory", select: "name -_id" },
      { path: "author", select: "fullName -_id" },
    ]);

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//delete book details admin only
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res
      .status(200)
      .json({ success: true, message: "Book removed from the store" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addBook, getAllBooks, getBookById, updateBook, deleteBook };
