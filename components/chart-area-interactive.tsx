"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive bar chart";

const chartConfig = {
  vehicle: {
    label: "Vehicles",
  },
  total_distance: {
    label: "Total distance(KM)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total_distance");
  const [timeRange, setTimeRange] = React.useState("90d");
  const [distanceData, setDistanceData] = React.useState<any[]>([]);
  const isMobile = useIsMobile();

  const total = React.useMemo(
    () => ({
      total_distance: distanceData.reduce(
        (acc, curr) => acc + curr.total_distance,
        0
      ),
      vehicle: distanceData.length,
    }),
    [distanceData]
  );

  React.useEffect(() => {
    fetchVehicleData();
  }, [timeRange]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const fetchVehicleData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8088/dashboard/total-distance?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.length > 0) {
        setDistanceData(data);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <Card>
      {distanceData && (
        <>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Vehicle & Distance Data</CardTitle>
              <CardDescription>
                Showing all vehicles and distances
              </CardDescription>
            </div>
            <div className="flex">
              {["total_distance", "vehicle"].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key as keyof typeof total].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={distanceData}>
              <XAxis
                dataKey="vehicle"
                tickLine={true}
                tickMargin={15}
                axisLine={true}
                tickFormatter={(value) => value.slice(3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total_distance"
                fill="var(--color-desktop)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </>
      )}
    </Card>
  );
}
