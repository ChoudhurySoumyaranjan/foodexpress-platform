import { useNavigate } from "react-router-dom";

export default function OfferBanner() {
  const navigate = useNavigate();
  const offers = [
    {
      id: 1,
      badge: "Popular",
      title: "50% OFF",
      subtitle: "On selected restaurants",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      id: 2,
      badge: "Free Delivery",
      title: "Zero Delivery Fee",
      subtitle: "On eligible orders",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: 3,
      badge: "Special Offer",
      title: "Extra Savings",
      subtitle: "On your favourite meals",
      gradient: "from-orange-600 to-amber-600",
    },
    {
      id: 4,
      badge: "Hot Deal",
      title: "Buy More Save More",
      subtitle: "Available on selected items",
      gradient: "from-slate-700 to-slate-800",
    },
    {
      id: 5,
      badge: "Limited Time",
      title: "Flash Offers",
      subtitle: "Grab them before they expire",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`
            group relative min-w-[250px] flex-shrink-0
            cursor-pointer overflow-hidden
            rounded-2xl bg-gradient-to-br ${offer.gradient}
            p-5 text-white
            shadow-lg shadow-black/10
            transition-all duration-300
            hover:scale-[1.02] hover:shadow-xl
          `}
          onClick={() => {
            navigate("/search");
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10">
            <span className="mb-3 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide backdrop-blur-sm">
              {offer.badge}
            </span>

            <h2 className="mb-1 text-2xl font-bold tracking-tight">
              {offer.title}
            </h2>

            <p className="text-sm text-white/90">{offer.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
