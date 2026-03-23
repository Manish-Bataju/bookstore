import Order from "../schema/orderSchema.js";
import Book from "../schema/bookModel.js";
import User from "../schema/userModel.js";

//1. create the order
export const createOrder = async (req, res) => {
  //1. this is about the choices user selected and entered
  const { items, shippingAddress, paymentMethod, shippingFee } = req.body;

  //from our AuthMiddleware - who is logged in
  const userId = req.user._id;

  //quick check if the cart is empty or not??
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No Items in your cart" });
  }

  try {
    const storeDetails = await User.findOne({ role: admin });

    if (!storeDetails)
      return res
        .status(404)
        .json({
          success: false,
          message: "Store not found, can not process the order",
        });

    //Map Items with real prices from the DB
    const itemsWithRealPrices = await Promise.all(
      items.map(async (item) => {
        const book = await Book.findById(item.book);

        if (!book)
          return res
            .status(404)
            .json({ success: false, message: "Book not Found" });

        return {
          book: book._id,
          quantity: item.quantity,
          priceAtPurchase: book.price, //use the DB Price
        };
      }),
    );

    //create the order with seller Snapshots
    const order = new Order({
      user: userId, // set by our login middleware
      seller: storeDetails._id,
      shopNameSnapshot: storeDetails.shopName,
      shopPanNumber: storeDetails.panNumber,
      items: itemsWithRealPrices,
      shippingAddress,
      paymentMethod,
      shippingFee,
    });

    // 4. wait for the database to finish calculations and save

    const savedOrder = await order.save();

    
    // update the book from latest batch.
    for (const item of savedOrder.items){
      const book = await Book.findById(item.book)

    if(book && book.stockHistory.length > 0){
      // deduct from the first Batch
      book.stockHistory[0].currentStock -= item.quantity;

      //the array changed
      book.markModified('stockHistory');
      await book.save();
    }}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//2.  get all orders for the logged in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//3. get details for one specific Order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("User", "name email")
      .populate("items.book", "title author bookImage");

    if (!order) return res.status(404).json({ message: "order not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "fullName email mobileNo totalAmount -_id") //find who bought it
      .sort("-createdAt"); //newest order first

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const status = req.body; //

    //validate the status
    const validStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
