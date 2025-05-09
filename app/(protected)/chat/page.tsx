"use client";

import { LucideBox, LucideInbox, LucideSend } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const suggestions = [
  "Can you create a gene association network for CD5, including only the 20 most co-expressed genes.",
  "Can you create a gene co-expression network for CD5, CD6 and CD7.",
  "Can you create a gene co-expression network for CD5 and CD6 independently, highlighting all genes in common.",
];

export default function ChatPage() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const hasMessages = messages.length > 0;

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
    <div className="grid h-[calc(100vh-80px)] grid-rows-[1fr_auto]">
      <div className="no-scrollbar flex h-full flex-col-reverse overflow-y-auto">
        {!hasMessages ? (
          <div className="mt-20 h-full">
            <h1 className="mb-6 text-center text-2xl font-bold">
              Ask EVA to create a gene regulatory network
            </h1>
            <p className="mx-auto max-w-prose text-center text-xs text-gray-500">
              Access to EVA, our multi-modal model that captures the complexity
              and variability of the immune system to create your gene
              regulatory network, and investigate association with clinical
              outcomes.
            </p>

            <div className="mx-auto mt-15 flex max-w-6xl flex-wrap justify-center gap-5 self-end">
              {suggestions.map((text, idx) => (
                <Card
                  key={idx}
                  className="grid max-w-sm cursor-pointer place-items-center py-0 shadow-lg transition-transform"
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      { from: "user", text },
                      { from: "assistant", text: "Here we go!" },
                    ]);
                  }}
                >
                  <CardContent className="stack h-full px-0 py-0">
                    <p className="p-5 text-sm">{text}</p>
                    <Button
                      className="m-1 h-auto place-self-end rounded-full bg-transparent py-3 text-gray-500 shadow-none hover:bg-black/5 has-[>svg]:px-3"
                      type="submit"
                    >
                      <LucideSend className="size-4 -translate-x-px translate-y-px" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 pt-4 pb-4">
            {messages.map((msg, idx) => (
              <Message key={idx} from={msg.from}>
                {msg.text}
              </Message>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="stack mx-auto my-4 w-full max-w-3xl"
      >
        <textarea
          placeholder="Ask something to Eva"
          className="w-full resize-none scroll-p-15 rounded-lg border border-gray-300 bg-white p-4 pb-15 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
        />
        <Button
          className="bg-primary hover:bg-primary/90 m-3 h-auto place-self-end rounded-full py-2 text-white shadow-none has-[>svg]:px-2"
          type="submit"
        >
          <LucideSend className="size-4 -translate-x-px translate-y-px" />
        </Button>
        <div className="relative m-3 flex items-center gap-2 self-end justify-self-start">
          <DataFolderPopover>
            <Button
              size="sm"
              className="bg-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-300"
            >
              <LucideInbox className="size-4" />
              Add a dataset
            </Button>
          </DataFolderPopover>
          <PromptGalleryPopover>
            <Button
              size="sm"
              className="bg-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-300"
            >
              <LucideBox className="size-4" />
              Eva prompt gallery
            </Button>
          </PromptGalleryPopover>
        </div>
      </form>
    </div>
  );
}

const DataFolderPopover = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-3xl" sideOffset={15}>
        <div className="p-4">
          <h3 className="text-lg font-semibold">Data Folder</h3>
          <p className="text-sm text-gray-500">
            Upload your own dataset to create a custom gene regulatory network.
          </p>
          <div className="grid grid-cols-4 gap-3 py-5">
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
            <div className="bg-primary/30 h-40 rounded-lg"></div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PromptGalleryPopover = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-3xl" sideOffset={15}>
        <div className="p-4">
          <h3 className="text-lg font-semibold">Prompt Gallery</h3>
          <p className="text-sm text-gray-500">
            Browse through various prompts to enhance your experience.
          </p>
          <div className="grid grid-cols-4 gap-3 py-5">
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
            <div className="bg-primary/20 h-40 rounded-lg"></div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
