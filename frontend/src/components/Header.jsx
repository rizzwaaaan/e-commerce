import React, { useRef } from 'react';
import LaserFlow from '../assets/LaserFlow'; // Assuming LaserFlow.jsx is in the same components directory
import revealImg from '../assets/images/reveal.webp';
import ASCIIText from '../assets/Asciitext'; // Assuming ASCIIText.jsx is in the same components directory
const Header = ({ onSearch }) => {
  const revealRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  return (
    <header
      className="relative h-[80vh] bg-black text-white overflow-hidden flex flex-col items-center justify-center group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* This is the background layer with the constantly visible laser effect */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#FF79C6"
        />
      </div>

      {/* This layer contains your text content, always visible and above the effects */}
      <div className="relative z-20 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Discover Your Style</h1>
        <p className="text-lg md:text-xl mb-8">Explore our curated collection of amazing products.</p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search for products..."
            onChange={onSearch}
            className="w-full max-w-lg px-6 py-3 rounded-full text-gray-900 outline-none ring-2 ring-purple-500"
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
          Shop Now
        </button>
      </div>

      {/* This is the interactive image reveal layer, shown on hover */}
      <div
        ref={revealRef}
        className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <img
          src={revealImg}
          alt="Reveal effect"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: '0',
            left: '0',
            zIndex: 5,
            mixBlendMode: 'lighten',
            pointerEvents: 'none',
          }}
        />
      </div>
    </header>
  );
};

export default Header;
