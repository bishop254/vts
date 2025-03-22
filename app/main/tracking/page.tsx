"use client";

import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";

export default function VehicleDistance() {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [vehicles1, setVehicles1] = useState<any>([]);
  const [vehicles2, setVehicles2] = useState<any>([]);
  const [selectedVehicle1, setSelectedVehicle1] = useState<any>(null);
  const [selectedVehicle2, setSelectedVehicle2] = useState<any>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const fetchVehicles = debounce(
    async (searchTerm: string, setVehicles: any) => {
      if (searchTerm.length < 2) return;
      try {
        const response = await fetch(
          `http://localhost:8088/vehicle/search?query=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    },
    300
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicles(searchTerm1, setVehicles1);
  }, [searchTerm1]);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 2000);
  }, [error]);

  useEffect(() => {
    fetchVehicles(searchTerm2, setVehicles2);
  }, [searchTerm2]);

  const handleCalculate = async () => {
    if (!selectedVehicle1 || !selectedVehicle2) {
      setError("Kindly pick Vehicle 1 and 2");
      return;
    }

    try {
      const response = await fetch("http://localhost:8088/vehicle/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          vehicle1: selectedVehicle1.license_number,
          vehicle2: selectedVehicle2.license_number,
        }),
      });

      const data = await response.json();
      setDistanceInfo({
        distance: `${(
          data.googleDirections.routes[0].distanceMeters / 1000
        ).toFixed(2)} km`,
        duration: `${Math.ceil(
          parseInt(data.googleDirections.routes[0].duration) / 60
        )} min`,
      });
    } catch (error) {
      console.error("Error fetching distance:", error);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-bold mb-4">Vehicle Distance Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle 1</CardTitle>
            <CardDescription>
              Select the first vehicle by keying in the licence plate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              placeholder="Search Vehicle 1"
            />
            {vehicles1.length > 0 && (
              <ul className="border p-2 mt-2">
                {vehicles1.map((v: any) => (
                  <li
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle1(v);
                      setVehicles1([]);
                    }}
                    className="cursor-pointer hover:bg-gray-200 p-1"
                  >
                    {v.license_number}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            {selectedVehicle1 && (
              <p className="font-bold">
                Selected: {selectedVehicle1.license_number}
              </p>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle 2</CardTitle>
            <CardDescription>
              Select the second vehicle by keying in the licence plate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
              placeholder="Search Vehicle 2"
            />
            {vehicles2.length > 0 && (
              <ul className="border p-2 mt-2">
                {vehicles2.map((v: any) => (
                  <li
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle2(v);
                      setVehicles2([]);
                    }}
                    className="cursor-pointer hover:bg-gray-200 p-1"
                  >
                    {v.license_number}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            {selectedVehicle2 && (
              <p className="font-bold">
                Selected: {selectedVehicle2.license_number}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <Button variant="outline" size="sm" onClick={handleCalculate}>
        <IconLayoutColumns />
        <span className="hidden lg:inline">Calculate Distance</span>
        <span className="lg:hidden">Distance</span>
        <IconChevronDown />
      </Button>

      {distanceInfo && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Distance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Distance:</strong> {distanceInfo.distance}
            </p>
            <p>
              <strong>Estimated Travel Time:</strong> {distanceInfo.duration}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
