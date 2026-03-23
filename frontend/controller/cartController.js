import Cart from "../schema/cartSchema.js";

//add to cart controller
const addToCart = async (req, res) => {
  const { items } = req.body;
  const userId = req.user._id; //taken from our auth Middleware

  try {
    //1. find the users cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      //if no cart create a new one with all the items sent
      cart = await Cart.create({
        user: userId,
        items: items.map((item) => ({
          book: item.bookId,
          quantity: item.quantity || 1,
        })),
      });
    } else {
      //if cart exists, loop through each item sent and update/add
      items.forEach((newItem) => {
        //2. check if the book is already in the cart
        const existingItemIndex = cart.items.findIndex(
          (item) => item.book.toString() === newItem.bookId,
        );

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += newItem.quantity || 1;
        } else {
          //if its new, push it to the items array
          cart.items.push({
            book: newItem.bookId,
            quantity: newItem.quantity || 1,
          });
        }
      });
      await cart.save();
    }

    //save the updated cart
    // Populate and Respond
    const populatedCart = await cart.populate(
      "items.book",
      "title finalPrice bookImage",
    );
    return res.status(200).json(populatedCart);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//retrieve the cart
const getCart = async (req, res) => {
  const userId = req.user._id; //taken from our auth Middleware

  try {
    //populate the title, final price and stock from the book model
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.book",
      "title finalPrice totalBookLeft bookImage",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ items: [], subTotal: 0 });
    }

    //calculate the total of the cart
    const subTotal = cart.items.reduce((acc, item) => {
      return acc + item.book.finalPrice * item.quantity;
    }, 0);

    //sending the data + the calculated total
    res.status(200).json({
      cartId: cart._id,
      items: cart.items,
      subTotal: Number(subTotal.toFixed(2)),
      itemCount: cart.items.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete the cart
const deleteCart = async (req, res) => {
  try {
    //1. find the users cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // putting an empty array as cart items
    cart.items = [];

    // saving the empty array
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart has been successfully deleted",
      cart: cart, // which is an empty array now.
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    //filter out the book that matches the IF from the params
    const initialCartLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    //Check if the item was removed
    if (cart.items.length === initialCartLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item removed from the cart", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update the quantity of the Book
const updateBookQuantity = async (req, res) => {
  const { bookId, quantity } = req.body;
  const user = req.user._id;

  try {
    const cart = await Cart.findOne({ user: user._id }).populate("items.book");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }

    //find the index of the book in the array
    const itemIndex = cart.items.findIndex((item) => {
        const idToCompare = item.book._id ? item.book._id.toString() : item.book.toString();
      return idToCompare === bookId;
    });

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found in cart" });
    }

    const bookData = cart.items[itemIndex].book;

    //stock check
    if (quantity > bookData.totalBookLeft) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Only${bookData.totalBookLeft} copies available in stock`,
        });
    }

    //update the quantity to the new value
    cart.items[itemIndex].quantity = quantity;

    //remove if the quantity is 0  or less
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();

    const updatedCart = await cart.populate("items.book", "title finalPrice");
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addToCart,
  getCart,
  deleteCart,
  removeItemFromCart,
  updateBookQuantity,
};
