import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateDiscountCode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // useFormFields returns only the modified fields
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch discount details to pre-fill form
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`discount/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
        } else {
          notify("Discount not found", "error");
          navigate("/discount-code");
        }
      } catch (err) {
        notify("Error fetching discount details", "error");
      }
    })();
  }, [id, token, navigate]);

  // Helper to get current field value (fields override initialData)
  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields,
        percent: Number(getFieldValue("percent")),
        maxUsedCount: Number(getFieldValue("maxUsedCount")),
        maxPrice: getFieldValue("maxPrice") ? Number(getFieldValue("maxPrice")) : undefined,
        minPrice: getFieldValue("minPrice") ? Number(getFieldValue("minPrice")) : undefined,
        startTime: getFieldValue("startTime") ? new Date(getFieldValue("startTime")) : null,
        expireTime: getFieldValue("expireTime") ? new Date(getFieldValue("expireTime")) : null,
        isActive: getFieldValue("isActive"),
      };

      const response = await fetchData(`discount/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("Discount updated successfully", "success");
        navigate("/discount-code");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error updating discount", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Update Discount</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium">Code *</label>
          <input
            type="text"
            name="code"
            value={getFieldValue("code")}
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
            value={getFieldValue("percent")}
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
            value={getFieldValue("startTime") ? new Date(getFieldValue("startTime")).toISOString().slice(0,16) : ""}
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
            value={getFieldValue("expireTime") ? new Date(getFieldValue("expireTime")).toISOString().slice(0,16) : ""}
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
            value={getFieldValue("maxUsedCount")}
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
            value={getFieldValue("maxPrice")}
            onChange={handleChange}
            placeholder="Enter max price"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Minimum Price */}
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={getFieldValue("minPrice")}
            onChange={handleChange}
            placeholder="Enter min price"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium">Is Active?</label>
          <input
            type="checkbox"
            name="isActive"
            checked={getFieldValue("isActive")}
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
          <span>{getFieldValue("isActive") ? "Active" : "Inactive"}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md transition-colors"
        >
          {loading ? "Updating..." : "Update Discount"}
        </button>
      </form>
    </div>
  );
};

export default UpdateDiscountCode;
