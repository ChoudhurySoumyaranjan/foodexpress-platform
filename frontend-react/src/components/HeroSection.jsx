import { useNavigate } from "react-router-dom";
import hero from "../assets/heroImage.png";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w mx-auto relative">
        {/* Hero Image */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={hero}
            alt="Food Express"
            className="w-full h-auto object-cover select-none"
          />

          {/* Delivery Card */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white rounded-2xl shadow-xl px-5 py-4 animate-bounce">
            <p className="text-sm text-gray-600 font-medium">
              🚀 Fast Delivery
            </p>

            <h3 className="text-2xl font-bold text-orange-500">20–30 Min</h3>
          </div>

          {/* Buttons */}
          <div className="absolute bottom-24 left-5 sm:bottom-32 sm:left-10 flex gap-3 sm:gap-4">
            <button
              className="rounded-xl bg-orange-500 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-orange-600"
              onClick={() => {
                navigate("/search");
              }}
            >
              Order Now
            </button>

            <button
              className="rounded-xl border-2 border-orange-500 bg-white px-6 py-3 text-orange-500 font-semibold transition hover:bg-orange-500 hover:text-white"
              onClick={() => {
                navigate("/search");
              }}
            >
              Explore Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
