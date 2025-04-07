import React, { useState, useEffect, useCallback } from "react";

const INITIAL_FORM = {
  year: "",
  test: "",
  branch: "",
  section: "",
  category: "",
};

const YEARS = ["2026", "2027", "2028", "2029"];
const BRANCHES = ["CSE", "ECE", "EEE", "AIDS", "AI", "DS", "CS", "MECH", "CIVIL", "ECM", "IT"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G"];
const CATEGORIES = ["Coding", "Math", "Behavioral", "Aptitude"];

const API_BASE = "http://localhost:4000/api";

export default function Dashboard() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [tests, setTests] = useState([]);
  const [ranks, setRanks] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${API_BASE}/tests/all`);
        const data = await res.json();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  // const handleProceed = useCallback(async () => {
  //   const { year, test, branch, section, category } = formData;

  //   if (!year || !test) {
  //     alert("Passing Out Year and Test are mandatory!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE}/tests/getStudentsRanks`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         year,
  //         testName: test,
  //         branch,
  //         section,
  //         category,
  //       }),
  //     });

  //     const text = await response.text();
  //     const data = JSON.parse(text);

  //     setRanks(data?.studentsRanks || []);
  //     console.log(data?.studentsRanks);

  //   } catch (error) {
  //     console.error("Error getting ranks:", error);
  //     setRanks([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [formData]);

  const handleProceed = useCallback(async () => {
    const { year, test, branch, section, category } = formData;

    if (!year || !test) {
      alert("Passing Out Year and Test are mandatory!");
      return;
    }

    setLoading(true);
    try {
      const studentsResponse = await fetch(`${API_BASE}/students?year=${year}`);
      const studentsData = await studentsResponse.json();

      const processedData = studentsData.map((student) => {
        let categoryMarks = 0;

        const totalMarks = student.assignedTests.reduce((total, assignedTest) => {
          const matchedTest = tests.find(
            (t) => t.testName === test && t._id === assignedTest.testId
          );

          if (matchedTest) {
            if (category) {
              const mark = assignedTest.marks?.[category];
              // console.log(mark);
              if (typeof mark === "number") categoryMarks += mark;
              return total + (typeof mark === "number" ? mark : 0);
            } else {
              const marks = Object.values(assignedTest.marks || {});
              return total + marks.reduce((sum, mark) => sum + mark, 0);
            }
          }
          return total;
        }, 0);
        // console.log(categoryMarks);

        return {
          ...student,
          totalMarks,
          ...(category ? { categoryMark: categoryMarks } : {})
        };
      });

      const filteredData = processedData.filter((student) => {
        const matchesBranch = branch ? student.branch === branch : true;
        const matchesSection = section ? student.section === section : true;
        const matchesCategory = category
          ? student.assignedTests.some((assignedTest) => {
            const isTestMatched =
              assignedTest.testId === tests.find((t) => t.testName === test)?._id;
            const hasCategory = Object.keys(assignedTest.marks || {}).includes(category);
            return isTestMatched && hasCategory;
          })
          : true;

        return matchesBranch && matchesSection && matchesCategory;
      });

      filteredData.sort((a, b) => b.totalMarks - a.totalMarks);

      const rankedData = filteredData.map((student, index) => ({
        ...student,
        rank: index + 1,
      }));

      setRanks(rankedData || []);
    } catch (error) {
      console.error("Error getting ranks:", error);
      setRanks([]);
    } finally {
      setLoading(false);
    }
  }, [formData, tests]);

  const renderSelect = (label, key, options, required = false, disabled = false) => (
    <div key={key}>
      <label htmlFor={key} className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={key}
        value={formData[key]}
        onChange={handleChange(key)}
        disabled={disabled}
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50"
      >
        <option value="">-- Choose an option --</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Dashboard</h1>
          <p className="mb-6 text-gray-600 text-center">Welcome to the Admin Panel</p>

          <div className="space-y-4">
            {renderSelect("Passing Out Year", "year", YEARS, true)}
            {renderSelect("Select Test", "test", tests.map((t) => t.testName), true)}
            {renderSelect("Branch", "branch", BRANCHES)}
            {renderSelect("Section", "section", SECTIONS, false, !(formData.year && formData.branch))}
            {renderSelect("Category", "category", CATEGORIES)}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Loading..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Students Ranks</h2>

          {ranks ? (
            ranks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 border text-left text-sm">Rank</th>
                      <th className="py-2 px-3 border text-left text-sm">Reg No</th>
                      <th className="py-2 px-3 border text-left text-sm">Name</th>
                      <th className="py-2 px-3 border text-left text-sm">Total</th>
                      {formData.category && (
                        <th className="py-2 px-3 border text-left text-sm">{formData.category}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {ranks.map((student, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-2 px-3 border text-sm">{student.rank}</td>
                        <td className="py-2 px-3 border text-sm">{student.rollno}</td>
                        <td className="py-2 px-3 border text-sm">{student.name}</td>
                        <td className="py-2 px-3 border text-sm">{student.totalMarks}</td>
                        {formData.category && (
                          <td className="py-2 px-3 border text-sm">
                            {student.categoryMark ?? "N/A"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-50 rounded-md">
                <p className="text-gray-600">No student rank data available.</p>
              </div>
            )
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-600">
                Select the fields. "Passing Out Year" and "Test" are mandatory to fetch the leaderboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
