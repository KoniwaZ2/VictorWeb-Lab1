import React, { useState, useEffect } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookCard";
import { Filter, SearchBook } from "./components/BookForm";
import {
  updateBook,
  deleteBook,
  getAllBooks,
  createBook,
} from "./services/bookService";

function App() {
  const [books, setBooks] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Combine filter and search
  const displayedBooks = books.filter((book) => {
    // Apply rating filter
    const matchesFilter = filter === "all" || book.rating === filter;

    // Apply search query
    const matchesSearch =
      searchQuery === "" ||
      (book.name &&
        book.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.author &&
        book.author.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load books");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (bookToEdit) {
        await updateBook(bookToEdit.id, formData);
        alert("Buku berhasil diperbarui!");
        setBookToEdit(null);
        loadBooks();
      } else {
        await createBook(formData);
        alert("Buku berhasil ditambahkan!");
        loadBooks();
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan saat menyimpan buku!");
    }
  };

  const handleEdit = (book) => {
    setBookToEdit(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setBookToEdit(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteBook(id);
        alert("Buku berhasil dihapus!");
        loadBooks();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Perpustakaan Digital
          </h1>
          <p className="text-gray-600">
            Kelola koleksi buku favoritmu dengan mudah!
          </p>
        </div>

        {/* Form Tambah/Edit Buku */}
        <BookForm
          onSubmit={handleSubmit}
          bookToEdit={bookToEdit}
          onCancel={handleCancelEdit}
        />

        {/* Komponen Pencarian Buku */}
        <SearchBook onSearch={setSearchQuery} />

        {/* Filter daftar buku */}
        <Filter onFilterChange={setFilter} />

        {/* Tampilkan Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">⏳ Memuat data...</p>
          </div>
        )}

        {/* Tampilkan Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Daftar Buku */}
        {!isLoading && !error && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Daftar Buku ({displayedBooks.length})
            </h2>

            {books.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-500">
                  📭 Belum ada buku. Yuk tambah buku pertamamu!
                </p>
              </div>
            ) : displayedBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-500">
                  🔍 Tidak ada buku yang sesuai dengan pencarian atau filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedBooks.map((book) => (
                  <BookList
                    key={book.id}
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
