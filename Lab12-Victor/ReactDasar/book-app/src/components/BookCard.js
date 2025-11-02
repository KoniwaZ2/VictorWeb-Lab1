import React from "react";

// Helper function to get full image URL
const getImageUrl = (coverPath) => {
  if (!coverPath) {
    console.log("No cover path provided");
    return "";
  }

  console.log("Original cover path:", coverPath);

  // If it's already a full URL, return as is
  if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
    console.log("Full URL detected:", coverPath);
    return coverPath;
  }

  // Backend base URL
  const baseURL = "http://localhost:8000";

  // Handle different path formats
  let fullURL;
  if (coverPath.startsWith("/media/")) {
    // Path already includes /media/
    fullURL = `${baseURL}${coverPath}`;
  } else if (coverPath.startsWith("media/")) {
    // Path has media/ without leading slash
    fullURL = `${baseURL}/${coverPath}`;
  } else if (coverPath.startsWith("/")) {
    // Path has leading slash but no media - add media
    fullURL = `${baseURL}/media${coverPath}`;
  } else {
    // No leading slash, no media - add both
    fullURL = `${baseURL}/media/${coverPath}`;
  }

  console.log("Constructed URL:", fullURL);
  return fullURL;
};

function BookCard({ book, onEdit, onDelete }) {
  // Fungsi untuk tampilkan rating dengan emoji
  const getRatingDisplay = (rating) => {
    switch (rating) {
      case "excellent":
        return "⭐⭐⭐ Sangat Bagus";
      case "average":
        return "⭐⭐ Biasa";
      case "bad":
        return "⭐ Kurang Bagus";
      default:
        return "⭐⭐ Biasa";
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      {/* Cover Buku */}
      {book.cover ? (
        <div className="mb-4">
          <img
            src={getImageUrl(book.cover)}
            alt={`${book.name} cover`}
            className="w-full h-48 object-cover rounded"
            onError={(e) => {
              console.error(
                "❌ Image failed to load:",
                getImageUrl(book.cover)
              );
              console.error("Original path from API:", book.cover);
              // Replace with placeholder
              e.target.src =
                "https://via.placeholder.com/400x300/cccccc/666666?text=Cover+Tidak+Tersedia";
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
        </div>
      ) : (
        <div className="mb-4 w-full h-48 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-4xl">📚</span>
        </div>
      )}

      {/* Judul Buku */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">📚 {book.name}</h3>

      {/* Penulis */}
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Penulis:</span> {book.author}
      </p>

      {/* Rating */}
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Rating:</span>{" "}
        {getRatingDisplay(book.rating)}
      </p>

      {/* Tanggal Upload */}
      <p className="text-gray-500 text-sm mb-4">
        Ditambahkan: {formatDate(book.uploaded)}
      </p>

      {/* Tombol Edit dan Hapus */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(book)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          🗑️ Hapus
        </button>
      </div>
    </div>
  );
}

export default BookCard;
