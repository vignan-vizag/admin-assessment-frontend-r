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
      console.log("Proceed clicked!");
      console.log("Selected Year:", year);
      console.log("Selected Test:", test);
      console.log("Selected Branch:", branch);
      console.log("Selected Section:", section);
      console.log("Selected Category:", category);

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
    
      <div className="min-h-screen bg-gray-100 p-6 pl-72 flex items-center justify-center mt-[30px]">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Dashboard</h1>
        <p className="mb-6 text-gray-600 text-center">Welcome to the Admin Panel</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="yearDropdown" className="block text-gray-700 font-medium mb-2">
              Passing Out Year
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

          <div>
            <label htmlFor="testDropdown" className="block text-gray-700 font-medium mb-2">
              Select Test:
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

          <div className="mt-6">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-2 px-4 bg-[#0A4CA4] text-white font-semibold rounded-md shadow-md hover:bg-[#062B5B] focus:outline-none focus:ring-2 focus:ring-[#08387F] transition-all"
            >
              Proceed
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
