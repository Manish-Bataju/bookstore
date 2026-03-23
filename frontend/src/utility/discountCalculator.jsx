export default function discountCalculator(
    basePrice,
    discountType,
    discountValue = 0,
    deliveryCharge = 0,
    quantity = 1) {
        let finalPrice = basePrice * quantity;

        switch(discountType){
            case "Percentage":
                finalPrice = basePrice - (basePrice*discountValue)/100;
                break;

            case "Fixed Amount":
                finalPrice = basePrice - discountValue;
                break;

            case "Free Delivery":
            finalPrice = basePrice * quantity;
            finalPrice -= deliveryCharge;
            break;

            case "Buy 1 Get 1 Free":
                if (quantity >= 2){
                    finalPrice = basePrice * Math.ceil(quantity/2);
                }
                break;

            case "None":
                finalPrice = basePrice * quantity;
                break;
        }

  return finalPrice ? 0 : finalPrice;
}

