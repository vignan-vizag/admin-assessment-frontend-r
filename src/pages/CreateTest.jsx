import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function CreateTest() {
  const [testName, setTestName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState(""); // Track uploaded file name
  const fileInputRef = useRef(null);

  const categoriesOptions = ["Coding", "Math", "Behavioral", "Aptitude"];

  function parseQuestionDocument(text) {
    const questionBlocks = text.trim().split(/(?=Question:)/g); // Split at each 'Question:'
    const parsedQuestions = [];

    questionBlocks.forEach((q) => {
      const match = q.match(/Question: (.*?)\r\n(.*?)\r\nAnswer: (.*)/);
      if (match) {
        const questionText = match[1];
        const opt = match[2];
        let options = [];
        let f = 0;
        let s = "";
        for (let i = 0; i < opt.length - 1; i++) {
          if (f === 0 && opt[i] === ")") {
            f = 1;
          } else if (f === 1 && opt[i + 1] === ")") {
            options.push(s.trim());
            s = "";
            f = 0;
          } else if (f === 1) {
            s += opt[i];
          }
        }
        options.push((s + opt[opt.length - 1]).trim());
        const answer = match[3].trim();

        parsedQuestions.push({
          id: crypto.randomUUID(),
          text: questionText,
          options: options,
          answer: answer,
        });
      }
    });

    let string = ``;
    parsedQuestions.forEach((question) => {
      const options = question.options.join(",");
      string += `${question.text}(${options})[${question.answer}]\n`;
    });
    console.log(parsedQuestions);
    return string;
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFileName(file.name); // Store file name in state

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setQuestionsText(parseQuestionDocument(event.target.result));
        console.log("File uploaded successfully");
      }
    };
    reader.onerror = () => {
      console.log("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleCreateTest = async () => {
    if (!testName.trim() || !questionsText.trim() || !selectedCategory) {
      alert("Please fill all fields including category!");
      return;
    }

    const payload = {
      testName,
      categoryName: selectedCategory,
      questionsText, // Sending raw questions text
    };

    console.log("Payload sent to API:", payload);
    alert("Initiating API call. Check console for payload details.");

    try {
      const response = await fetch("http://localhost:4000/api/tests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("API response:", response);

      const resultText = await response.text();
      console.log("Result text from API:", resultText);

      alert("API call completed: " + resultText);

      // Reset fields except testName
      setQuestionsText("");
      setSelectedCategory("");
      setUploadedFileName(""); // Clear file name
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Error creating test: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pl-72 flex items-center justify-center mt-[30px]">

      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create New Test</h2>

        <input
          type="text"
          placeholder="Enter test name"
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 mb-4"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />

        <div className="mb-4">
          <p className="mb-2 font-semibold text-gray-700 text-center">Select Category:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoriesOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`border px-3 py-1 border-gray-300 rounded-md shadow-sm focus:outline-none cursor-pointer hover:bg-blue-300 mb-4 ${
                  selectedCategory === cat ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer transition mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
          <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Supports .txt, .docx files</p>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".txt,.docx"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </div>

        {/* Display the uploaded file name */}
        {uploadedFileName && (
          <p className="text-sm text-gray-600 mb-4 text-center">
            Uploaded file: <span className="font-semibold text-gray-800">{uploadedFileName}</span>
          </p>
        )}

        <button
          type="button"
          className="w-full py-2 px-4 bg-[#0A4CA4] text-white font-semibold rounded-md shadow-md hover:bg-[#062B5B] focus:outline-none focus:ring-2 focus:ring-[#08387F] transition-all"
          onClick={handleCreateTest}
        >
          Save Test
        </button>
      </div>
    </div>
  );
}
