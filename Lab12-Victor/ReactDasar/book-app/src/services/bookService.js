import axios from "axios";
const API_URL = "http://localhost:8000/basic/";

//fungsi mengambil buku
export const getAllBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

//fungsi menambah buku
export const createBook = async (bookData) => {
  try {
    const formData = new FormData();
    formData.append("name", bookData.name);
    formData.append("author", bookData.author);
    formData.append("rating", bookData.rating);

    // Only append cover if it's a File object (new upload)
    if (bookData.cover && typeof bookData.cover !== "string") {
      formData.append("cover", bookData.cover);
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

//fungsi delete buku
export const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}${id}/`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

//fungsi update buku
export const updateBook = async (id, updatedData) => {
  try {
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("author", updatedData.author);
    formData.append("rating", updatedData.rating);

    // Only append cover if it's a File object (new upload)
    if (updatedData.cover && typeof updatedData.cover !== "string") {
      formData.append("cover", updatedData.cover);
    }

    const response = await axios.put(`${API_URL}${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};
