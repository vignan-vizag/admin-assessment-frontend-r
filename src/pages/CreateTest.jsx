import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

const CATEGORY_OPTIONS = ["Coding", "Math", "Behavioral", "Aptitude"];

export default function CreateTest() {
  const [testName, setTestName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  const parseQuestions = (text) => {
    const questionBlocks = text.trim().split(/(?=Question:)/);
    const parsedQuestions = questionBlocks.map((block) => {
      const match = block.match(/Question: (.*?)\r?\n(.*?)\r?\nAnswer: (.*)/s);
      if (!match) return null;

      const question = match[1].trim();
      const optionsLine = match[2];
      const answer = match[3].trim();

      const options = optionsLine
        .match(/[A-D]\)\s*([^A-D]*)/g)
        ?.map((opt) => opt.replace(/[A-D]\)\s*/, "").trim()) || [];

      return {
        text: question,
        options,
        answer,
      };
    }).filter(Boolean);

    return parsedQuestions.map(q =>
      `${q.text}(${q.options.join(",")})[${q.answer}]`
    ).join("\n");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      setQuestionsText(parseQuestions(content));
    };
    reader.onerror = () => {
      alert("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleCreateTest = async () => {
    if (!testName.trim() || !questionsText.trim() || !selectedCategory) {
      alert("Please complete all fields.");
      return;
    }

    const payload = {
      testName,
      categoryName: selectedCategory,
      questionsText,
    };

    try {
      const response = await fetch("http://localhost:4000/api/tests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      alert("API Response: " + result);

      setQuestionsText("");
      setSelectedCategory("");
      setUploadedFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create test: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create New Test</h2>

        <input
          type="text"
          placeholder="Enter test name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div>
          <p className="font-semibold text-center text-gray-700 mb-2">Select Category:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                type="button"
                className={`px-3 py-1 rounded-md border shadow-sm ${selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "border-gray-300 hover:bg-blue-100"
                  }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Or paste questions manually here..."
          rows={6}
          value={questionsText}
          onChange={(e) => setQuestionsText(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />

        <div
          className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
          <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Supported: .txt, .docx</p>
          <input
            type="file"
            accept=".txt,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {uploadedFileName && (
          <p className="text-sm text-center text-gray-600">
            Uploaded file: <span className="font-semibold">{uploadedFileName}</span>
          </p>
        )}


        <button
          type="button"
          onClick={handleCreateTest}
          className="w-full py-2 px-4 bg-[#0A4CA4] text-white font-semibold rounded-md shadow-md hover:bg-[#062B5B] focus:outline-none focus:ring-2 focus:ring-[#08387F] transition-all"
        >
          Save Test
        </button>
      </div>
    </div>
  );
}
