// JavaScript to toggle mobile navigation bar
document.getElementById('toggleButton').addEventListener('click', function () {
    document.getElementById('mobileNav').classList.toggle('hidden');
});

let selectedBook = null;

// Function to render books
function renderBooks(data) {
    const container = document.getElementById("bookContainer");
    container.innerHTML = '';

    if (data.docs && data.docs.length > 0) {
        // Iterate over the first 10 results
        for (let i = 0; i < Math.min(data.docs.length, 10); i++) {
            const book = data.docs[i];

            // Create HTML elements to display the results
            const bookDiv = document.createElement("div");
            bookDiv.style.border = "2px solid orange";
            bookDiv.style.padding = "10px";
            bookDiv.classList.add("bg-white", "p-4", "rounded-md", "max-w-xs", "w-96", "md:w-64", "mb-4", "mr-9");

            const coverImage = document.createElement("img");
            const coverImageUrl = book.isbn && book.isbn.length > 0 ? `http://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg` : "Cover page";
            coverImage.src = coverImageUrl;
            coverImage.alt = "Book Cover";
            coverImage.classList.add("w-full", "h-56", "object-cover", "mb-4", "rounded-md");

            const title = document.createElement("p");
            title.textContent = "Title: " + book.title;
            title.classList.add("text-lg", "font-semibold", "mb-2");

            const publishYear = document.createElement("p");
            publishYear.textContent = "Publish Year: " + (book.publish_year ? book.publish_year[0] : "N/A");
            publishYear.classList.add("text-sm", "text-gray-600", "mb-2");

            const author = document.createElement("p");
            author.textContent = "Author: " + (book.author_name ? book.author_name[0] : "N/A");
            author.classList.add("text-sm", "text-gray-600", "mb-2");

            const addReviewButton = document.createElement("button");
            addReviewButton.textContent = "Add Review";
            addReviewButton.style.backgroundColor = "#f97316";
            addReviewButton.classList.add("text-white", "py-2", "px-4", "rounded-md", "focus:outline-none");
            addReviewButton.addEventListener("click", () => {
                // variable to store the selected book data
                selectedBook = {
                    coverImage: coverImageUrl,
                    title: book.title,
                    author: book.author_name ? book.author_name[0] : "N/A",
                    publishYear: book.publish_year ? book.publish_year[0] : "N/A"
                };

                openModal();
            });

            // Append elements to the container
            bookDiv.appendChild(coverImage);
            bookDiv.appendChild(title);
            bookDiv.appendChild(publishYear);
            bookDiv.appendChild(author);
            bookDiv.appendChild(addReviewButton);

            container.appendChild(bookDiv);
        }
    } else {
        console.log("No results found.");
    }
}

// Function to handle search to Call the Open Library API and render books
function handleSearch() {
    const searchInputValue = document.getElementById("search").value;

    
    fetch("https://openlibrary.org/search.json?q=" + searchInputValue)
        .then(response => response.json())
        .then(data => {
            // Hide loading component
            loadingComponent.style.display = "none";

            renderBooks(data);
        })
        .catch(error => {
            // Hide loading component in case of an error
            loadingComponent.style.display = "none";
            console.error("Error fetching data:", error);
        });
}

// Function to handle API response to see if it is loading results
function handleApiResponse() {
    const loadingComponent = document.getElementById('loadingComponent');
    loadingComponent.style.display = "none";

    // Show loading indicator
    loadingComponent.innerHTML = "Loading...";
    loadingComponent.style.display = 'block';

    // Fetch data from Open Library API and render books
    handleSearch();
}

