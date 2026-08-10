const FoodCardDetails = ({ data }) => {

  const {
    imageUrl,
    foodName,
    discount,
    categoryName,
    description,
    //discountedPrice,
    price,
    stock
  } = data;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

      <div className="grid md:grid-cols-2 gap-8 p-6">

        {/* LEFT IMAGE */}
        <div className="relative">

          <img
            src={imageUrl}
            alt={foodName}
            className="w-full h-[350px] object-cover rounded-2xl"
          />

          {/* DISCOUNT BADGE */}
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow">
            {discount}% OFF
          </div>

        </div>

        {/* RIGHT DETAILS */}
        <div className="flex flex-col justify-between">

          <div>

            {/* CATEGORY */}
            <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm font-medium">
              {categoryName}
            </span>

            {/* TITLE */}
            <h1 className="text-4xl font-bold text-gray-800 mt-4">
              {foodName}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-500 mt-4 leading-relaxed">
              {description}
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-4 mt-6">

              {/* <span className="text-4xl font-bold text-orange-500">
                ₹{discountedPrice.toFixed(2)}
              </span> */}

              <span className="text-xl line-through text-gray-400">
                ₹{price}
              </span>

            </div>

            {/* STOCK */}
            <div className="mt-4">
              {stock > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({stock} available)
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* DELIVERY */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">

              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                🚀 20-30 mins
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                ⭐ 4.5 Rating
              </div>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">

            <button
              className="
                flex-1
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
                transition
              "
            >
              Add to Cart
            </button>

            <button
              className="
                flex-1
                border-2
                border-orange-500
                text-orange-500
                hover:bg-orange-500
                hover:text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
                transition
              "
            >
              Buy Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodCardDetails;