import heroImage from '../assets/Hero.webP';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#F7F5F2]">
      {/* 1. BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: '20% center' 
        }}
      >
        <div className="absolute inset-0 bg-white/20 md:hidden"></div>
      </div>

   {/* 2. CONTENT */}
<div className="relative z-10 w-full h-full">
  <div className="max-w-[1920px] mx-auto h-full px-6 lg:px-20">
    <div className="grid grid-cols-1 md:grid-cols-12 h-full items-center">
      
      {/* Left Spacer: Model area */}
      <div className="hidden md:block md:col-span-6 lg:col-span-6"></div>

      {/* Right Side Container: 
          'items-center' (Mobile) -> 'md:items-start' (Desktop)
          'md:-translate-x-20' -> This nudges the whole block slightly left on desktop */}
      <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center md:items-center md:-translate-x-20 space-y-8 animate-slide-up">
        
        {/* TEXT SECTION - Centered relative to itself */}
        <div className="flex flex-col items-center">
          <h1 className="font-roboto font-[750] text-[#333] text-4xl sm:text-5xl lg:text-6xl leading-tight mb-2 tracking-wide uppercase text-center">
            <span className="block">HABESHA KEMIS</span>
            <span className="block">Designs</span>
          </h1>
          
          <p className="font-sans font-light text-gray-600 tracking-[0.2em] text-xs sm:text-sm uppercase mt-2">
            Elegance and Beauty for a Queen
          </p>
        </div>

        {/* SHOP NOW BUTTON - Now perfectly aligned under the centered text */}
        <button className="bg-[#D29E0E] text-white px-10 py-3.5 rounded-full text-sm font-bold tracking-[0.2em] shadow-2xl hover:bg-brand-dark hover:shadow-brand/50 hover:scale-105 transition-all duration-300">
          VIEW COLLECTION
        </button>
      </div>

    </div>
  </div>
</div>

      {/* 3. VERTICAL SCROLL LINE */}
      <div className="absolute bottom-0 right-10 md:right-20 flex flex-col items-center animate-pulse">
         <span className="text-[10px] tracking-[0.3em] uppercase text-[#D29E0E] mb-4 [writing-mode:vertical-lr]"></span>
         <div className="w-[1px] h-24 bg-gradient-to-b from-[#D29E0E] to-transparent"></div>
      </div>
    </section>
  );
}