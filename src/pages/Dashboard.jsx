import React, { useState } from 'react';

export default function Dashboard() {
  const [test, setTest] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');

  const handleProceed = () => {
    alert(`Test: ${test}\nBranch: ${branch}\nSection: ${section}\nCategory: ${category}\nPassing Out Year: ${year}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome to the Admin Panel</p>
        <div className="space-y-4">
          {/* Test Dropdown */}
          <div>
            <label htmlFor="testDropdown" className="block text-gray-700 font-medium mb-2">
              Select Test:
            </label>
            <select
              id="testDropdown"
              name="testDropdown"
              value={test}
              onChange={(e) => setTest(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a test --</option>
              <option value="test1">Test 1</option>
              <option value="test2">Test 2</option>
              <option value="test3">Test 3</option>
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label htmlFor="branchDropdown" className="block text-gray-700 font-medium mb-2">
              Branch:
            </label>
            <select
              id="branchDropdown"
              name="branchDropdown"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a branch --</option>
              <option value="cse">CSE</option>
              <option value="ece">ECE</option>
              <option value="eee">EEE</option>
              <option value="aids">AIDS</option>
              <option value="ai">AI</option>
              <option value="ds">DS</option>
              <option value="cs">CS</option>
              <option value="mech">Mech</option>
              <option value="civil">Civil</option>
              <option value="ecm">ECM</option>
              <option value="it">IT</option>
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <label htmlFor="sectionDropdown" className="block text-gray-700 font-medium mb-2">
              Section:
            </label>
            <select
              id="sectionDropdown"
              name="sectionDropdown"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a section --</option>
              <option value="1">Section 1</option>
              <option value="2">Section 2</option>
              <option value="3">Section 3</option>
              <option value="4">Section 4</option>
              <option value="5">Section 5</option>
              <option value="6">Section 6</option>
              <option value="7">Section 7</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="categoryDropdown" className="block text-gray-700 font-medium mb-2">
              Category:
            </label>
            <select
              id="categoryDropdown"
              name="categoryDropdown"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a category --</option>
              <option value="coding">Coding</option>
              <option value="math">Math</option>
              <option value="behavioral">Behavioral</option>
              <option value="aptitude">Aptitude</option>
            </select>
          </div>

          {/* Passing Out Year Dropdown */}
          <div>
            <label htmlFor="yearDropdown" className="block text-gray-700 font-medium mb-2">
              Passing Out Year:
            </label>
            <select
              id="yearDropdown"
              name="yearDropdown"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a year --</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </select>
          </div>

          {/* Proceed Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
