import { useState, useEffect } from "react";
import { fetchOverallLeaderboard } from "../api/testApi";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate years from 2020 to current year + 4
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear + 4 - 2020 + 1 }, (_, i) => 2020 + i);

  const loadLeaderboard = async (year) => {
    if (!year) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await fetchOverallLeaderboard(year);
      setLeaderboardData(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(`Error fetching leaderboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (year) {
      loadLeaderboard(year);
    } else {
      setLeaderboardData(null);
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-orange-600 text-white";
    return "bg-blue-500 text-white";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Overall Leaderboard</h1>
          
          {/* Year Selection */}
          <div className="flex items-center gap-4">
            <label htmlFor="graduationYear" className="text-lg font-medium text-gray-700">
              Select Graduation Year:
            </label>
            <select
              id="graduationYear"
              value={selectedYear}
              onChange={handleYearChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Year --</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading leaderboard...</p>
          </div>
        )}

        {/* Leaderboard Data */}
        {leaderboardData && !loading && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {leaderboardData.totalStudentsEvaluated}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Graduation Year</h3>
                <p className="text-3xl font-bold text-green-600">
                  {leaderboardData.graduationYear}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Collections Processed</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {leaderboardData.totalCollectionsProcessed}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
                <p className="text-sm text-gray-600">
                  {leaderboardData.categories.join(", ")}
                </p>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Top Students Leaderboard
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {leaderboardData.message}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch & Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Breakdown
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboardData.overallLeaderboard.map((student, index) => (
                      <tr key={student.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(
                              student.rank
                            )}`}
                          >
                            {student.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollno}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {student.branch}
                            </div>
                            <div className="text-sm text-gray-500">
                              Section: {student.section}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              Total Score: <span className="text-blue-600 font-bold">{student.totalScore}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Tests: {student.totalTests} | Avg: {student.averageScore}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Coding: {student.categoryBreakdown.coding}
                            </div>
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              Aptitude: {student.categoryBreakdown.aptitude}
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Reasoning: {student.categoryBreakdown.reasoning}
                            </div>
                            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Verbal: {student.categoryBreakdown.verbal}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {leaderboardData.overallLeaderboard.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No students found for the selected year.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Data Selected */}
        {!selectedYear && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select Graduation Year</h3>
            <p className="text-gray-500">Choose a graduation year from the dropdown above to view the leaderboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
