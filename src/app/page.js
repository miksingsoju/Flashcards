"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  useEffect(() => {
    const savedFlashcards = JSON.parse(localStorage.getItem("flashcards"));
    const savedGroups = JSON.parse(localStorage.getItem("groups"));
    if (savedFlashcards) setFlashcards(savedFlashcards);
    if (savedGroups) setGroups(savedGroups);
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [flashcards, groups]);

  const addGroup = () => {
    if (selectedGroup && !groups.includes(selectedGroup)) {
      setGroups([...groups, selectedGroup]);
    }
  };

  const addFlashcard = () => {
    if (question && answer && selectedGroup) {
      setFlashcards([...flashcards, { question, answer, group: selectedGroup }]);
      setQuestion("");
      setAnswer("");
    }
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
  };

  const toggleCard = () => {
    if (showAnswer) {
      nextCard();
    } else {
      setShowAnswer(true);
    }
  };

  const exportFlashcards = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flashcards));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "flashcards.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const importFlashcards = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setFlashcards(importedData);
        localStorage.setItem("flashcards", JSON.stringify(importedData));
      } catch (error) {
        console.error("Error importing flashcards:", error);
      }
    };
    reader.readAsText(file);
  };

  const filteredFlashcards = flashcards.filter(card => card.group === selectedGroup);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Flashcard Creator</h1>
      <div className="flex justify-center items-center gap-2 mb-4">
        <span>Quiz Mode</span>
        <Switch checked={quizMode} onCheckedChange={setQuizMode} />
      </div>
      {!quizMode && (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Enter group name"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            />
            <Button onClick={addGroup} className="hover:bg-green-600">Add Group</Button>
          </div>
          <select
            className="mb-2 p-2 border rounded"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a group</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
          <Textarea
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-2 h-32"
          />
          <Textarea
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addFlashcard} disabled={!selectedGroup} className="hover:bg-blue-600">Add Flashcard</Button>
        </div>
      )}
      <div className="space-y-4">
        {filteredFlashcards.length > 0 && quizMode && (
          <Card className="p-4 text-center border border-gray-300 shadow-lg cursor-pointer" onClick={toggleCard}>
            <div className="bg-green-600 text-white text-lg font-bold p-3 rounded-t-lg">{filteredFlashcards[currentIndex].group}</div>
            <CardContent className="p-4 text-xl font-semibold">
              {showAnswer ? filteredFlashcards[currentIndex].answer : filteredFlashcards[currentIndex].question}
            </CardContent>
          </Card>
        )}
        {!quizMode && (
          filteredFlashcards.map((card, index) => (
            <Card key={index} className="p-4 text-center border border-gray-300 shadow-lg">
              <div className="bg-green-600 text-white text-lg font-bold p-3 rounded-t-lg">{card.group}</div>
              <CardContent className="p-4">
                <div className="text-xl font-semibold mb-2">{card.question}</div>
                <div className="text-gray-600">{card.answer}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="mt-4">
        <Button onClick={exportFlashcards} className="hover:bg-blue-600">Export Flashcards</Button>
        <input type="file" onChange={importFlashcards} className="mt-2" />
      </div>
    </div>
  );
}
