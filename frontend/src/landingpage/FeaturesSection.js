import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: 'bi-graph-up-arrow',
      title: 'Real-Time Visualization',
      text: 'Smarter energy visualization on aier:detans real-Time and visualization.'
    },
    {
      id: 2,
      icon: 'bi-cpu-fill',
      title: 'Real-Time Analytics',
      text: 'EnergyMinds AI is a nio-corooration sostoms and energy reuniders.'
    },
    {
      id: 3,
      icon: 'bi-bar-chart-fill',
      title: 'AI-Powered Predictions',
      text: 'Convereiont ai energy routinem, relative and understanding inspection.'
    },
    {
      id: 4,
      icon: 'bi-lightning-fill',
      title: 'Device-Analytics',
      text: 'AI on-reats with AI-powered predictions to-true appeallance predictions.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <h2 className="text-center features-title">Our Core Features</h2>
        <div className="row g-4">
          {features.map((feature) => (
            <div key={feature.id} className="col-md-6 col-lg-3">
              <div className="card feature-card h-100">
                <div className="card-body">
                  <div className="feature-icon-wrapper">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;