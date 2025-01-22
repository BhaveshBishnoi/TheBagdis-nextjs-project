import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About The Bagdi&apos;s</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Welcome to The Bagdi&apos;s, your trusted destination for quality products and exceptional service. 
          Founded with a vision to provide our customers with the best shopping experience, we have grown 
          to become a leading name in our industry.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-6">
          Since our establishment, we have been committed to delivering excellence in every aspect of our 
          business. Our journey began with a simple idea: to create a shopping destination that combines 
          quality, affordability, and outstanding customer service.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Quality: We ensure that every product meets our high standards</li>
          <li className="mb-2">Customer First: Your satisfaction is our top priority</li>
          <li className="mb-2">Integrity: We conduct our business with honesty and transparency</li>
          <li className="mb-2">Innovation: We constantly strive to improve and evolve</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <p className="mb-6">
          At The Bagdi&apos;s, we are committed to providing you with:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">High-quality products at competitive prices</li>
          <li className="mb-2">Exceptional customer service</li>
          <li className="mb-2">Secure and convenient shopping experience</li>
          <li className="mb-2">Fast and reliable delivery</li>
        </ul>
      </div>
    </div>
  );
}
