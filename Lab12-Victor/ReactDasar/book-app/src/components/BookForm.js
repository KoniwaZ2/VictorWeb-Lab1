import React, { useState, useEffect, useRef } from "react";

function BookForm({ onSubmit, bookToEdit, onCancel }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    rating: "average",
    cover: "",
  });
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        name: bookToEdit.name || "",
        author: bookToEdit.author || "",
        rating: bookToEdit.rating || "average",
        cover: bookToEdit.cover || "",
      });
    } else {
      // Reset form when bookToEdit is null (after cancel)
      setFormData({
        name: "",
        author: "",
        rating: "average",
        cover: "",
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? (files && files[0] ? files[0] : "") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      author: "",
      rating: "average",
      cover: "",
    });
    // Reset file input after submit
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-600">
        {bookToEdit ? "Edit Book" : "Add New Book"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="nama"
          >
            Book Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Judul Buku"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="author"
          >
            Author:
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pengarang"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="rating"
          >
            Rating:
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="excellent">Excellent</option>
            <option value="average">Average</option>
            <option value="bad">Bad</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="cover"
          >
            Cover:
          </label>
          <input
            type="file"
            name="cover"
            ref={fileInputRef}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
          {formData.cover && (
            <div className="mt-2">
              {typeof formData.cover === "string" ? (
                // Existing cover URL from server
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current cover:</p>
                  <img
                    src={formData.cover}
                    alt="Book cover preview"
                    className="w-32 h-40 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-32 h-40 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-500 text-xs text-center p-2"
                    style={{ display: "none" }}
                  >
                    📷
                    <br />
                    Image not available
                  </div>
                </div>
              ) : (
                // Newly selected file
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Selected: {formData.cover.name}
                  </p>
                  <img
                    src={URL.createObjectURL(formData.cover)}
                    alt="Book cover preview"
                    className="w-32 h-40 object-cover rounded border border-gray-300"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {bookToEdit ? "Update Book" : "Add Book"}
          </button>
          {bookToEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Filter({ onFilterChange }) {
  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label
        className="block text-gray-700 font-semibold mb-2"
        htmlFor="filter"
      >
        Filter by Rating:
      </label>
      <select
        name="filter"
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="excellent">Excellent</option>
        <option value="average">Average</option>
        <option value="bad">Bad</option>
      </select>
    </div>
  );
}

function SearchBook({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-6">
      <label
        className="block text-gray-700 font-semibold mb-2"
        htmlFor="search"
      >
        Search Books:
      </label>
      <input
        type="text"
        name="search"
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by book name or author"
      />
    </div>
  );
}

export default BookForm;
export { Filter, SearchBook };
