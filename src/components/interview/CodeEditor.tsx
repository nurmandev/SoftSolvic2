import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, RefreshCw } from "lucide-react";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onRunCode?: (code: string) => void;
  expectedOutput?: string;
  testCases?: Array<{ input: string; output: string }>;
  onLanguageChange?: (language: string) => void;
}

const getDefaultCode = (language: string) => {
  switch (language) {
    case "javascript":
      return `function solution(arr) {
  // Your code here
  // Example: Find maximum subarray sum
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}`;
    case "python":
      return `def solution(arr):
    # Your code here
    # Example: Find maximum subarray sum
    max_so_far = arr[0]
    max_ending_here = arr[0]
    
    for i in range(1, len(arr)):
        max_ending_here = max(arr[i], max_ending_here + arr[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far`;
    case "java":
      return `public class Solution {
    public static int solution(int[] arr) {
        // Your code here
        // Example: Find maximum subarray sum
        int maxSoFar = arr[0];
        int maxEndingHere = arr[0];
        
        for (int i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
    }
}`;
    case "cpp":
      return `#include <algorithm>

int solution(int arr[], int size) {
    // Your code here
    // Example: Find maximum subarray sum
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    
    for (int i = 1; i < size; i++) {
        maxEndingHere = std::max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = std::max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`;
    default:
      return `function solution(arr) {
  // Your code here
}`;
  }
};

const DEFAULT_CODE = getDefaultCode("javascript");

const CodeEditor = ({
  initialCode = DEFAULT_CODE,
  language = "javascript",
  onCodeChange = () => {},
  onRunCode = () => {},
  expectedOutput = "",
  testCases = [],
  onLanguageChange = () => {},
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; output: string }>
  >([]);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    // Update code when language changes
    setCode(getDefaultCode(language));
  }, [language]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      // For JavaScript, we can use Function constructor to evaluate the code
      // This is a simplified approach - in a real app, you'd want to use a sandboxed environment
      if (language === "javascript") {
        // Extract the function from the code
        const functionBody = code;

        // Create a new function from the code
        const userFunction = new Function("return " + functionBody)();

        // Run the function with test cases if provided
        if (testCases && testCases.length > 0) {
          const results = testCases.map((testCase) => {
            try {
              // Parse the input (assuming it's JSON format)
              const input = JSON.parse(testCase.input);
              const result = userFunction(input);
              const expectedResult = JSON.parse(testCase.output);
              const passed =
                JSON.stringify(result) === JSON.stringify(expectedResult);

              return {
                passed,
                output: JSON.stringify(result),
              };
            } catch (error) {
              return {
                passed: false,
                output: `Error: ${error.message}`,
              };
            }
          });

          setTestResults(results);

          // Calculate overall result
          const passedCount = results.filter((r) => r.passed).length;
          setOutput(`Passed ${passedCount} of ${testCases.length} test cases`);
        } else {
          // Just run the function with a sample input if no test cases
          const sampleInput = [1, 2, 3, 4, 5];
          const result = userFunction(sampleInput);
          setOutput(`Result: ${JSON.stringify(result)}`);
        }
      } else {
        setOutput("Only JavaScript execution is supported in this demo.");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
      onRunCode(code);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Code Editor</span>
          <select
            className="text-xs bg-background border rounded px-2 py-1"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python (simulated)</option>
            <option value="java">Java (simulated)</option>
            <option value="cpp">C++ (simulated)</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCode(initialCode)}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full h-64 p-4 font-mono text-sm bg-background border-0 focus:outline-none resize-none"
        spellCheck="false"
      />

      <div className="border-t">
        <div className="bg-muted p-2">
          <span className="text-sm font-medium">Output</span>
        </div>
        <div className="p-4 font-mono text-sm whitespace-pre-wrap min-h-[100px] max-h-[200px] overflow-auto">
          {output || "Run your code to see the output"}

          {testResults.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Test Results:</h4>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${result.passed ? "bg-green-100" : "bg-red-100"}`}
                  >
                    <div className="flex justify-between">
                      <span>Test Case {index + 1}:</span>
                      <span>{result.passed ? "Passed ✓" : "Failed ✗"}</span>
                    </div>
                    <div className="text-xs mt-1">
                      <span>Your output: {result.output}</span>
                    </div>
                    {!result.passed && testCases[index] && (
                      <div className="text-xs mt-1">
                        <span>Expected: {testCases[index].output}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { getDefaultCode };
export default CodeEditor;
