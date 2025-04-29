"use client";

import HeatMap from "@/components/HeatMap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { use, useState } from "react";
import { Message } from "../network-creation/page";
import { Button } from "@/components/ui/button";
import { LucideSend } from "lucide-react";

export default function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { genes } = use(searchParams);
  const geneIds = (Array.isArray(genes) ? genes : genes?.split(",")) || [];

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault?.();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden border-t border-gray-200">
      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel defaultSize={0.75}>
          <div className="no-scrollbar max-h-full space-y-5 overflow-y-auto p-10">
            <div className="aspect-[5/2] rounded-lg border border-gray-200">
              <HeatMap geneIds={geneIds} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          className="grid grid-rows-[1fr_min-content] px-4"
          defaultSize={0.25}
        >
          <div className="no-scrollbar -mb-2 flex w-full flex-col-reverse gap-2 overflow-y-auto pt-4 pb-4">
            {messages
              .slice()
              .reverse()
              .map((msg, idx) => (
                <Message key={idx} from={msg.from}>
                  {msg.text}
                </Message>
              ))}
          </div>
          <form onSubmit={handleSubmit} className="stack pb-2">
            <textarea
              placeholder="Ask something to Eva"
              className="w-full resize-none rounded-lg border border-gray-200 bg-white p-4 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              autoFocus
            />
            <Button
              className="bg-primary hover:bg-primary/90 m-3 h-auto place-self-end rounded-full py-1.5 text-white shadow-none has-[>svg]:px-1.5"
              type="submit"
            >
              <LucideSend className="size-3 -translate-x-px translate-y-px" />
            </Button>
          </form>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
