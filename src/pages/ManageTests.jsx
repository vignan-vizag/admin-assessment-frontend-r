import { useEffect, useState } from "react";
import { fetchTests } from "../api/testApi";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000/api";

export default function ManageTests() {
  const [tests, setTests] = useState([]);
  const [editingTest, setEditingTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadTests();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadTests = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await fetchTests();
      console.log("Fetched tests:", data);
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError(`Error fetching tests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
    setEditingTest({ ...test });
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${API_BASE}/tests/${editingTest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testName: editingTest.testName,
          description: editingTest.description || ""
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update test (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      setSuccess("Test updated successfully!");
      setEditingTest(null);
      await loadTests();
    } catch (error) {
      console.error("Error updating test:", error);
      setError(`Error updating test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    if (!confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${API_BASE}/tests/${testId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete test (${response.status}): ${errorText}`);
      }

      setSuccess("Test deleted successfully!");
      setTests(tests.filter((t) => t._id !== testId));
    } catch (error) {
      console.error("Error deleting test:", error);
      setError(`Error deleting test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManageQuestions = (testId) => {
    navigate(`/test/${testId}`);
  };

  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Tests</h2>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test._id} className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
            {editingTest && editingTest._id === test._id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingTest.testName}
                    onChange={(e) => setEditingTest({ ...editingTest, testName: e.target.value })}
                    placeholder="Enter test name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={editingTest.description || ""}
                    onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                    placeholder="Enter test description (optional)"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                    onClick={handleSaveEdit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" 
                    onClick={() => {
                      setEditingTest(null);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.testName}</h3>
                    {test.description && (
                      <p className="text-gray-600 mb-2">{test.description}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      <p>Created: {new Date(test.createdAt).toLocaleDateString()}</p>
                      {test.categories && test.categories.length > 0 && (
                        <p>Categories: {test.categories.map(cat => cat.categoryName).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" 
                    onClick={() => handleEdit(test)}
                    disabled={loading}
                  >
                    Edit Test
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors" 
                    onClick={() => handleManageQuestions(test._id)}
                    disabled={loading}
                  >
                    Manage Questions
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors" 
                    onClick={() => handleDelete(test._id)}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete Test"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {tests.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No tests found. Create a test to get started.</p>
        </div>
      )}
    </div>
  );
}
