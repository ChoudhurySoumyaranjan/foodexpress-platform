import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateCategory } from "../api/service/categoryService";

export default function EditCategoryModal({ isOpen, onClose, category, refresh }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (category) {
    //   setName(category.name);
    //   setPreview(category.image);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);

      formData.append(
        "category",
        JSON.stringify({ name })
      );

      await updateCategory(category.id, formData);

      toast.success("Category Updated Successfully");
      refresh(); // reload list
      onClose(); // close modal
    } catch (error) {
      toast.error(error?.response?.data || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Edit Category
        </h2>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg mb-4"
          />

          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded-lg mb-4"
          />

          {preview && (
            <img
              src={preview}
              className="w-24 h-24 object-cover rounded mb-4 mx-auto"
            />
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Update
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}