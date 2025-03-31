import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [year, setYear] = useState('');
  const [test, setTest] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState('');
  const [tests, setTests] = useState([]);
  const [ranks, setRanks] = useState(null);

  // Fetch list of tests on mount
  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch("http://localhost:4000/api/tests/all", {
      method: "GET",
      headers,
      redirect: "follow"
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Tests List:", result);
        setTests(result);
      })
      .catch((error) => console.error("Error fetching tests:", error));
  }, []);

  const handleProceed = async () => {
    try {
      // Validate mandatory fields: Passing Out Year and Test Name
      if (!year) {
        alert("Passing Out Year is mandatory!");
        return;
      }
      if (!test) {
        alert("Test is mandatory!");
        return;
      }

      console.log("Proceed clicked!");
      console.log("Selected Year:", year);
      console.log("Selected Test:", test);
      console.log("Selected Branch:", branch);
      console.log("Selected Section:", section);
      console.log("Selected Category:", category);

      // Build the JSON body as required by the API
      const requestBody = {
        year,
        testName: test,
        branch,
        section,
        category
      };

      console.log("Request Body:", requestBody);

      const response = await fetch("http://localhost:4000/api/tests/getStudentsRanks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        redirect: "follow"
      });

      console.log("Response status:", response.status);
      console.log("Response OK?:", response.ok);

      const rawText = await response.text();
      console.log("Raw response text:", rawText);

      const data = JSON.parse(rawText);
      console.log("Parsed JSON data:", data);

      if (data.studentsRanks) {
        setRanks(data.studentsRanks);
        console.log("Setting ranks state to:", data.studentsRanks);
      } else {
        setRanks([]);
        console.log("No studentsRanks array in response, setting ranks to empty array.");
      }
    } catch (error) {
      console.error("Error in handleProceed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pl-72 mt-[70px]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Form Section - Left Side */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Dashboard</h1>
          <p className="mb-6 text-gray-600 text-center">Welcome to the Admin Panel</p>

          <div className="space-y-4">
            {/* Passing Out Year Dropdown */}
            <div>
              <label htmlFor="yearDropdown" className="block text-gray-700 font-medium mb-2">
                Passing Out Year <span className="text-red-500">*</span>
              </label>
              <select
                id="yearDropdown"
                name="yearDropdown"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
              >
                <option value="">-- Choose a year --</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>

            {/* Test Dropdown */}
            <div>
              <label htmlFor="testDropdown" className="block text-gray-700 font-medium mb-2">
                Select Test <span className="text-red-500">*</span>
              </label>
              <select
                id="testDropdown"
                name="testDropdown"
                value={test}
                onChange={(e) => setTest(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
              >
                <option value="">-- Choose a test --</option>
                {tests.map((t) => (
                  <option key={t._id} value={t.testName}>
                    {t.testName}
                  </option>
                ))}
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
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
              >
                <option value="">-- Choose a branch --</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="AIDS">AIDS</option>
                <option value="AI">AI</option>
                <option value="DS">DS</option>
                <option value="CS">CS</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="ECM">ECM</option>
                <option value="IT">IT</option>
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
                disabled={!(year && branch)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
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
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
              >
                <option value="">-- Choose a category --</option>
                <option value="CODING">Coding</option>
                <option value="MATH">Math</option>
                <option value="BEHAVIORAL">Behavioral</option>
                <option value="APTITUDE">Aptitude</option>
              </select>
            </div>

            {/* Proceed Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>

        {/* Results Table - Right Side */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Students Ranks</h2>
          
          {ranks && ranks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 border text-left text-sm">Rank</th>
                    <th className="py-2 px-3 border text-left text-sm">Reg No</th>
                    <th className="py-2 px-3 border text-left text-sm">Name</th>
                    <th className="py-2 px-3 border text-left text-sm">Total</th>
                    {category && (
                      <th className="py-2 px-3 border text-left text-sm">{category}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((student, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-3 border text-sm">{student.rank}</td>
                      <td className="py-2 px-3 border text-sm">{student.reg_no}</td>
                      <td className="py-2 px-3 border text-sm">{student.name}</td>
                      <td className="py-2 px-3 border text-sm">{student.totalMarks}</td>
                      {category && (
                        <td className="py-2 px-3 border text-sm">
                          {student[category.toLowerCase()] ?? 'N/A'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : ranks && ranks.length === 0 ? (
            <div className="p-4 text-center bg-gray-50 rounded-md">
              <p className="text-gray-600">No student rank data available.</p>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-600">Select the fields however you want the Leaderboards "YEAR" and "TEST NAME" are mandatory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}