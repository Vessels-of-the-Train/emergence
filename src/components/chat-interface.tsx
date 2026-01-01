'use client';

import React, { useState } from 'react';
import {
  generateCodeAction,
  generateTestSuiteAction,
  generateMultiModalWorkflowAction,
  generateEnhancedAnalysisAction,
} from '@/app/actions';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse: any;
      const command = input.split(' ')[0];
      const messageContent = input.substring(command.length).trim();

      switch (command) {
        case '/code':
          aiResponse = await generateCodeAction({
            analysisReport: 'User requested code generation.',
            componentType: 'fullstack',
            requirements: messageContent,
            technology: 'React, Node.js',
            existingCode: '',
          });
          break;
        case '/test':
          aiResponse = await generateTestSuiteAction({
            analysisReport: 'User requested test suite generation.',
            codeStructure: 'No specific code structure provided, generating based on requirements.',
            technology: 'React, Jest',
            testingFramework: 'Jest',
            focusAreas: ['unit', 'integration'],
          });
          break;
        case '/workflow':
          aiResponse = await generateMultiModalWorkflowAction({
            projectGoals: messageContent,
            contentTypes: ['text'],
            existingContent: '',
            targetPlatform: 'web',
            userPreferences: 'standard',
          });
          break;
        case '/analyze':
          aiResponse = await generateEnhancedAnalysisAction({
            fileStructure: 'User requested analysis.',
            codeSnippets: 'No specific code snippets provided.',
            packageJson: '{}', // Placeholder
            requirements: messageContent,
          });
          break;
        default:
          aiResponse = {
            text: `Unrecognized command. Try /code, /test, /workflow, or /analyze. Your input was: "${input}"`,
          };
          break;
      }

      const newAiMessage: Message = {
        id: messages.length + 2,
        text:
          aiResponse.generatedCode ||
          aiResponse.explanation ||
          aiResponse.workflowOverview ||
          aiResponse.projectOverview ||
          aiResponse.text ||
          'No specific response returned.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('Error calling AI action:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Chat with Aetherium AI</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-700 text-gray-100">
              Aetherium is thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleSendMessage();
            }
          }}
          className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none"
          placeholder="Type your message with a command, e.g., /code generate a login form"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-blue-600 rounded-r-lg text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
