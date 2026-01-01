'use client';

import React, { useState } from 'react';
import { generateCodeAction } from '@/app/actions'; // Import the action

interface GenerateCodeOutput {
  generatedCode: string;
  explanation: string;
  dependencies: string[];
  nextSteps: string[];
}

export function PrototypingInterface() {
  const [analysisReport, setAnalysisReport] = useState<string>('');
  const [componentType, setComponentType] = useState<
    'frontend' | 'backend' | 'fullstack'
  >('frontend');
  const [requirements, setRequirements] = useState<string>('');
  const [technology, setTechnology] = useState<string>('');
  const [existingCode, setExistingCode] = useState<string>('');
  const [generatedOutput, setGeneratedOutput] = useState<GenerateCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null); // Clear previous output

    try {
      const result = await generateCodeAction({
        analysisReport,
        componentType,
        requirements,
        technology,
        existingCode,
      });
      setGeneratedOutput(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate code.');
      console.error('Error generating code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-300">Code Prototyping Interface</h2>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">
            Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            id="requirements"
            rows={4}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe the code you want to generate (e.g., 'A React component for a user profile card showing name, email, and avatar')."
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div>
          <label htmlFor="analysisReport" className="block text-sm font-medium text-gray-300 mb-1">
            Analysis Report (Optional)
          </label>
          <textarea
            id="analysisReport"
            rows={3}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={analysisReport}
            onChange={(e) => setAnalysisReport(e.target.value)}
            placeholder="Provide any existing analysis or project context."
            disabled={isLoading}
          ></textarea>
        </div>

        <div>
          <label htmlFor="componentType" className="block text-sm font-medium text-gray-300 mb-1">
            Component Type
          </label>
          <select
            id="componentType"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={componentType}
            onChange={(e) =>
              setComponentType(
                e.target.value as 'frontend' | 'backend' | 'fullstack'
              )
            }
            disabled={isLoading}
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
          </select>
        </div>

        <div>
          <label htmlFor="technology" className="block text-sm font-medium text-gray-300 mb-1">
            Technology (Optional)
          </label>
          <input
            type="text"
            id="technology"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder="e.g., React, Next.js, Node.js, Python, Flask"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="existingCode" className="block text-sm font-medium text-gray-300 mb-1">
            Existing Code (Optional)
          </label>
          <textarea
            id="existingCode"
            rows={5}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            value={existingCode}
            onChange={(e) => setExistingCode(e.target.value)}
            placeholder="Provide any relevant existing code for context or modification."
            disabled={isLoading}
          ></textarea>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleGenerateCode}
        className="w-full p-3 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        disabled={isLoading || !requirements.trim()}
      >
        {isLoading ? 'Generating Code...' : 'Generate Code'}
      </button>

      {/* Output Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-800 text-white rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {generatedOutput && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold text-blue-200">Generated Output:</h3>
          {generatedOutput.generatedCode && (
            <div>
              <h4 className="text-lg font-medium text-gray-100">Code:</h4>
              <pre className="whitespace-pre-wrap break-all bg-gray-900 p-3 rounded-md text-sm">
                <code>{generatedOutput.generatedCode}</code>
              </pre>
            </div>
          )}
          {generatedOutput.explanation && (
            <div>
              <h4 className="text-lg font-medium text-gray-100">Explanation:</h4>
              <p className="text-gray-200 whitespace-pre-wrap">{generatedOutput.explanation}</p>
            </div>
          )}
          {generatedOutput.dependencies && generatedOutput.dependencies.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-100">Dependencies:</h4>
              <ul className="list-disc list-inside text-gray-200">
                {generatedOutput.dependencies.map((dep, index) => (
                  <li key={index}>{dep}</li>
                ))}
              </ul>
            </div>
          )}
          {generatedOutput.nextSteps && generatedOutput.nextSteps.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-100">Next Steps:</h4>
              <ul className="list-disc list-inside text-gray-200">
                {generatedOutput.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
