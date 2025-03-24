import { useState } from "react";

export default function CreateTest() {
  const [testName, setTestName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categoriesOptions = ["Coding", "Math", "Behavioral", "Aptitude"];
  function parseQuestionDocument(text) {
    const questionBlocks = text.trim().split(/(?=Question:)/g); // Split at each 'Question:'
    const parsedQuestions = [];
    
    questionBlocks.forEach(q => {
        const match = q.match(/Question: (.*?)\r\n(.*?)\r\nAnswer: (.*)/);
        if (match) {
            const questionText = match[1];
            const opt=match[2]
            let options=[]
            let f=0;
            let s=''
            for (let i = 0; i < opt.length-1; i++) {
              if(f===0 && opt[i]===')'){
                f=1
              }
              else if(f===1 &&opt[i+1]===')'){
                options.push(s.trim())
                s=''
                f=0
              }
              else if(f===1){
                s+=opt[i]
              }
            }
            options.push((s+opt[opt.length-1]).trim())
            const answer = match[3].trim();
            
            parsedQuestions.push({
                id: crypto.randomUUID(),
                text: questionText,
                options: options,
                answer: answer
            });
        }
    });
    

    let string = ``
    parsedQuestions.forEach((question) => {
      const options = question.options.map((option) => option).join(",");
      string += `${question.text}(${options})[${question.answer}]\n`
    })
    console.log(parsedQuestions)
    return string
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(event)
      if (event.target?.result) {
        setQuestionsText(parseQuestionDocument(event.target.result));
        console.log("File uploaded successfully");
      }
    };
    reader.onerror = () => {
      console.log('error')
    };
    reader.readAsText(file);
  };

  const handleCreateTest = async () => {
    if (!testName.trim() || !questionsText.trim() || !selectedCategory) {
      alert("Please fill all fields including category!");
      return;
    }
    console.log(questionsText)
    // Create the payload in the expected format:
    const payload = {
      testName,
      categoryName: selectedCategory,
      questionsText, // Sending the raw questions text
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

      // Clear only the questions text and the selected category,
      // keeping the testName intact for further uploads.
      setQuestionsText("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Error creating test: " + error.message);
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
              className={`border px-3 py-1 rounded ${selectedCategory === cat ? "bg-blue-500 text-white" : ""
                }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <input
        type="file"
        id="fileUpload"
        className="border p-2 rounded w-full mb-4"
        accept=".txt,.docx"
        onChange={handleFileUpload}
      />
      <button
        type="button"
        className="bg-blue-500 text-white p-2 rounded w-full"
        onClick={handleCreateTest}
      >
        Save Test
      </button>
    </div>
  );
}
