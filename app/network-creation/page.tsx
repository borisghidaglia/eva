"use client";

import * as d3 from "d3";
import { LucideSend } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  ForceGraph,
  GeneEdge,
  GeneNode,
  parseGeneMatrix,
} from "@/components/force-graph";
import { GeneAnnotationTable } from "@/components/gene-annotation-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export type Message = {
  from: "user" | "assistant";
  text: string;
};

const suggestions = [
  "Can you create a gene association network for CD5, including only the 20 most co-expressed genes.",
  "Can you create a gene co-expression network for CD5, CD6 and CD7.",
  "Can you create a gene co-expression network for CD5 and CD6 independently, highlighting all genes in common.",
];

const GENE_MATRIX_URL = "/data/gene_correlation_matrix.csv";

export default function NetworkCreation() {
  const router = useRouter();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const hasMessages = messages.length > 0;

  const [geneData, setGeneData] = useState<null | {
    nodes: GeneNode[];
    edges: GeneEdge[];
  }>(null);

  useEffect(() => {
    fetch(GENE_MATRIX_URL)
      .then((res) => res.text())
      .then((csv) => {
        const parsed = parseGeneMatrix(csv);
        setGeneData(parsed);
      })
      .catch((err) => {
        console.error("Error fetching gene matrix:", err);
      });
  }, []);

  // Memoize picking 20 random nodes and their edges for the demo
  const { nodes, links } = useMemo(() => {
    if (!geneData) return { nodes: [], links: [] };
    const nodes = d3.shuffle([...geneData.nodes]).slice(0, 20);
    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = geneData.edges.filter(
      (e) =>
        typeof e.source === "string" &&
        typeof e.target === "string" &&
        nodeIds.has(e.source) &&
        nodeIds.has(e.target),
    );
    return { nodes, links };
  }, [geneData]);

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

  const handleConfirmGenesSelection = (ids: string[]) => {
    router.push(`/analysis?genes=${ids.join(",")}`);
  };

  if (!hasMessages) {
    return (
      <div className="mt-20 h-[calc(100vh-80px)]">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Ask EVA to create a gene regulatory network
        </h1>
        <p className="mx-auto max-w-prose text-center text-xs text-gray-500">
          Access to EVA, our multi-modal model that captures the complexity and
          variability of the immune system to create your gene regulatory
          network, and investigate association with clinical outcomes.
        </p>

        <form onSubmit={handleSubmit} className="stack mx-auto my-20 max-w-2xl">
          <textarea
            placeholder="Ask something to Eva"
            className="w-full resize-none rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-xl"
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
        </form>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2">
          {suggestions.map((text, idx) => (
            <Card
              key={idx}
              className="grid max-w-sm cursor-pointer place-items-center py-0 shadow-xs transition-transform"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { from: "user", text },
                  { from: "assistant", text: "Here we go!" },
                ]);
              }}
            >
              <CardContent className="stack p-0">
                <p className="text-tiny px-4 pt-2 pb-3">{text}</p>
                <Button
                  className="m-1 h-auto place-self-end rounded-full bg-transparent py-1.5 text-gray-500 shadow-none hover:bg-black/5 has-[>svg]:px-1.5"
                  type="submit"
                >
                  <LucideSend className="size-3 -translate-x-px translate-y-px" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden border-t border-gray-200">
      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel defaultSize={0.75}>
          <div className="no-scrollbar max-h-full space-y-5 overflow-y-auto p-10">
            <div className="aspect-[5/2] rounded-lg border border-gray-200">
              <ForceGraph nodes={nodes} links={links} />
            </div>
            <GeneAnnotationTable
              geneIds={nodes.map((node) => node.id)}
              onConfirmGenesSelection={handleConfirmGenesSelection}
            />
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

export const Message = ({
  from = "user",
  children,
  ...props
}: React.ComponentProps<"p"> & { from: "assistant" | "user" }) => {
  return (
    <p
      className={cn(
        "max-w-prose rounded-lg p-2 text-xs",
        from === "user" ? "bg-secondary/20 self-end" : "self-start bg-gray-200",
      )}
      {...props}
    >
      {children}
    </p>
  );
};
