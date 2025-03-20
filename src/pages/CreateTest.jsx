import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTest } from "../api/testApi";

export default function CreateTest() {
  const [testName, setTestName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const categoriesOptions = ["Coding", "Math", "Behavioral", "Aptitude"];

  const parseQuestions = (text) => {
    const lines = text.trim().split("\n");
    return lines.map((line, idx) => {
      const match = line.match(/^(.*?)\s+\((.*?)\)\s+\[(.*?)\]$/);
      if (!match) {
        throw new Error(`Invalid format in line ${idx + 1}`);
      }

      const question = match[1].trim();
      const options = match[2].split(",").map((opt) => opt.trim());
      const correctAnswer = match[3].trim();

      if (!options.includes(correctAnswer)) {
        throw new Error(
          `Correct answer "${correctAnswer}" not found in options for line ${idx + 1}`
        );
      }

      return { question, options, correctAnswer };
    });
  };

  const handleCreateTest = async () => {
    if (!testName.trim() || !questionsText.trim() || !selectedCategory) {
      alert("Please fill all fields including category!");
      return;
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = parseQuestions(questionsText);
    } catch (err) {
      alert(err.message);
      return;
    }

    console.log("Payload sent to API:", {
      testName,
      categoryName: selectedCategory,
      questions: parsedQuestions,
    });

    try {
      const response = await createTest({
        testName,
        categoryName: selectedCategory,
        questions: parsedQuestions,
      });

      alert(response.message || "Test created successfully!");
      setTestName("");
      setQuestionsText("");
      setSelectedCategory("");
      navigate("/start-test");
    } catch (error) {
      alert("Error creating test");
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Test</h2>

      <input
        type="text"
        placeholder="Enter test name"
        className="border p-2 rounded w-full mb-4"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
      />

      <div className="mb-4">
        <p className="mb-2 font-semibold">Select Category:</p>
        <div className="flex flex-wrap gap-2">
          {categoriesOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`border px-3 py-1 rounded ${
                selectedCategory === cat ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <textarea
        rows={10}
        placeholder={`Format:\nQuestion Text (opt1, opt2, opt3, opt4) [correctAnswer]\n\nExample:\nWhat is 2+2? (2, 3, 4, 5) [4]\nWho is CEO of Tesla? (Jeff, Elon, Bill, Mark) [Elon]`}
        className="border p-2 rounded w-full mb-4"
        value={questionsText}
        onChange={(e) => setQuestionsText(e.target.value)}
      ></textarea>

      <button
        className="bg-blue-500 text-white p-2 rounded w-full"
        onClick={handleCreateTest}
      >
        Save Test
      </button>
    </div>
  );
}
