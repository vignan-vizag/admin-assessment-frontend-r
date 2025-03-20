import { useEffect, useState } from "react";
import { fetchTests, getTest } from "../api/testApi";
import { useNavigate } from "react-router-dom";

export default function StartTest() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // Fetch all test names & categories on load
  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await fetchTests();
        setTests(data);
      } catch (err) {
        console.error("Failed to load tests", err);
      }
    };
    loadTests();
  }, []);

  // When user clicks a test, fetch random 20 questions
  const handleStart = async (testName, categoryName) => {
    try {
      const testData = await getTest(testName, categoryName);
      console.log("Fetched Questions: ", testData.questions);

      // You can navigate to a quiz page and pass questions there
      navigate("/quiz", { state: { questions: testData.questions } });
    } catch (err) {
      console.error("Failed to fetch random questions", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select a Test to Start</h2>
      {tests.length === 0 && <p>Loading tests...</p>}
      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{test.testName}</p>
              <p className="text-sm text-gray-500">{test.categoryName}</p>
            </div>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleStart(test.testName, test.categoryName)}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
