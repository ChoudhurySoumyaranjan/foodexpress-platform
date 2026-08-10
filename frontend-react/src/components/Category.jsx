import { toast } from "react-toastify";
import { deleteCategory } from "../api/service/categoryService";
import { Pencil, Trash2 } from "lucide-react";

const Category = ({
  data,
  updateDeleteLocal,
  handleEdit,
  setActionLoading,
}) => {
  const { id, image, name } = data;

  const handleDeleteCategory = async (id) => {
    setActionLoading(true);
    try {
      const response = await deleteCategory(id);
      if (response.status === 204 || response.status === 200) {
        toast.success("Category deleted successfully");
        updateDeleteLocal(id);
      }
    } catch (error) {
      toast.error(
        "Failed to delete category: " +
          (error.response?.data?.message || "Something went wrong"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-orange-50/40 transition-colors">
      {/* Left: Image + Name */}
      <div className="flex items-center gap-3.5 min-w-0">
        <img
          src={image}
          alt={name}
          className="w-11 h-11 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">#{id}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => handleEdit(data)}
          title="Edit"
          className="
            flex items-center gap-1.5
            px-3 py-1.5 rounded-xl text-xs font-medium
            bg-blue-50 text-blue-600 border border-blue-100
            hover:bg-blue-100 transition
          "
        >
          <Pencil size={13} />
          Edit
        </button>

        <button
          onClick={() => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this category?",
            );
            if (confirmDelete) {
              handleDeleteCategory(id);
            }
          }}
          title="Delete"
          className="
            flex items-center gap-1.5
            px-3 py-1.5 rounded-xl text-xs font-medium
            bg-red-50 text-red-600 border border-red-100
            hover:bg-red-100 transition
          "
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default Category;
