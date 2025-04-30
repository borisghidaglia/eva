import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function HeatMap({ geneIds }: { geneIds?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [correlations, setCorrelations] = useState<
    { a: string; b: string; correlation: number }[]
  >([]);

  useEffect(() => {
    d3.dsv(",", "/data/gene_correlation_matrix.csv").then((csv) => {
      const normalized = csv
        .map((row) => {
          const localCorrelations = [];
          const geneName = Object.values(row)[0];

          if (!geneIds?.includes(geneName)) return [];

          for (const [idx, correlation] of Object.values(row)
            .slice(1)
            .entries()) {
            const otherGeneName = Object.keys(row)[idx + 1];

            if (!geneIds?.includes(otherGeneName)) continue;

            localCorrelations.push({
              a: geneName,
              b: otherGeneName,
              correlation: parseFloat(correlation ?? "0"),
            });
          }

          return localCorrelations;
        })
        .flat();

      setCorrelations(normalized);
    });
  }, [geneIds]);

  useEffect(() => {
    const plot = Plot.plot({
      marginLeft: 60,
      label: null,
      style: { width: "95%", height: "95%" },
      color: { scheme: "rdylbu", pivot: 0, label: "correlation" },
      marks: [
        Plot.cell(correlations, { x: "a", y: "b", fill: "correlation" }),
        Plot.text(correlations, {
          x: "a",
          y: "b",
          text: (d) => d.correlation.toFixed(2),
          fill: (d) => (Math.abs(d.correlation) > 0.6 ? "white" : "black"),
        }),
      ],
    });
    ref.current?.append(plot);

    return () => plot.remove();
  }, [correlations]);

  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center justify-center"
    ></div>
  );
}
