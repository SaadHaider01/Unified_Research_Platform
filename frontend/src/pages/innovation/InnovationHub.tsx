import { useState } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import IdeaBank from './IdeaBank';
import Prototypes from './Prototypes';
import Funding from './Funding';
import Partners from './Partners';

const InnovationHub = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/innovation/ideas"
              className={`border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                window.location.pathname === '/innovation/ideas'
                  ? 'border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Idea Bank
            </Link>
            <NavLink
              to="/innovation/prototypes"
              className={({ isActive }: { isActive: boolean }) =>
                `border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`
              }
            >
              Prototypes
            </NavLink>
            <NavLink
              to="/innovation/funding"
              className={({ isActive }: { isActive: boolean }) =>
                `border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`
              }
            >
              Funding
            </NavLink>
            <NavLink
              to="/innovation/partners"
              className={({ isActive }: { isActive: boolean }) =>
                `border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`
              }
            >
              Partners
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        <Routes>
          <Route path="/ideas" element={<IdeaBank />} />
          <Route path="/prototypes" element={<Prototypes />} />
          <Route path="/funding" element={<Funding />} />
          <Route path="/partners" element={<Partners />} />
        </Routes>
      </div>
    </div>
  );
};

export default InnovationHub;