import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateCategory = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // useFormFields only returns the changed fields
  const [fields, handleChange] = useFormFields();

  // initialData holds the fetched category details
  const [initialData, setInitialData] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  console.log(token);
  // Fetch parent categories for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData("category", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setParentCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
  }, [token]);

  // Fetch category details based on id from params
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`category/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setInitialData(response.data);
          // Set the image if one exists
          setImage(response.data.image || null);
        } else {
          notify("Category not found!", "error");
          navigate("/category");
        }
      } catch (err) {
        console.error("Error fetching category details:", err);
        setError(err.response?.message || "Error fetching category details");
      }
    })();
  }, [id, token, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchData("upload", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.success) {
      notify("Image upload failed!", "error");
      setUploading(false);
      return;
    }

    setImage(response.file.filename);
    notify("Image uploaded successfully!", "success");
    setUploading(false);
  };

  // Remove image handler
  const handleRemoveImage = async () => {
    const response = await fetchData("upload", {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ fileName: image }),
    });
    if (response?.success) {
      setImage(null);
      notify("Image removed.", "success");
    }
  };

  // When submitting, merge initialData with any changes from fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData, // original values
        ...fields, // any changed values
        image, // current image state
      };
      const response = await fetchData(`category/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/category");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setLoading(true);
      const response = await fetchData(`category/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/category");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get field value: if the field was modified, use that; otherwise, fall back to the fetched value.
  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined)
      return initialData[name];
    return "";
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            name="name"
            value={getFieldValue("name")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            name="parentCategory"
            value={getFieldValue("parentCategory")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">None</option>
            {parentCategories?.map(
              (category) =>
                // Exclude the current category from being its own parent.
                category._id !== id && (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                )
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700"
          >
            Images *
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={uploading}
          />
          {image && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Image:
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <img
                  src={import.meta.env.VITE_BASE_FILE + image}
                  alt="Uploaded"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={!!getFieldValue("isActive")}
            onChange={(e) =>
              // Since our hook only handles target.value, we simulate an event for booleans.
              handleChange({
                target: { name: "isActive", value: e.target.checked },
              })
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Active Category</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
        >
          {loading ? "Processing..." : "Delete Category"}
        </button>
      </div>
    </div>
  );
};

export default UpdateCategory;
