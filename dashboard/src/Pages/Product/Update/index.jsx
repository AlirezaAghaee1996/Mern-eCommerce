import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  // useFormFields returns only modified fields
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [images, setImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [information, setInformation] = useState([]);
  const [infoKey, setInfoKey] = useState("");
  const [infoValue, setInfoValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch categories and brands
  useEffect(() => {
    (async () => {
      try {
        const catResponse = await fetchData("category", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (catResponse.success) {
          setCategories(catResponse.data);
        }
        const brandResponse = await fetchData("brand", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (brandResponse.success) {
          setBrands(brandResponse.data);
        }
      } catch (err) {
        notify("Error fetching categories or brands", "error");
      }
    })();
  }, [token]);

  // Fetch product details
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`product/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
          setImages(response.data.imagesUrl || []);
          setInformation(response.data.information || []);
        } else {
          notify("Product not found!", "error");
          navigate("/product");
        }
      } catch (err) {
        notify("Error fetching product details", "error");
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
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.success) {
      notify("Image upload failed!", "error");
      setUploading(false);
      return;
    }
    
    setImages((prev) => [...prev, response.file.filename]);
    notify("Image uploaded successfully!", "success");
    setUploading(false);
  };

  const handleAddInformation = () => {
    if (infoKey.trim() && infoValue.trim()) {
      setInformation((prev) => [...prev, { key: infoKey.trim(), value: infoValue.trim() }]);
      setInfoKey("");
      setInfoValue("");
    }
  };

  // Merge any changes with the original product data on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields, // only modified fields
        imagesUrl: images,
        information,
      };
      const response = await fetchData(`product/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("Product updated successfully", "success");
        navigate("/product");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error updating product", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get current field value
  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            name="title"
            value={getFieldValue("title")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter product title"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={getFieldValue("description")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="categoryId"
            value={getFieldValue("categoryId")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Brand Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <select
            name="brandId"
            value={getFieldValue("brandId")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="images">
            Upload Image
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading}
          />
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
              <div className="flex space-x-2 mt-1">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={import.meta.env.VITE_BASE_FILE + img}
                    alt={`Uploaded ${idx}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Key"
              value={infoKey}
              onChange={(e) => setInfoKey(e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Value"
              value={infoValue}
              onChange={(e) => setInfoValue(e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button 
              type="button"
              onClick={handleAddInformation}
              className="px-3 py-2 bg-green-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
          {information.length > 0 && (
            <ul className="list-disc pl-5">
              {information.map((info, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  {info.key}: {info.value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
