import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addCategory,
  editCategory,
  getPaginatedCategories
} from "../../api/service/categoryService";

import Category from "../../components/Category";
import Loader from "../../components/Loader";
import { ImagePlus, X } from "lucide-react";
import { CrueltyFree } from "@mui/icons-material";

export default function AdminCategoryPage() {
  const [categoryName, setCategoryName] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const handleEdit = (cat) => {
    setShowModal(true);
    setSelectedCategory(cat);
    setEditPreview(cat.image);
    setEditImage(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await getPaginatedCategories(currentPage,pageSize);
      if (response.status === 200) {
        setCategories(response.data.content || null);
        setPageSize(response.data.size);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage,pageSize]);

  const updateDeleteLocal = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleAddCategoryName = (e) => {
    setCategoryName({
      ...categoryName,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditCategoryForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "category",
        JSON.stringify({ name: selectedCategory.name }),
      );
      if (editImage) {
        formData.append("image", editImage);
      }
      await editCategory(selectedCategory.id, formData);
      setShowModal(false);
      toast.success("Category updated successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddCategoryFormSubmission = async (e) => {
    e.preventDefault();
    if (!categoryName.name || !image) {
      return toast.warning("Name and image are required");
    }
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("category", JSON.stringify(categoryName));
      await addCategory(formData);
      setCategoryName({ name: "" });
      setImage(null);
      setPreview(null);
      toast.success("Category added successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data || "Failed to add category");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePreviousPageRequest = ()=>{
    if(currentPage>0){
      setCurrentPage((prev)=>{return prev-1});
    }
  }

  const handleNextPageRequest=()=>{
    if(currentPage<totalPages-1){
      setCurrentPage((prev)=>prev+1);
    }
  }

  return (
    <div className="space-y-6">
      {actionLoading && <Loader />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your restaurant food categories
          </p>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Add Category ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Add New Category
          </h2>

          <form
            onSubmit={handleAddCategoryFormSubmission}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={categoryName.name}
                onChange={handleAddCategoryName}
                placeholder="e.g. Biryani, Pizza, Desserts"
                className="
                  w-full rounded-xl border border-gray-200 bg-gray-50/50
                  px-3.5 py-2.5 text-sm text-gray-800
                  outline-none
                  focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100
                  transition
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Category Image
              </label>
              <label
                className="
                  flex flex-col items-center justify-center gap-2
                  w-full rounded-xl border-2 border-dashed border-gray-200
                  bg-gray-50/50 py-6 cursor-pointer
                  hover:border-orange-300 hover:bg-orange-50/30
                  transition
                "
              >
                <ImagePlus size={22} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {image ? image.name : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImage}
                  className="hidden"
                />
              </label>
            </div>

            {preview && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className={`
                w-full py-2.5 rounded-xl text-sm font-semibold text-white
                transition
                ${
                  actionLoading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200"
                }
              `}
            >
              {actionLoading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* ── Category List ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              All Categories
            </h2>
            <span className="text-xs text-gray-400">
              {categories.length} item{categories.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                <ImagePlus size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base font-medium text-gray-700">
                No categories yet
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Add your first category to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <Category
                  key={cat.id}
                  data={cat}
                  updateDeleteLocal={updateDeleteLocal}
                  handleEdit={handleEdit}
                  setActionLoading={setActionLoading}
                />
              ))}
            </div>
          )}

          {!loading && totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              {/* Page information */}
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-700">
                  {currentPage + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalPages}
                </span>
              </p>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={handlePreviousPageRequest}
                  disabled={currentPage === 0}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-50
                   disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={()=>{setCurrentPage(index)}}
                    className={`rounded-lg px-4 py-2 text-sm font-medium
            ${
              currentPage === index
                ? "bg-[#FC8019] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={handleNextPageRequest}
                  disabled={currentPage === totalPages - 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-50
                   disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Category
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditCategoryForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-xl border border-gray-200 bg-gray-50/50
                    px-3.5 py-2.5 text-sm
                    outline-none
                    focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100
                    transition
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Replace Image
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
                    {editImage ? editImage.name : "Click to upload new image"}
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
              </div>

              {editPreview && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={editPreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    px-4 py-2 rounded-xl text-sm font-medium
                    border border-gray-200 text-gray-600
                    hover:bg-gray-50 transition
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium text-white
                    transition
                    ${
                      actionLoading
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200"
                    }
                  `}
                >
                  {actionLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
