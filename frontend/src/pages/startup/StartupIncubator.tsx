import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Mentors from './Mentors';
import Resources from './Resources';
import Metrics from './Metrics';
import StartupList from './SartupList';

const StartupIncubator = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/startup/ventures"
              className={`border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                window.location.pathname === '/startup/ventures'
                  ? 'border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Ventures
            </Link>
            <Link
              to="/startup/mentors"
              className={`border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                window.location.pathname === '/startup/mentors'
                  ? 'border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Mentors
            </Link>
            <Link
              to="/startup/resources"
              className={`border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                window.location.pathname === '/startup/resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/startup/metrics"
              className={
                window.location.pathname === '/startup/metrics'
                  ? 'border-blue-500 text-blue-600 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              }
            >
              Metrics
            </Link>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        <Routes>
          <Route path="/ventures" element={<StartupList />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/metrics" element={<Metrics />} />
        </Routes>
      </div>
    </div>
  );
};

export default StartupIncubator;