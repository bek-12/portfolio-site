import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Systems from '../components/sections/Systems';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';

export default function Home() {
  const [preselectedSystem, setPreselectedSystem] = useState('');

  const handleRequestDemo = (systemName) => {
    setPreselectedSystem(systemName);
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#020817]">
      <Navbar />
      <main>
        <Hero />
        <Systems onRequestDemo={handleRequestDemo} />
        <About />
        <Contact preselectedSystem={preselectedSystem} />
      </main>
      <Footer />
    </div>
  );
}
