import React from "react";
import CategorySlider from "../components/CategorySlider";
import OfferBanner from "../components/OfferBanner";
import RestaurantList from "../components/RestaurantList";
import HeroSection from "../components/HeroSection";
import FoodList from "../components/FoodList";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  return (
    <>
      <HeroSection />

      {/*  Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <SearchBar />
        {/*  Category Slider */}
        <CategorySlider />

        {/* Offers */}
        <OfferBanner />

        {/* { Food List} */}
        <FoodList />

        {/* Restaurants */}
        {/* <RestaurantList /> */}
      </div>
    </>
  );
};

export default HomePage;
