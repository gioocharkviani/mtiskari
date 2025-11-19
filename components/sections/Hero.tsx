import Header from "../layout/Header";

const Hero = () => {
  return (
    <div className="w-full min-h-screen relative hero-section ">
      <div className="hero-bg-overlay absolute z-1"></div>
      <div className="absolute w-full z-2">
        <Header />
      </div>
    </div>
  );
};

export default Hero;
