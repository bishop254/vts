import { useEffect, useState } from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const [vehicles, setVehicles] = useState<any>([]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8088/dashboard/top-vehicles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setVehicles(data);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchVehicleData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {vehicles.map((vehicle: any, index: number) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {vehicle.vehicle}
            </CardTitle>
            <CardDescription>
              <strong>{vehicle.owner}</strong>
            </CardDescription>
            <CardDescription>{vehicle.manufacturer}</CardDescription>
            <CardDescription>{vehicle.type}</CardDescription>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                {vehicle.total_distance} km
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
