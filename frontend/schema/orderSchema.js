import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // 1. WHO bought it?
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 

  shopName: {type:String},
  shopPanNumber: {type: String},

  // 2. WHAT did they buy?
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
      quantity: { type: Number, required: true, min: 1 },
      priceAtPurchase: { type: Number, required: true }, // Important! Prices change, but the receipt shouldn't.
    }
  ],

   paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Refunded"],
    default: "Unpaid"
  },

  paymentMethod:{
    type:String,
    enum:['E-Sewa', 'IME-Khalti','COD'],
    required: true,
  },

  // 3. FINANCIAL
  subTotal: { type: Number },
  vatAmount: {type: Number},
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number},

  // 4. LOGISTICS
  shippingAddress: {
    street: {type: String, required:true},
    city: {type: String, required:true},
    postCode: {type: String, required:true},
    landMark: {type: String, required:true}
  },

  // 5. STATUS TRACKING
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },

  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

//Middleware for calculations
orderSchema.pre('save', function(){
  //calculate subtotal of the items array so even if the no is greater than 1
  this.subTotal = this.items.reduce((acc, item)=> (acc+ (item.priceAtPurchase*item.quantity)), 0)

  const rawVat = this.subTotal * 0.13;
  this.vatAmount =  Math.round((rawVat + Number.EPSILON) * 100)/100;
  // calculating final total amount with subtotal and the shipping fee..
  //staying on the safe side adding a default value of 0
 this.totalAmount = this.subTotal + this.vatAmount + (this.shippingFee || 0);
})
export default mongoose.model("Order", orderSchema);