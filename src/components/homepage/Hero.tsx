'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const HeroSection = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e:any) => {
      const image = imageRef.current;
      if (!image) return;

      const { clientX: mouseX, clientY: mouseY } = e;
      const { left, top, width, height } = image.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const rotateX = (mouseY - centerY) / 25;
      const rotateY = (centerX - mouseX) / 25;

      image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-b from-yellow-50 via-white to-yellow-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Pure & Traditional</span>
              <span className="block text-yellow-600">Desi Ghee</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Experience the authentic taste of traditionally made ghee, crafted with care using time-honored methods passed down through generations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
              >
                Shop Now
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Image with animations */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
            <div
              ref={imageRef}
              className="relative w-full h-full transition-transform duration-500 ease-out"
            >
              <div className="absolute inset-0 animate-float hover-scale">
                <Image
                  src="/hero-ghee.png"
                  alt="Pure Desi Ghee"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={100}
                  priority
                />
              </div>
              {/* Decorative circles */}
              <div className="absolute top-1/4 -left-4 w-32 md:w-48 h-32 md:h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-scale"></div>
              <div className="absolute bottom-1/4 -right-4 w-32 md:w-48 h-32 md:h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-scale delay-1000"></div>
              {/* Additional Sparkle Effect */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full filter blur-lg animate-pulse opacity-90 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
