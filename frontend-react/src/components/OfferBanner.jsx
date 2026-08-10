export default function OfferBanner() {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="min-w-[250px] bg-orange-400 text-white p-5 rounded-xl shadow"
        >
          <h2 className="text-lg font-bold">50% OFF</h2>
          <p>On selected restaurants</p>
        </div>
      ))}
    </div>
  );
}