import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateVariant = () => {
  const [fields, setFields] = useState({ type: "size", value: "" });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData("variant", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (response.success) {
        notify("Variant created successfully", "success");
        navigate("/variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error creating variant", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Variant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            name="type"
            value={fields.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="size">Size</option>
            <option value="color">Color</option>
          </select>
        </div>

        {/* Value Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
          <input
            name="value"
            value={fields.value}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter variant value"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Creating..." : "Create Variant"}
        </button>
      </form>
    </div>
  );
};

export default CreateVariant;
