'use client'
import Slider from "react-slick";
import { ShieldCheck, Award, Heart, Star } from "lucide-react"; // Import Lucide icons
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OurPromise: React.FC = () => {
  const promises = [
    {
      id: 1,
      title: "Integrity",
      Icon: ShieldCheck,
    },
    {
      id: 2,
      title: "Quality",
      Icon: Award,
    },
    {
      id: 3,
      title: "Relationship",
      Icon: Heart,
    },
    {
      id: 4,
      title: "Excellence",
      Icon: Star,
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="py-10 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8">
        Our Promise
      </h2>
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-4 gap-6 max-w-4xl mx-auto">
        {promises.map((promise) => (
          <div
            key={promise.id}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 flex items-center justify-center border-2 border-green-800 rounded-lg">
              <promise.Icon className="w-12 h-12 text-green-800" />
            </div>
            <p className="text-lg font-medium text-green-800 mt-4">
              {promise.title}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden">
        <Slider {...sliderSettings}>
          {promises.map((promise) => (
            <div
              key={promise.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 flex items-center justify-center border-2 border-green-800 rounded-lg mx-auto">
                <promise.Icon className="w-12 h-12 text-green-800" />
              </div>
              <p className="text-lg font-medium text-green-800 mt-4">
                {promise.title}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default OurPromise;
