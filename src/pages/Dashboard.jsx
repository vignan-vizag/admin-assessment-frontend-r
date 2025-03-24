export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome to the Admin Panel</p>
        <div className="mb-4">
          <label htmlFor="testDropdown" className="block text-gray-700 font-medium mb-2">
            Select Test:
          </label>
          <select
            id="testDropdown"
            name="testDropdown"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Choose a test --</option>
            <option value="test1">Test 1</option>
            <option value="test2">Test 2</option>
            <option value="test3">Test 3</option>
          </select>
        </div>
      </div>
    </div>
  );
}
