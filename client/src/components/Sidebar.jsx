import React from 'react';
import {
  FiHome,
  FiBarChart2,
  FiCheckSquare,
  FiFlag,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = () => (
  <aside className="w-full h-full bg-[#143234]" aria-label="Sidebar">
    <div className="overflow-y-auto py-4 px-3  text-white rounded dark:bg-gray-800 h-full">
      <a href="/" className="flex items-center pl-2.5 mb-5">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Dashboard
        </span>
      </a>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-white">
            <FiHome className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="ml-3 text-white">Single Product Optimization</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700">
            <FiBarChart2 className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="flex-1 ml-3 whitespace-nowrap text-white">Aggregate Business Forecast</span>
          </a>
        </li>
        {/* <li>
          <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiCheckSquare className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="flex-1 ml-3 whitespace-nowrap text-white">Tasks</span>
            <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">
              5
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiFlag className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="flex-1 ml-3 whitespace-nowrap text-white">Reports</span>
          </a>
        </li> */}
      </ul>
      
    </div>
  </aside>
);

export default Sidebar;
