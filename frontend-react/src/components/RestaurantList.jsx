import RestaurantCard from "./RestaurantCard";

export default function RestaurantList() {
  const restaurants = [
    {
      id: 1,
      name: "Pizza Hut",
      image: "https://via.placeholder.com/300",
      rating: 4.2,
      time: "30 mins",
    },
    {
      id: 2,
      name: "Burger King",
      image: "https://via.placeholder.com/300",
      rating: 4.0,
      time: "25 mins",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Restaurants near you
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((res) => (
          <RestaurantCard key={res.id} data={res} />
        ))}
      </div>
    </div>
  );
}