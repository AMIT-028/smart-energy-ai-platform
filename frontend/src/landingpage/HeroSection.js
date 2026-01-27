import image from '../utils/image.png';
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6">
            <h1 className="hero-title display-4">
              Smarter Energy.<br />
              Powered by AI.
            </h1>
            <p className="hero-text lead">
              Smarter Energy AI wt sh-aveqp deid-to swork more energy solutions, amtint ooprarizations.
            </p>
            <div className="d-flex gap-3 font-weight-bold">
              <a href="#get-started" className="btn btn-get-started">Get Started</a>
              <a href="#learn-more" className="btn btn-learn-more">Learn More</a>
            </div>
          </div>
          <div className="col-lg-6">
            <img 
              src={image} 
              alt="EnergyMinds AI Dashboard Preview" 
              className="img-fluid dashboard-preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;