"use client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MainPage() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let tokenVal = localStorage.getItem("token");

      if (!tokenVal) {
        router.push("/login");
      } else {
        setToken(tokenVal);
      }
    }
  }, []);

  return (
    <>
      {token && (
        <>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <div className="px-4 lg:px-6">
            <Card className="@container/card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  Top Travellers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SectionCards />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
