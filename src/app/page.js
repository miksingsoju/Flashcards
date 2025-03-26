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
  const [quizMode, setQuizMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load flashcards from local storage on first render
  useEffect(() => {
    const savedFlashcards = JSON.parse(localStorage.getItem("flashcards"));
    if (savedFlashcards) {
      setFlashcards(savedFlashcards);
    }
  }, []);

  // Save flashcards to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = () => {
    if (question && answer) {
      const newFlashcards = [...flashcards, { question, answer }];
      setFlashcards(newFlashcards);
      setQuestion("");
      setAnswer("");
    }
  };

  const handleCardClick = () => {
    if (quizMode) {
      if (showAnswer) {
        setShowAnswer(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      } else {
        setShowAnswer(true);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Flashcard Creator</h1>
      <div className="flex justify-center items-center gap-2 mb-4">
        <span>Quiz Mode</span>
        <Switch checked={quizMode} onCheckedChange={setQuizMode} />
      </div>
      {!quizMode && (
        <div className="mb-4">
          <Input
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addFlashcard}>Add Flashcard</Button>
        </div>
      )}
      <div className="space-y-4">
        {flashcards.length > 0 && (
          <Card
            onClick={handleCardClick}
            className="p-6 cursor-pointer flex justify-center items-center"
          >
            <CardContent className={`text-center ${quizMode ? "text-4xl font-bold" : "text-lg"}`}>
              {quizMode
                ? showAnswer
                  ? flashcards[currentIndex].answer
                  : flashcards[currentIndex].question
                : flashcards.map((card, index) => (
                    <div key={index} className="p-2 border-b">
                      <strong>{card.question}</strong>: {card.answer}
                    </div>
                  ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
