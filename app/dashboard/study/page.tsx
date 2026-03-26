"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CourseSelector } from "@/components/dashboard/course-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Mic, Send } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, XIcon } from "@/components/ui/social-icons";
import { toast } from "sonner";
import { sendChat, uploadNoteForTutoring } from "@/lib/api";
import { useCourseSelection } from "@/lib/hooks/use-course-selection";
import ReactMarkdown from "react-markdown";

/**
 * Type definitions for Web Speech API to satisfy linting
 */
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

export default function StudyPage() {
  const { selection } = useCourseSelection();
  const [messages, setMessages] = React.useState<{ from: string; text: string }[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const question = inputValue;
    setMessages(prev => [...prev, { from: "student", text: question }]);
    setInputValue("");

    try {
      const reply = await sendChat(
        selection.department || "General",
        selection.course || "General",
        question,
        messages
      );
      setMessages(prev => [...prev, { from: "tutor", text: reply.text }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to get response.";
      toast.error("AI Error", { description: msg });
      setMessages(prev => [...prev, { from: "tutor", text: "Sorry, I couldn't process that. Make sure the backend is running." }]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading(`Uploading ${file.name}...`);

    try {
      const result = await uploadNoteForTutoring(
        file,
        "Summarize this document and explain the key concepts.",
        selection.course || "General"
      );
      setIsUploading(false);
      toast.dismiss();
      toast.success(`${file.name} uploaded successfully!`);
      setMessages(prev => [...prev, { from: "tutor", text: result.response }]);
    } catch (error) {
      setIsUploading(false);
      toast.dismiss();
      const msg = error instanceof Error ? error.message : "Upload failed.";
      toast.error("Upload Error", { description: msg });
    }
  };

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech Recognition Not Supported", {
        description: "Your browser does not support the Web Speech API."
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Stop recognition (handled by event listeners)
    } else {
      const win = window as unknown as WindowWithSpeech;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info("Recording...", { description: "Speak now to ask your question." });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        toast.success("Speech captured!", { description: `"${transcript}"` });
      };

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast.error("Speech recognition failed", { description: event.error });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  const shareToPlatform = (platform: string) => {
    const shareText = `I&apos;m studying ${selection.course || "BUPT courses"} with BUPT AI Tutor! Check it out!`;
    const shareUrl = "https://bupt-ai-tutor.vercel.app";
    
    switch (platform) {
      case "WhatsApp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
        break;
      case "X":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "Instagram":
        // Instagram doesn't support direct text sharing via URL, so copy to clipboard and notify
        navigator.clipboard.writeText(shareText + " " + shareUrl);
        toast.success("Ready to share!", { description: "Link copied to clipboard. Open Instagram to post!" });
        break;
      default:
        toast.info(`Sharing to ${platform}...`);
    }
  };

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Study session
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Choose your course, upload your notes, and chat with the AI tutor.
            The tutor uses your course materials to give detailed explanations.
          </p>
        </section>

        <CourseSelector />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Course materials
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload your notes to let the tutor reference them.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8 gap-1 text-[11px]"
              >
                <Paperclip className="h-3 w-3" />
                Upload Notes
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".doc,.docx,.ppt,.pptx,.pdf,.txt"
              />
            </header>

            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/40 p-6 text-center">
              <div className="space-y-2">
                <Paperclip className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                  Upload a PDF, PPTX, or DOC file to get started.
                  The AI tutor will summarize and explain key concepts from your notes.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-[11px]"
                >
                  Choose file
                </Button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-4 shadow-sm sm:p-5">
            <header className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">Ask the tutor</h2>
                <p className="text-xs text-muted-foreground">Use text or voice to ask questions.</p>
              </div>
              <span className="rounded-full bg-secondary/20 px-2 py-1 text-[11px] font-medium text-secondary">
                AI Chat
              </span>
            </header>

            <div className="flex h-[400px] lg:h-[500px] flex-col gap-2 rounded-xl border border-border/70 bg-muted/60 p-3 text-xs overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-muted-foreground">
                  <p>Ask the tutor a question to get started.</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 ${message.from === "student"
                    ? "self-end bg-primary text-white"
                    : "self-start bg-white text-slate-900 shadow-sm prose prose-sm max-w-none"
                    }`}
                >
                  {message.from === "tutor" ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type or record your question..."
                  className="h-10 pr-10 text-xs sm:text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleSend} size="sm" className="h-10 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>

        <section className="grid gap-4 rounded-2xl border border-border bg-white/80 p-4 text-xs text-muted-foreground shadow-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Today&apos;s study summary</h2>
            <p className="mt-1">
              Your study time and topics covered will appear here as you use the tutor.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Share your achievement</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => shareToPlatform("WhatsApp")}
                variant="outline" size="sm" className="h-8 gap-1.5 border-green-200 text-green-700 hover:bg-green-50"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </Button>
              <Button
                type="button"
                onClick={() => shareToPlatform("Instagram")}
                variant="outline" size="sm" className="h-8 gap-1.5 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                Instagram
              </Button>
              <Button
                type="button"
                onClick={() => shareToPlatform("X")}
                variant="outline" size="sm" className="h-8 gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <XIcon className="h-3.5 w-3.5" />
                X
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