// Function to add book to local storage with review
function addBookToLibraryWithReview(reviewText) {
    // Check if there is a selected book
    if (selectedBook) {
        // Retrieve existing saved items from local storage
        const existingItems = JSON.parse(localStorage.getItem('savedItems')) || [];

        // Check if the selected book is already in the saved items
        const isBookInLibrary = existingItems.some(item => item.title === selectedBook.title);

        // If the book is not already in the library, add it with the review
        if (!isBookInLibrary) {
            
            existingItems.push({
                ...selectedBook,
                review: reviewText
            });

            // Convert the updated data to JSON
            const jsonString = JSON.stringify(existingItems);

            // Save to local storage
            localStorage.setItem('savedItems', jsonString);

            alert("Book added successfully!")

        }

        // Reset selected book after adding it to the library
        selectedBook = null;
    }

    // Close the modal
    closeModal();
}

// Function to display saved books from local storage
function displaySavedBooks() {
    const container = document.getElementById("displayContainer");
    container.innerHTML = '';

    // Retrieve existing saved items from local storage
    const existingItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Iterate over the existing items and create HTML elements for each
    existingItems.forEach(savedBook => {
        // Create HTML elements for each saved book
        const bookDiv = document.createElement("div");
        bookDiv.style.border = "2px solid orange";
        bookDiv.style.padding = "10px";
        bookDiv.classList.add("bg-white", "p-4", "rounded-md", "max-w-xs", "w-96", "md:w-64", "mb-4", "mr-9");

        const coverImage = document.createElement("img");
        coverImage.src = savedBook.coverImage;
        coverImage.alt = "Book Cover";
        coverImage.classList.add("w-full", "h-56", "object-cover", "mb-4", "rounded-md");

        const title = document.createElement("p");
        title.textContent = "Title: " + savedBook.title;
        title.classList.add("text-lg", "font-semibold", "mb-2");

        const publishYear = document.createElement("p");
        publishYear.textContent = "Publish Year: " + (savedBook.publishYear ? savedBook.publishYear : "N/A");
        publishYear.classList.add("text-sm", "text-gray-600", "mb-2");

        const author = document.createElement("p");
        author.textContent = "Author: " + (savedBook.author ? savedBook.author : "N/A");
        author.classList.add("text-sm", "text-gray-600", "mb-2");

        const review = document.createElement("p");
        review.textContent = "Review: " + (savedBook.review ? savedBook.review : "N/A");
        review.classList.add("text-sm", "text-gray-600", "mb-2");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete book";
        deleteButton.style.backgroundColor = "#f97316";
        deleteButton.classList.add("text-white", "py-2", "px-4", "rounded-md", "focus:outline-none");
        deleteButton.addEventListener("click", () => deleteBook(savedBook.title));

        // Append elements to the container
        bookDiv.appendChild(coverImage);
        bookDiv.appendChild(title);
        bookDiv.appendChild(publishYear);
        bookDiv.appendChild(author);
        bookDiv.appendChild(review);
        bookDiv.appendChild(deleteButton);

        container.appendChild(bookDiv);
    });
}

// Call displaySavedBooks on page load
window.addEventListener('load', function () {
    displaySavedBooks();
});

// Function to delete a book from local storage and display
function deleteBook(title) {
    // Retrieve existing saved items from local storage
    const existingItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Find the index of the book with the specified title
    const bookIndex = existingItems.findIndex(item => item.title === title);

    // If the book is found, remove it from the array
    if (bookIndex !== -1) {
        existingItems.splice(bookIndex, 1);

        // Update local storage with the modified array
        localStorage.setItem('savedItems', JSON.stringify(existingItems));

        // Display the updated list of saved books
        displaySavedBooks();
    }
}



function openModal() {
    const addReviewModal = document.getElementById('addReviewModal');
    addReviewModal.classList.remove('hidden');
}

function closeModal() {
    const addReviewModal = document.getElementById('addReviewModal');
    addReviewModal.classList.add('hidden');
}

// Code related to the "Add Book to Library" button
const addBookButton = document.getElementById("addBookButton");

addBookButton.addEventListener("click", () => {
    // Get the review text from the input field in the modal
    const reviewInput = document.getElementById('reviewInput');
    const reviewText = reviewInput.value;

    // Add the book to the library with the review
    addBookToLibraryWithReview(reviewText);
});
