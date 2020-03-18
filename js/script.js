// VARIABLES
const localLibrary = JSON.parse(localStorage.getItem('library') || '[]');
const table = document.querySelector("#table");
const addBook = document.querySelector(".addBook");
const statusForm = document.querySelector(".statusFormBtn");
const nameForm = document.getElementsByName("name");
const authorForm = document.getElementsByName("author");
const pagesForm = document.getElementsByName("pages");
const submitForm = document.querySelector(".submitBtn");
const cancelForm = document.querySelector(".cancelBtn")
const form = document.querySelector(".form");
let readBtns = document.querySelectorAll(".status");
let deleteBtns = document.querySelectorAll(".delete");
let library = [];


// EVENT LISTENERS
addBook.addEventListener("click", () => closeOpenForm());

cancelForm.addEventListener("click", () => closeOpenForm());

window.addEventListener('load', () => {
    library = [];
    localLibrary.forEach((book) => {
      library.push(book);
    });
    addToTable(library);
});

submitForm.addEventListener("click", function(event) {
    event.preventDefault();
    let newBook = new mkBook(nameForm[0].value.toString(), authorForm[0].value, pagesForm[0].value, statusForm.value);
    
    // Form validations
    if (isInLibrary(newBook, library) == true) {
        alert("Error: Book already in library");
    } else if (nameForm[0].value == "" || authorForm[0].value == "" || pagesForm[0].value == "" || pagesForm[0].value <= 0) {
        alert("Error: Empty or negative input");
    } else if (nameForm[0].value.length > 26 || authorForm[0].value.length > 26 || pagesForm[0].value.length > 26 || parseInt(pagesForm[0].value) > 9999) {
        if (parseInt(pagesForm[0].value) > 8000) {
            alert("Error: more than 8000 pages");
        } else {
            alert("Error: input longer than 26");
        }
    // On successful validation add book to the table and hide form
    } else {
        addToLibrary(newBook);
        clearTable();
        addToTable(library);
        closeOpenForm();
        document.documentElement.scrollTop = document.body.scrollHeight;
    }
});


// FUNCTIONS
function clearTable() {
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
}

function checkOverflow() {
    // Hides and shows overflow
    if (library.length >= 11) {
        document.body.style.overflow = "auto";
    } else {
        document.documentElement.scrollTop = 0;
        document.body.style.overflow = "hidden";
    }
}

function changeStatusForm() {
    // Changes only the form read button status
    if (statusForm.value == "Read") {
        statusForm.value = "Not Read";
    } else {
        statusForm.value = "Read";
    }
}

class mkBook {
    constructor(name, author, pages, status) {
        this.name = name;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

function clearForm() {
    nameForm[0].value = "";
    authorForm[0].value = "";
    pagesForm[0].value = "";
    statusForm.value = "Read";
}

function closeOpenForm() {
    // Closes or opens form
    if (form.style.visibility == "hidden") {
        form.style.visibility = "visible";
        document.documentElement.scrollTop = 0;
        document.body.style.overflow = "hidden";
        clearForm();
    } else {
        form.style.visibility = "hidden";
        checkOverflow();
        clearForm();
    }
}

function addToLibrary(book) {
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
}

function isInLibrary(book, library) {
    for (let m = 0; m < library.length; m++) {
        if (library[m].name == book.name) {
            return true;
        }
    }
    return false;
}

function attachTableListeners() {
    // Event listener function
    readBtns = document.querySelectorAll(".status");
    readBtns.forEach((btn) => {
        btn.addEventListener("click", function(event) {  
            // Changes status button's status and updates library
            if (event.target.textContent == "Read") {
                event.target.textContent = "Not Read";
                library[btn.dataset.pos].status = "Not Read";
                localStorage.setItem('library', JSON.stringify(library));
            } else {
                event.target.textContent = "Read";
                library[btn.dataset.pos].status = "Read";
                localStorage.setItem('library', JSON.stringify(library));
            }
        });
    });

    deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((delBtn) => {
        delBtn.addEventListener("click", function(event) {
            // Removes book from table and updates library
            library.splice(delBtn.dataset.pos, 1);
            checkOverflow();
            localStorage.setItem('library', JSON.stringify(library));
            clearTable();
            addToTable(library);
        });
    });
}

function addToTable(library) {
    for (let y = 0; y < library.length; y++) {   
        table.insertRow(-1);
        for (let n = 0; n < 5; n++) {
            table.rows[table.rows.length - 1].insertCell(-1);
        }
        let cell = table.rows[table.rows.length - 1].cells;

        cell[0].innerHTML = library[y].name;
        cell[0].classList.add("dName");

        cell[1].innerHTML = library[y].author;
        cell[1].classList.add("dAuthor");

        cell[2].innerHTML = library[y].pages;
        cell[2].classList.add("dPages");

        cell[3].innerHTML = `<button class="status" data-pos="${y}">${library[y].status}</button>`;
        cell[3].classList.add("dStatus");

        cell[4].innerHTML = `<button data-pos="${y}" class="delete">X</button>`;
        cell[4].classList.add("dDelete");

        checkOverflow();
    }
    attachTableListeners();
}

