import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateDiscountCode = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // useFormFields will create onChange handlers for us
  const [fields, handleChange] = useFormFields({
    code: "",
    percent: "",
    startTime: "",
    expireTime: "",
    maxUsedCount: "1", // default is 1
    maxPrice: "",
    minPrice: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Prepare payload, converting numeric fields as needed and boolean for isActive.
      const payload = {
        code: fields.code,
        percent: Number(fields.percent),
        startTime: fields.startTime ? new Date(fields.startTime) : null,
        expireTime: fields.expireTime ? new Date(fields.expireTime) : null,
        maxUsedCount: Number(fields.maxUsedCount),
        maxPrice: fields.maxPrice ? Number(fields.maxPrice) : undefined,
        minPrice: fields.minPrice ? Number(fields.minPrice) : undefined,
        isActive: fields.isActive,
      };

      const response = await fetchData("discount", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("Discount created successfully", "success");
        navigate("/discount-code");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error creating discount", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Discount</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium">Code *</label>
          <input
            type="text"
            name="code"
            value={fields.code}
            onChange={handleChange}
            placeholder="Enter discount code"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Percent */}
        <div>
          <label className="block text-sm font-medium">Discount Percent *</label>
          <input
            type="number"
            name="percent"
            value={fields.percent}
            onChange={handleChange}
            placeholder="Enter discount percent (1-100)"
            className="w-full px-3 py-2 border rounded-md"
            min="1"
            max="100"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={fields.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Expire Time */}
        <div>
          <label className="block text-sm font-medium">Expire Time</label>
          <input
            type="datetime-local"
            name="expireTime"
            value={fields.expireTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Maximum Usage Count */}
        <div>
          <label className="block text-sm font-medium">Maximum Usage Count</label>
          <input
            type="number"
            name="maxUsedCount"
            value={fields.maxUsedCount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            min="1"
          />
        </div>

        {/* Maximum Price */}
        <div>
          <label className="block text-sm font-medium">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={fields.maxPrice}
            onChange={handleChange}
            placeholder="Enter max price (if applicable)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Minimum Price */}
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={fields.minPrice}
            onChange={handleChange}
            placeholder="Enter min price (if applicable)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium">Is Active?</label>
          <input
            type="checkbox"
            name="isActive"
            checked={fields.isActive}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "isActive",
                  value: e.target.checked,
                },
              })
            }
            className="mr-2"
          />
          <span>{fields.isActive ? "Active" : "Inactive"}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md transition-colors"
        >
          {loading ? "Creating..." : "Create Discount"}
        </button>
      </form>
    </div>
  );
};

export default CreateDiscountCode;
