import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateProductVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // useFormFields returns only modified fields
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lists for product and variant selection
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  // Fetch products and variants
  useEffect(() => {
    (async () => {
      try {
        const prodResponse = await fetchData("product", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (prodResponse.success) {
          setProducts(prodResponse.data);
        }
        const varResponse = await fetchData("variant", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (varResponse.success) {
          setVariants(varResponse.data);
        }
      } catch (err) {
        notify("Error fetching products or variants", "error");
      }
    })();
  }, [token]);

  // Fetch variant details to edit
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`product-variant/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
        } else {
          notify("Product variant not found!", "error");
          navigate("/product-variant");
        }
      } catch (err) {
        notify("Error fetching product variant details", "error");
      }
    })();
  }, [id, token, navigate]);

  // Function to compute final price based on changes (fields overwrite initialData when modified)
  const computePriceAfterDiscount = () => {
    const price = Number(fields.price !== undefined ? fields.price : initialData?.price);
    const discount = Number(fields.discount !== undefined ? fields.discount : initialData?.discount);
    if (!isNaN(price) && !isNaN(discount)) {
      return (price - price * (discount / 100)).toFixed(2);
    }
    return "";
  };

  // Helper to get current field value
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
        ...fields, // only modified fields
        // Ensure numeric conversion:
        price: Number(getFieldValue("price")),
        discount: Number(getFieldValue("discount")),
        quantity: Number(getFieldValue("quantity")),
        // Optionally update priceAfterDiscount here (or let the backend handle it)
        priceAfterDiscount: Number(computePriceAfterDiscount()),
      };

      const response = await fetchData(`product-variant/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("Product variant updated successfully", "success");
        navigate("/product-variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error updating product variant", "error");
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Product Variant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price *</label>
          <input
            type="number"
            name="price"
            value={getFieldValue("price")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Discount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={getFieldValue("discount")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter discount percentage"
            min="0"
            max="100"
          />
        </div>

        {/* Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={getFieldValue("quantity")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product *</label>
          <select
            name="productId"
            value={initialData?.productId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.title || prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Variant *</label>
          <select
            name="variantId"
            value={initialData?.variantId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a variant</option>
            {variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.value}
              </option>
            ))}
          </select>
        </div>

        {/* Computed Price After Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price After Discount:
          </label>
          <p className="mt-1 text-lg font-semibold">
            {computePriceAfterDiscount() ? `$${computePriceAfterDiscount()}` : "-"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Updating..." : "Update Product Variant"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductVariant;
