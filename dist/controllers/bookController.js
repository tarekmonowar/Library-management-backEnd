import ErrorHandler from "../utils/ErrorHandler.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";
import connectDB from "../utils/db.js";
// --------------------------------------------Create a new book-----------------------------------
export const createBook = async (req, res, next) => {
    try {
        await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
        const bookData = req.body;
        console.log(bookData);
        if (!bookData.title ||
            !bookData.author ||
            !bookData.genre ||
            !bookData.isbn ||
            !bookData.copies ||
            bookData.copies < 1 ||
            !bookData.available) {
            return next(new ErrorHandler("Title, Author, Genre, ISBN, Copies, and Availability are required", 400));
        }
        const newBook = await Book.create(bookData);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            next(new ErrorHandler("Validation failed", 400));
        }
        else if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
// -----------------------------------------------Get all books------------------------------
export const getAllBooks = async (req, res, next) => {
    try {
        await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            books,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
//----------------------------------------------get book by id---------------------------------
export const getBookById = async (req, res, next) => {
    try {
        await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);
        if (!book) {
            return next(new ErrorHandler("Book not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            book,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
//----------------------------------------------update book by id-------------------------------
export const updateBookById = async (req, res, next) => {
    try {
        await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
        const bookId = req.params.bookId;
        const bookData = req.body;
        const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            return next(new ErrorHandler("Book not found", 404));
        }
        // Update availability after updating the book if it false
        updatedBook.updateAvailability();
        await updatedBook.save();
        // Return the updated book
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            next(new ErrorHandler("Validation failed", 400));
        }
        else if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
//-----------------------------------------------------Delete book by id-------------------------------------------
export const deleteBookById = async (req, res, next) => {
    try {
        await connectDB(); // hi PH Instructor without this it cannot works in vercel see buffering timed out that's why i call here
        const bookId = req.params.bookId;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return next(new ErrorHandler("Book not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: deletedBook,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            next(new ErrorHandler(error.message, 400));
        }
        else {
            next(new ErrorHandler("Something went wrong", 400));
        }
    }
};
