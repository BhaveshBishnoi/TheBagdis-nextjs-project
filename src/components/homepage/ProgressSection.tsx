'use client'
import { Circle } from "lucide-react";

const ProgressSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Made from Pure A2 Gir Cow Milk",
      description:
        "The A2 Gir Cow Ghee is specifically made from the superior quality and nutritionally rich milk of the indigenous cow breed, the Gir Cow.",
    },
    {
      id: 2,
      title: "Calves Receive Their Mother's Milk First",
      description:
        "We make sure the calves receive their mother's milk in the right quantity first before using it for making Ghee.",
    },
    {
      id: 3,
      title: "Made from Wooden Churned Bilona Method",
      description:
        "The A2 Gir Cow Ghee is made from the traditional Indian Wooden Churned Bilona method using Sandalwood (Chandan wood).",
    },
    {
      id: 4,
      title: "Use of Earthen Pots at Every Step",
      description:
        "We ensure that only earthen pots are used at every stage while preparing the A2 Gir Cow Ghee to protect its nutrient values.",
    },
  ];

  return (
    <div className="w-4/5 md:w-1/2 mx-auto p-6 md:p-10">
      <div className="p-6 md:p-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8">
        What makes our A2 Gir Cow Ghee Special?
      </h1>
      <div className="relative border-l-4 border-green-400 pl-6">
        {features.map((feature, index) => (
          <div key={feature.id} className="mb-8">
            <div className="absolute -left-5 w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
              <Circle className="text-white" size={20} />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-green-800 mb-2">
              {feature.id}. {feature.title}
            </h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ProgressSection;
