import Image from "next/image";

import heroBanner from "@/public/hero-banner.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";

const domains = [
  {
    title: "Rheumatology",
    description: "Access EVA for rheumatology disease models.",
    samples: ["Blood", "Lacrimal"],
    diseases: ["Sjögren’s Syndrome", "Rheumatoid Arthritis"],
    button: { text: "Start", disabled: false },
  },
  {
    title: "Dermatology",
    description: "Access EVA for dermatology disease models.",
    samples: ["Blood", "Skin"],
    diseases: ["Psoriasis"],
    button: { text: "Available soon", disabled: true },
  },
  {
    title: "Gastroenterology",
    description: "Access EVA for gastro-enterology disease models.",
    samples: ["Blood", "Digestive"],
    diseases: ["Crohn’s Disease"],
    button: { text: "Available soon", disabled: true },
  },
  {
    title: "Personalized",
    description: "Access EVA by personalizing your sample type and disease.",
    samples: ["Blood", "Skin"],
    diseases: ["Sjögren’s Syndrome"],
    button: { text: "Available soon", disabled: true },
  },
];

export default function Home() {
  return (
    <main>
      <header className="mx-auto mb-10 max-w-6xl space-y-4 px-10 py-6">
        <h1 className="text-2xl font-semibold">Launch a simulation with Eva</h1>
        <p className="max-w-prose text-base text-gray-400">
          Access to EVA, our multi-modal model that captures the complexity and
          variability of the immune system to create your gene regulatory
          network, and investigate association with clinical outcomes.
        </p>
      </header>
      <section className="stack mx-auto max-w-6xl px-10">
        <Image
          alt="Banner illustration"
          src={heroBanner}
          width={500}
          height={150}
          unoptimized
          className="-z-50 h-[330px] w-full rounded-2xl object-cover opacity-70"
        />

        <div className="mt-[115px] flex h-full justify-around gap-6 px-10">
          {domains.map((card) => (
            <Card
              key={card.title}
              className="flex h-98 w-55 flex-col justify-between bg-white shadow-2xl"
            >
              <CardHeader className="space-y-2 px-4">
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-4">
                <MultiSelect
                  name="Samples"
                  options={card.samples}
                  placeholder="Choose a sample"
                />
                <MultiSelect
                  name="Diseases"
                  options={card.diseases}
                  placeholder="Choose a disease"
                />
              </CardContent>
              <CardFooter className="px-4">
                <Button
                  className="bg-primary hover:bg-primary/90 w-full font-bold"
                  disabled={card.button.disabled}
                >
                  {card.button.text}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
