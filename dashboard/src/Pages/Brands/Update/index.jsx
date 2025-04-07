import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateBrand = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // useFormFields returns only changed fields.
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  // Fetch the brand details based on id.
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`brand/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setInitialData(response.data);
          setImage(response.data.image || null);
        } else {
          notify("Brand not found!", "error");
          navigate("/brand");
        }
      } catch (err) {
        setError(err.response?.message || "Error fetching brand details");
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

  // Optionally, you can add a function to remove the image if needed.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData, // original values
        ...fields, // updated fields
        image, // current image state
      };
      const response = await fetchData(`brand/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/brand");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "Error updating brand");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      setLoading(true);
      const response = await fetchData(`brand/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/brand");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "Error deleting brand");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Brand</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name *
          </label>
          <input
            name="name"
            value={getFieldValue("name")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter brand name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Image *
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading}
          />
          {image && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Uploaded Image:</p>
              <div className="flex items-center space-x-2">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Updating..." : "Update Brand"}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          {loading ? "Processing..." : "Delete Brand"}
        </button>
      </div>
    </div>
  );
};

export default UpdateBrand;
