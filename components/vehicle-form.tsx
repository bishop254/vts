"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter } from "./ui/alert-dialog";

interface VehicleFormProps {
  closeDialog: () => void;
  initialData?: any;
}

export function VehicleForm({ closeDialog, initialData }: VehicleFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    license_number: "",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    vehicle_type: "",
    manufacturer: "",
    model: "",
    year: "",
    color: "",
    registration_date: "",
    insurance_status: "Active",
    fuel_type: "",
    mileage: "",
    engine_number: "",
    chassis_number: "",
    status: "active",
    last_service_date: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        last_service_date: initialData.last_service_date
          ? new Date(initialData.last_service_date).toISOString().split("T")[0]
          : "",
        registration_date: initialData.registration_date
          ? new Date(initialData.registration_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = initialData
        ? "http://localhost:8088/vehicle/update"
        : "http://localhost:8088/vehicle/add";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }
      closeDialog();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="license_number">
            License Number
          </Label>
          <Input
            id="license_number"
            name="license_number"
            required
            disabled={!!formData.license_number}
            value={formData.license_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="owner_name">
            Owner Name
          </Label>
          <Input
            id="owner_name"
            name="owner_name"
            required
            value={formData.owner_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="owner_phone">
            Owner Phone
          </Label>
          <Input
            id="owner_phone"
            name="owner_phone"
            required
            value={formData.owner_phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="owner_email">
            Owner Email
          </Label>
          <Input
            id="owner_email"
            name="owner_email"
            type="email"
            required
            value={formData.owner_email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="vehicle_type">
            Vehicle Type
          </Label>
          <Input
            id="vehicle_type"
            name="vehicle_type"
            required
            value={formData.vehicle_type}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="manufacturer">
            Manufacturer
          </Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            required
            value={formData.manufacturer}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="model">
            Model
          </Label>
          <Input
            id="model"
            name="model"
            required
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="year">
            Year
          </Label>
          <Input
            id="year"
            name="year"
            type="number"
            required
            value={formData.year}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="color">
            Color
          </Label>
          <Input
            id="color"
            name="color"
            required
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="fuel_type">
            Fuel Type
          </Label>
          <Input
            id="fuel_type"
            name="fuel_type"
            required
            value={formData.fuel_type}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="mileage">
            Mileage
          </Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            required
            value={formData.mileage}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="registration_date">
            Registration Date
          </Label>
          <Input
            id="registration_date"
            name="registration_date"
            type="date"
            required
            value={formData.registration_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="last_service_date">
            Last Service Date
          </Label>
          <Input
            id="last_service_date"
            name="last_service_date"
            type="date"
            required
            value={formData.last_service_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="insurance_status">
            Insurance Status
          </Label>
          <select
            id="insurance_status"
            name="insurance_status"
            required
            value={formData.insurance_status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor="engine_number">
            Engine Number
          </Label>
          <Input
            id="engine_number"
            name="engine_number"
            required
            value={formData.engine_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-1" htmlFor="chassis_number">
            Chassis Number
          </Label>
          <Input
            id="chassis_number"
            name="chassis_number"
            required
            value={formData.chassis_number}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label className="mb-1" htmlFor="status">
          Status
        </Label>
        <select
          id="status"
          name="status"
          required
          value={formData.status}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <AlertDialogFooter>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : initialData
            ? "Update Vehicle"
            : "Add Vehicle"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
}
