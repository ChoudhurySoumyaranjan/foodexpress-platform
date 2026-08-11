import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories } from "../../api/service/categoryService";
import { addFood, fetchAllFoods, updateFood } from "../../api/service/foodService";
import Food from "../../components/Food";
import Loader from "../../components/Loader";
import { ImagePlus, X } from "lucide-react";

export default function AdminFoodPage() {
  const [food, setFood] = useState({
    foodName: "",
    categoryId: "",
    description: "",
    price: 0,
    stock: 0,
    discount: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);

  const fetchFoods = async () => {
    try {
      const res = await fetchAllFoods();
      setFoods(res.data || []);
    } catch {
      toast.error("Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleFoodChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleFoodImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddFoodFormSubmission = async (e) => {
    e.preventDefault();
    if (!food.foodName.trim()) return toast.error("Food name required");
    if (!food.categoryId) return toast.error("Select category");

    const formData = new FormData();
    setActionLoading(true);

    if (image) formData.append("image", image);

    formData.append(
      "food",
      JSON.stringify({
        foodName: food.foodName,
        categoryId: Number(food.categoryId),
        description: food.description,
        price: Number(food.price),
        stock: Number(food.stock),
        discount: Number(food.discount),
      }),
    );

    try {
      const res = await addFood(formData);
      if (res.status === 201) {
        toast.success("Food added successfully");
        fetchFoods();
        setFood({
          foodName: "",
          categoryId: "",
          description: "",
          price: 0,
          stock: 0,
          discount: 0,
        });
        setImage(null);
        setPreview(null);
      }
    } catch {
      toast.error("Error adding food");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (foodItem) => {
    const matchedCategory = categories.find(
      (c) => c.name === foodItem.categoryName,
    );
    setSelectedFood({
      ...foodItem,
      categoryId: matchedCategory ? matchedCategory.id : "",
    });
    setEditPreview(foodItem.imageUrl);
    setEditImage(null);
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedFood({
      ...selectedFood,
      [e.target.name]: e.target.value,
    });
  };

  const handleFoodEditForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "food",
        JSON.stringify({
          foodName: selectedFood.foodName,
          categoryId: selectedFood.categoryId,
          description: selectedFood.description,
          price: selectedFood.price,
          stock: selectedFood.stock,
          discount: selectedFood.discount,
        }),
      );
      if (editImage) formData.append("image", editImage);

      const res = await updateFood(selectedFood.id, formData);
      if (res.status === 200) {
        toast.success("Food updated successfully");
        fetchFoods();
      }
      setShowModal(false);
      setSelectedFood(null);
      setEditImage(null);
      setEditPreview(null);
    } catch {
      toast.error("Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const inputClass = `
    w-full rounded-xl border border-gray-200 bg-gray-50/50
    px-3.5 py-2.5 text-sm text-gray-800
    outline-none
    focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100
    transition
  `;

  return (
    <div className="space-y-6">
      {actionLoading && <Loader />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Foods
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your restaurant menu items
          </p>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
          {foods.length} item{foods.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Add Food Form ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-fit overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Add New Food
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the details to add a menu item
            </p>
          </div>

          <form
            onSubmit={handleAddFoodFormSubmission}
            className="p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Food Name
              </label>
              <input
                name="foodName"
                value={food.foodName}
                onChange={handleFoodChange}
                placeholder="e.g. Chicken Biryani"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Category
              </label>
              <select
                name="categoryId"
                value={food.categoryId}
                onChange={handleFoodChange}
                required
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={food.price}
                  onChange={handleFoodChange}
                  min="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={food.stock}
                  onChange={handleFoodChange}
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={food.discount}
                onChange={handleFoodChange}
                min="0"
                max="100"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                name="description"
                value={food.description}
                onChange={handleFoodChange}
                placeholder="Short description..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Food Image
              </label>
              <label
                className="
                  flex flex-col items-center justify-center gap-2
                  w-full rounded-xl border-2 border-dashed border-gray-200
                  bg-gray-50/50 py-5 cursor-pointer
                  hover:border-orange-300 hover:bg-orange-50/30
                  transition
                "
              >
                <ImagePlus size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {image ? image.name : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoodImage}
                  className="hidden"
                />
              </label>
              {preview && (
                <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className={`
                w-full py-2.5 rounded-xl text-sm font-semibold text-white transition
                ${
                  actionLoading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200"
                }
              `}
            >
              {actionLoading ? "Adding..." : "Add Food"}
            </button>
          </form>
        </div>

        {/* ── Food List ── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Food Menu
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {foods.length} item{foods.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : foods.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <ImagePlus size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  No food items yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Add your first menu item to get started
                </p>
              </div>
            ) : (
              foods.map((f) => (
                <Food
                  key={f.id}
                  food={f}
                  handleEdit={handleEdit}
                  updateDeleteLocal={(id) =>
                    setFoods((prev) => prev.filter((item) => item.id !== id))
                  }
                  setActionLoading={setActionLoading}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {showModal && selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Food
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update menu item details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleFoodEditForm}
              className="max-h-[75vh] overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Food Name
                </label>
                <input
                  type="text"
                  name="foodName"
                  value={selectedFood.foodName || ""}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={selectedFood.categoryId || ""}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={selectedFood.description || ""}
                  onChange={handleEditChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={selectedFood.price || ""}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={selectedFood.stock || ""}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={selectedFood.discount || ""}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Food Image
                </label>
                <label
                  className="
                    flex flex-col items-center justify-center gap-2
                    w-full rounded-xl border-2 border-dashed border-gray-200
                    bg-gray-50/50 py-4 cursor-pointer
                    hover:border-orange-300 hover:bg-orange-50/30
                    transition
                  "
                >
                  <ImagePlus size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {editImage ? editImage.name : "Upload new image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditImage(file);
                        setEditPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {(editPreview || selectedFood.imageUrl) && (
                  <img
                    src={editPreview || selectedFood.imageUrl}
                    alt="Preview"
                    className="mt-3 h-20 w-20 rounded-xl border border-gray-100 object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium text-white transition
                    ${
                      actionLoading
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200"
                    }
                  `}
                >
                  {actionLoading ? "Updating..." : "Update Food"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
