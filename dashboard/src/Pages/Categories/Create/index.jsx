import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [fields, handleChange] = useFormFields();
  const [uploading, setUploading] = useState(false);
  const [image,setImage]=useState()
  const navigate=useNavigate()
  // Fetch parent categories
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData("category", {
          method: "GET",
          authorization: `Bearer ${token}`,
        });
        setParentCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
  }, []);
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
      return notify("Image uploaded failed!", "error");
    }
    console.log(response)
    setImage(response.file.filename)
    
    notify("Image uploaded successfully!", "success");
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const response=await fetchData('category',{
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          'Content-type':'application/json'
        },
        body:JSON.stringify({...fields,image}),
      })
      if(response.success){
        notify(response?.message,'success')
        navigate('/category')
      }else{
        notify(response?.message,'error')

      }
    } catch (err) {
      setError(err.response?.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            onChange={handleChange}
            name="name"
            className={`w-full px-3 py-2 border rounded-md ${"border-gray-300"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select onChange={handleChange} name="parentCategory" className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">None</option>
            {parentCategories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {" "}
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
          {error?.images && (
            <p className="text-red-500 text-sm mt-1">{error.images}</p>
          )}
          {image && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Image:
              </p>
              <div className="flex space-x-2 mt-1">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt={`Uploaded`}
                    className="w-20 h-20 object-cover rounded"
                  />
           
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Active Category</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
