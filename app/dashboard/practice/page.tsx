"use client";

import * as React from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon, InstagramIcon, XIcon } from "@/components/ui/social-icons";
import { toast } from "sonner";
import { generatePractice, updateProgress, verifyShortAnswer, trackPracticeResult, type PracticeQuestion } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useCourseSelection } from "@/lib/hooks/use-course-selection";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, XCircle, ChevronRight, Info, Lightbulb } from "lucide-react";

export default function PracticePage() {
  const { selection } = useCourseSelection();
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [shortAnswerValue, setShortAnswerValue] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState({ correct: 0, total: 0 });
  const [practiceStarted, setPracticeStarted] = React.useState(false);

  const currentQuestion = questions[currentIndex];
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [aiFeedback, setAiFeedback] = React.useState("");

  const startPractice = async () => {
    if (!selection.department || !selection.course) {
      toast.error("Selection required", { description: "Please select a department and course first." });
      return;
    }
    setLoading(true);

    try {
      const result = await generatePractice(
        selection.department,
        selection.course,
        "general",
        5,
        "medium"
      );
      setQuestions(result.questions);
      setCurrentIndex(0);
      setScore({ correct: 0, total: 0 });
      setSelectedAnswer(null);
      setShortAnswerValue("");
      setShowResult(false);
      setPracticeStarted(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to generate questions.";
      toast.error("Practice Error", { description: msg });
    } finally {
      setLoading(false);
    }
  };


  const submitAnswer = async () => {
    if (currentQuestion.type === "multiple_choice" && !selectedAnswer) return;
    if (currentQuestion.type === "short_answer" && !shortAnswerValue) return;

    let correct = false;
    let feedbackText = "";

    if (currentQuestion.type === "multiple_choice") {
        correct = selectedAnswer === currentQuestion.correctAnswer;
    } else {
        // Short Answer - AI Verification
        setIsVerifying(true);
        try {
            const result = await verifyShortAnswer(
                currentQuestion.question,
                shortAnswerValue,
                currentQuestion.expectedAnswer || ""
            );
            correct = result.isCorrect;
            feedbackText = result.feedback;
        } catch (err) {
            console.error("AI verify failed:", err);
            correct = false; // Be strict if AI fails
            feedbackText = "Verification failed. Please try again or provide more detail.";
        } finally {
            setIsVerifying(false);
        }
    }

    setIsCorrect(correct);
    setAiFeedback(feedbackText);
    setShowResult(true);
    
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    const user = getUser();
    if (user?._id) {
       try {
         // 1. Sync to AI Server (Mastery)
         await updateProgress(user._id, selection.course, currentQuestion.topic || "Practice", correct);
         
         // 2. Sync to Node.js (Leaderboard)
         await trackPracticeResult({
             courseId: selection.course,
             courseName: selection.course,
             questionsAttempted: 1,
             correctAnswers: correct ? 1 : 0,
             sessionDetails: [{
                 topic: currentQuestion.topic || "General",
                 isCorrect: correct,
                 question: currentQuestion.question
             }]
         });
       } catch (err) {
         console.error("Progress sync failed:", err);
       }
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShortAnswerValue("");
      setShowResult(false);
      setAiFeedback("");
    } else {
      setPracticeStarted(false);
      toast.success("Practice session complete!", {
        description: `You've completed all questions for ${selection.course}.`,
      });
    }
  };

  const shareToPlatform = (platform: string) => {
    const shareText = `I just completed a practice session on ${selection.course || "BUPT AI Tutor"}! I scored ${score.correct}/${questions.length}! 🎯🦉`;
    const shareUrl = "https://bupt-ai-tutor.vercel.app";
    
    switch (platform) {
      case "WhatsApp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
        break;
      case "X":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "Instagram":
        // Instagram does not allow direct sharing via URL.
        // The common approach is to copy text to clipboard and instruct the user.
        navigator.clipboard.writeText(shareText + " " + shareUrl);
        toast.success("Ready to share!", { description: "Progress copied! Open Instagram to post." });
        break;
      default:
        toast.info(`Sharing to ${platform}...`);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Practice Hub
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Master {selection?.course || "your topics"} through AI-generated challenges and instant feedback.
            </p>
          </div>
          {practiceStarted && (
             <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
                    <span className="text-sm font-bold text-slate-900">{currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Accuracy</span>
                    <span className="text-sm font-bold text-primary">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</span>
                </div>
             </div>
          )}
        </section>

        {!practiceStarted ? (
          <div className="grid gap-6">
            <CourseSelector />
            <section className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-white p-12 shadow-sm text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/10 bg-white p-1 shadow-md">
                <Image
                    src="/owl-tutor.png"
                    alt="Owl Tutor"
                    fill
                    className="object-contain p-2"
                />
                </div>
                <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Ready to test your knowledge?</h2>
                <p className="max-w-md mx-auto text-sm text-muted-foreground">
                    I&apos;ll generate a set of custom questions based on your current course selection to help you prepare for exams.
                </p>
                </div>
                <Button
                size="lg"
                disabled={loading}
                className="h-12 rounded-2xl px-10 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                onClick={() => startPractice()}
                >
                {loading ? "Generating Questions..." : "Start Practice Session"}
                </Button>
            </section>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <div className="flex flex-col gap-6">
               {/* Question Section */}
               <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all hover:shadow-md">
                  <header className="flex items-center justify-between border-b border-border/50 bg-slate-50/50 px-6 py-4">
                     <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                           {currentIndex + 1}
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                           {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice' : 'Short Answer'}
                        </h3>
                     </div>
                     <span className="rounded-lg bg-secondary/10 px-2 py-1 text-[10px] font-bold text-primary italic">
                        Topic: {selection.course}
                     </span>
                  </header>

                  <div className="p-6 md:p-8">
                     <div className="prose prose-slate max-w-none text-lg font-medium text-slate-800">
                        <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
                     </div>

                     {currentQuestion.imageUrl && (
                        <div className="relative mt-4 flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-slate-100 p-2">
                           <img 
                              src={currentQuestion.imageUrl} 
                              alt="Question Illustration" 
                              className="max-h-full max-w-full object-contain rounded-xl"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                if (target.parentElement) {
                                  target.parentElement.style.display = "none";
                                }
                              }}
                           />
                        </div>
                     )}

                     {currentQuestion.diagram && (
                        <div className="mt-4 rounded-2xl border border-dashed border-primary/20 bg-primary-soft/10 p-4 text-center">
                           <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Diagram Illustration</p>
                           <div className="prose prose-sm mx-auto text-slate-600 italic">
                              <ReactMarkdown>{currentQuestion.diagram}</ReactMarkdown>
                           </div>
                        </div>
                     )}

                     <div className="mt-8 space-y-3">
                        {currentQuestion.type === "multiple_choice" ? (
                           <div className="grid gap-3 sm:grid-cols-2">
                              {currentQuestion.options?.map((option) => {
                                 const isSelected = selectedAnswer === option;
                                 const isCorrectOption = showResult && option === currentQuestion.correctAnswer;
                                 const isWrongSelection = showResult && isSelected && !isCorrectOption;

                                 return (
                                    <button
                                       key={option}
                                       disabled={showResult}
                                       onClick={() => setSelectedAnswer(option)}
                                       className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left text-sm transition-all ${
                                          isSelected 
                                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                          : "border-border bg-white hover:border-primary/40 hover:bg-slate-50"
                                       } ${isCorrectOption ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : ""} ${
                                          isWrongSelection ? "border-red-500 bg-red-50/50 ring-1 ring-red-500" : ""
                                       }`}
                                    >
                                       <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all ${
                                          isSelected ? "border-primary bg-primary text-white" : "border-slate-300 text-slate-400"
                                       } ${isCorrectOption ? "border-green-500 bg-green-500 text-white" : ""} ${
                                          isWrongSelection ? "border-red-500 bg-red-500 text-white" : ""
                                       }`}>
                                          {showResult && isCorrectOption ? <CheckCircle2 className="h-3 w-3" /> : (showResult && isWrongSelection ? <XCircle className="h-3 w-3" /> : String.fromCharCode(65 + currentQuestion.options!.indexOf(option)))}
                                       </span>
                                       <div className="prose prose-sm max-w-none">
                                          <ReactMarkdown>{option}</ReactMarkdown>
                                       </div>
                                    </button>
                                 );
                              })}
                           </div>
                        ) : (
                           <div className="space-y-4">
                              <textarea
                                 disabled={showResult}
                                 value={shortAnswerValue}
                                 onChange={(e) => setShortAnswerValue(e.target.value)}
                                 placeholder="Type your answer here..."
                                 className="min-h-[120px] w-full rounded-2xl border border-border bg-slate-50/50 p-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                              />
                              <p className="text-[10px] text-muted-foreground italic">
                                 Note: Your answer will be compared to the tutor&apos;s expected explanation.
                              </p>
                           </div>
                        )}
                     </div>
                  </div>

                  <footer className="flex items-center justify-between border-t border-border/50 bg-slate-50/50 px-6 py-4">
                     <p className="text-[11px] font-medium text-slate-400 italic">
                        {!showResult 
                           ? (currentQuestion.type === 'multiple_choice' ? "Select an option to confirm" : "Provide a detailed answer to check") 
                           : "Review the explanation below"}
                     </p>
                     {!showResult ? (
                        <Button
                           disabled={isVerifying || (currentQuestion.type === 'multiple_choice' ? !selectedAnswer : !shortAnswerValue)}
                           onClick={submitAnswer}
                           className="h-10 rounded-xl px-6 font-bold"
                        >
                           {isVerifying ? "Verifying..." : "Check Answer"}
                        </Button>
                      ) : (
                        <Button
                           onClick={nextQuestion}
                           className="h-10 rounded-xl px-6 font-bold gap-2"
                        >
                           {currentIndex < questions.length - 1 ? "Next Question" : "Finish Session"}
                           <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                  </footer>
               </article>

               {showResult && (
                  <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                     <div className={`rounded-3xl border p-6 md:p-8 shadow-sm ${isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                        <div className="flex items-start gap-4">
                           <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {isCorrect ? <Lightbulb className="h-6 w-6" /> : <Info className="h-6 w-6" />}
                           </div>
                           <div className="space-y-4">
                              <div>
                                 <h4 className={`text-sm font-bold uppercase tracking-wider ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    {isCorrect ? 'Correct!' : (currentQuestion.type === 'multiple_choice' ? 'Not quite right' : 'Requires Improvement')}
                                 </h4>
                                 <div className="prose prose-slate mt-2 max-w-none text-sm text-slate-700 leading-relaxed font-medium">
                                    <ReactMarkdown>{aiFeedback || currentQuestion.explanation}</ReactMarkdown>
                                 </div>
                              </div>
                              
                              <div className="rounded-2xl bg-white/60 p-4 border border-white">
                                 <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Expected Answer</h5>
                                 <div className="prose prose-slate max-w-none text-sm font-bold text-slate-900">
                                    <ReactMarkdown>{currentQuestion.correctAnswer || currentQuestion.expectedAnswer || ""}</ReactMarkdown>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
               )}
            </div>

            {/* Sidebar Stats */}
            <aside className="space-y-6">
                <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/10 bg-white p-1 shadow-sm">
                        <Image
                            src="/owl-tutor.png"
                            alt="Owl Tutor"
                            fill
                            className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Session Stats</h4>
                        <p className="text-[10px] text-muted-foreground">Real-time performance</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-muted-foreground font-medium">Completion</span>
                         <span className="font-bold text-slate-900">{Math.round(((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/50">
                         <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Correct</p>
                            <p className="text-xl font-black text-green-600">{score.correct}</p>
                         </div>
                         <div className="rounded-2xl bg-slate-50 p-3 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total</p>
                            <p className="text-xl font-black text-slate-900">{score.total}</p>
                         </div>
                      </div>
                   </div>
                </section>

                <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Brag about it</h4>
                    <div className="flex flex-col gap-2">
                        <Button 
                           variant="outline" 
                           onClick={() => shareToPlatform("WhatsApp")}
                           className="justify-start gap-3 border-green-100 text-green-700 hover:bg-green-50 rounded-xl h-10 text-xs font-bold"
                        >
                            <WhatsAppIcon className="h-4 w-4" />
                            WhatsApp
                        </Button>
                        <Button 
                           variant="outline" 
                           onClick={() => shareToPlatform("Instagram")}
                           className="justify-start gap-3 border-pink-100 text-pink-700 hover:bg-pink-50 rounded-xl h-10 text-xs font-bold"
                        >
                            <InstagramIcon className="h-4 w-4" />
                            Instagram
                        </Button>
                        <Button 
                           variant="outline" 
                           onClick={() => shareToPlatform("X")}
                           className="justify-start gap-3 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-10 text-xs font-bold"
                        >
                            <XIcon className="h-4 w-4" />
                            Twitter (X)
                        </Button>
                    </div>
                </section>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}
