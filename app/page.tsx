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

        <div className="mt-[115px] flex h-full justify-around">
          <Card className="flex h-98 w-55 flex-col justify-between bg-white">
            <CardHeader className="space-y-2 px-4">
              <CardTitle className="text-base">Rheumatology</CardTitle>
              <CardDescription className="text-xs">
                Access EVA for rheumatology disease models.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4">
              <MultiSelect
                name="Samples"
                options={["Blood", "Lacrimal"]}
                placeholder="Choose a sample"
              />
            </CardContent>
            <CardFooter className="px-4">
              <Button className="w-full">Start</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
