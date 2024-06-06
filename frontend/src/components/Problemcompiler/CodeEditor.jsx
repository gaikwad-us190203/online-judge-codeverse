import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import {
  getProblembyid,
  runproblem,
  submitproblem,
} from "../../services/operations/authAPI";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function CodeEditor({ problemid }) {
  const navigate = useNavigate();
  const defaultCodeSnippets = {
    cpp: `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CPP!" << endl;
    return 0;
}`,
    c: `
#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}`,
    py: `
print("Hello, PYTHON!")
`,
    java: `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, JAVA!");
    }
}`,
  };

  const [code, setCode] = useState(defaultCodeSnippets["cpp"]);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const getProblem = async () => {
    try {
      const response = await getProblembyid(problemid);
      toast("Here You Go !!!");

      setProblem(response.data.problem);
    } catch (error) {
      console.error("Unable to Fetch problem:", error);
    }
  };

  useEffect(() => {
    getProblem();
  }, [problemid]);

  useEffect(() => {
    setCode(defaultCodeSnippets[language]);
  }, [language]);

  const handleRun = async () => {
    const payload = {
      language: language,
      code,
      input,
    };

    try {
      const { data } = await runproblem(payload);
      console.log("data-->>", data);
      const formattedOutput = data.output.replace(/\n/g, "<br>");
      console.log("formatedddddd", formattedOutput);
      setOutput(formattedOutput);
    } catch (error) {
      console.log(error.response);
      toast.error("Compilation error");
      setOutput(error)
    }
  };
  const {token}=useSelector((state)=>(state.auth))
  const handleSubmit = async () => {
    const payload = {
      language: language,
      code,
    };
    try {
      const { results } = await submitproblem(payload, problemid,token);
      // toast.success("Code submitted successfully!");
      console.log(results);
    } catch (error) {
      // toast.error("Code not passed all the test cases!");
      console.log(error);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const getLanguage = () => {
    switch (language) {
      case "cpp":
        return languages.cpp;
      case "c":
        return languages.c;
      case "py":
        return languages.python;
      case "java":
        return languages.java;
      default:
        return languages.cpp;
    }
  };
  const { user } = useSelector((state) => state.profile);
  const mysubmissions = (userId, problemId) => {
    // console.log(userId, problemId);
    navigate(`/mysubmissions/${userId}/${problemId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center">CodeVerse</h1>
      <h2 className="text-3xl font-bold text-center">"Empowering Coders, One Verse at a Time !"</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => mysubmissions(user._id, problem._id)}
          className="text-center inline-flex items-center text-white bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
        >
          My Submissions
        </button>
      </div>
      <div className="flex">
        {problem && (
          <div className="w-[50%] p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{problem.title}</h2>
            <p className="mt-1 text-md text-gray-400">
              Difficulty: {problem.difficulty}
            </p>
            <p className="mt-2">{problem.description}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Input Format</h3>
              <p className="mt-2">{problem.inputformat}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Output Format</h3>
              <p className="mt-2">{problem.outputformat}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Example</h3>
              <div className="mt-2 font-semibold">Sample 1 INPUT:</div>
              {problem.sampleinput1.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <div className="mt-2 font-semibold">Sample 1 OUTPUT:</div>
              {problem.sampleoutput1.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}
        <div className="w-[50%] ml-4">
          <div className="flex justify-end mb-4">
            <select
              className="border border-gray-300 rounded-lg py-1.5 px-4 focus:outline-none focus:border-indigo-500"
              onChange={handleLanguageChange}
              value={language}
            >
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div
            className="bg-gray-900 text-white shadow-md rounded-lg mb-4"
            style={{ height: "300px", overflowY: "auto" }}
          >
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, getLanguage())}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                outline: "none",
                border: "none",
                backgroundColor: "#1e1e1e",
                height: "100%",
                overflowY: "auto",
              }}
            />
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg py-1.5 px-4 mb-4 focus:outline-none focus:border-indigo-500"
            placeholder="Enter your input here"
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="flex justify-between">
            <button
              onClick={handleRun}
              type="button"
              className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
              Run
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="text-center inline-flex items-center text-white bg-gradient-to-br from-blue-500 to-green-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Submit
            </button>
          </div>
          {output && (
            <div
              className="mt-4 bg-gray-900 text-white rounded-md shadow-md p-4"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
