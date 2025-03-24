import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartTest() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch("http://localhost:4000/api/tests/all", requestOptions);
        const data = await response.json(); // Parse JSON response
        console.log("API response:", data);  // Debug: log the full API response
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    loadTests();
  }, []);

  // When a test is clicked, redirect to a placeholder page
  const handleTestClick = (testId) => {
    // For now, we redirect to a test-specific page (e.g., /test/:id)
    navigate(`/test/${testId}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test List</h2>
      {tests.length === 0 ? (
        <p>Loading tests...</p>
      ) : (
        <ul>
          {tests.map((test) => (
            <li 
              key={test._id} 
              className="mb-2 cursor-pointer hover:underline" 
              onClick={() => handleTestClick(test._id)}
            >
              {test.testName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
