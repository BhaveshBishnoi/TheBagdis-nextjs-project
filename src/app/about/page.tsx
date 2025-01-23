import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About TBOF (The Bagdi&apos;s Organic Farm)</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Farm</h2>
          <p className="text-lg mb-6">
            Our products are handcrafted daily in small batches by farmers&apos; skilled hands in our farm kitchen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Process</h2>
          <p className="mb-6">
            We follow traditional Vedic methods of ghee preparation, carefully selecting the finest milk and using 
            slow-cooking techniques to preserve all natural nutrients. Each batch is crafted with attention to detail 
            and undergoes strict quality control measures.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Meet Our Founders</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium">Deepak Rokna</h3>
              <p>
                As a doctor, my mission is to provide consumers with access to quality food in this era of rising 
                health issues while empowering farmers to thrive.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">Robin Devrath</h3>
              <p>
                Coming from a farming family, I understand the challenges farmers face. Reducing their dependence 
                on private companies will create more value for them, ultimately leading to healthier and traceable 
                food for consumers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">Lalchand Jyani</h3>
              <p>
                My aim is to reconnect modern consumers with traditional food through full-time farming and an 
                organic lifestyle.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2">Quality Commitment</li>
            <li className="mb-2">100% Pure and Natural</li>
            <li className="mb-2">No Preservatives Added</li>
            <li className="mb-2">Lab Tested for Purity</li>
            <li className="mb-2">Traditional Production Methods</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
