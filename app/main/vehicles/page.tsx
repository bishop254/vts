"use client";

import { DataTable } from "@/components/data-table";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchVehicles = async (
    cursor: string | null = null,
    limit: number = pageSize
  ) => {
    setLoading(true);
    setVehicles([]);
    try {
      const response = await fetch(
        `http://localhost:8088/vehicle/get?limit=${limit}${
          cursor ? `&cursor=${cursor}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.data.length > 0) {
        setVehicles(data.data);
        setNextCursor(data.nextCursor ?? null);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, [pageSize]);

  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {!loading && vehicles.length > 0 ? (
        <>
          <DataTable
            data={vehicles}
            pageSize={pageSize}
            onPageSizeChange={(val: number) => setPageSize(val)}
            onLoadMore={() => fetchVehicles(nextCursor)}
            onReload={() => fetchVehicles()}
            isLoading={loading}
          />
        </>
      ) : loading ? (
        <div className="flex justify-center">
          <Progress value={progress} className="w-[60%]" />
        </div>
      ) : (
        <p>No vehicles found.</p>
      )}
    </div>
  );
}
