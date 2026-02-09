import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-6 lg:px-20 py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About RealMap</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The modern SaaS platform for real estate plot mapping and booking.
          </p>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              To empower real-estate builders, agents, and buyers with interactive, data-rich plot maps that simplify discovery, comparison, and booking.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Features</h2>
            <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Interactive SVG plot maps with hover & click</li>
              <li>Role-based dashboards for owners and users</li>
              <li>Real-time booking and status updates</li>
              <li>Secure JWT authentication</li>
              <li>Light/Dark theme support</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
