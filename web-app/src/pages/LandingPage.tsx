import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-green-600">Kisan360</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link></li>
                <li><Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Sign Up</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Empowering Farmers with AI Technology</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kisan360 is your all-in-one farming companion, providing real-time insights, weather forecasts, and expert advice to help you maximize your yield.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700">
              Get Started
            </Link>
            <Link to="/login" className="text-green-600 border-2 border-green-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-green-50">
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
