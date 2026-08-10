export default function RestaurantCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">
      
      <img
        src={data.image}
        alt={data.name}
        className="h-40 w-full object-cover rounded-t-xl"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{data.name}</h3>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>⭐ {data.rating}</span>
          <span>{data.time}</span>
        </div>
      </div>
    </div>
  );
}