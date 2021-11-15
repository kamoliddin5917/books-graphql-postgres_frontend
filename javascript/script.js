const modal = document.querySelector(".modal");
const modalX = document.querySelector(".modal_exit");
const myUlBook = document.querySelector(".box");
const formUpdate = document.querySelector(".form_update");
const formCreated = document.querySelector(".form_created");
const formFile = document.querySelector(".form-file");
const inputFile = document.querySelector("#input_file");
const listTemplate = document.querySelector("#list").content;
const newFragmentList = document.createDocumentFragment();

const inputName = document.querySelector(".input-name");
const inputAuthor = document.querySelector(".input-author");
const inputPrice = document.querySelector(".input-price");

const inputNameCreated = document.querySelector(".input_created-name");
const inputAuthorCreated = document.querySelector(".input_created-author");
const inputPriceCreated = document.querySelector(".input_created-price");

let id = 0;
/*
formFile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  console.log(inputFile.files[0]);
  const file = inputFile.files[0];
  const query = `
  mutation($file: Upload!){
    uploadFile(file: $file) {
      url
    }
  }
    `;
  const variables = { file };
  const json = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await json.json();
  console.log(data.data);
});
*/

const grphql = async () => {
  const query = `
  query{
    getBooks {
      id
      created_at
      author
      book_name
      price
    }
  }
  `;
  const json = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await json.json();

  myUlBook.innerHTML = "";

  data.data.getBooks.forEach(async (book) => {
    await renderBook(book);
  });
  await myUlBook.append(newFragmentList);
};

const grphqlPost = async (name, author, price) => {
  const query = `
  mutation($author: String!, $bookName: String!, $price: Int!){
    createBook(author: $author, bookName: $bookName, price: $price) {
      id
      author
      book_name
      price
    }
  }
    `;
  const variables = { bookName: name, author, price: +price };
  const json = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await json.json();
  console.log(data.data);
};

const grphqlPut = async (id, name, author, price) => {
  const query = `
  mutation($updateBookId: Int!, $author: String!, $bookName: String!, $price: Int!){
    updateBook(id: $updateBookId, author: $author, bookName: $bookName, price: $price){
      id
      author
      book_name
      price
      created_at
    }
  }
    `;
  const variables = {
    updateBookId: id,
    bookName: name,
    author,
    price: +price,
  };
  const json = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await json.json();
  console.log(data.data);
};

const grphqlDelete = async (id) => {
  const query = `
  mutation($deleteBookId: Int!){
    deleteBook(id: $deleteBookId){
      id
      author
      book_name
      created_at
      price
    }
  }
    `;
  const variables = { deleteBookId: id };
  const json = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await json.json();
  console.log(data.data);
};

const renderBook = (book) => {
  const listClone = listTemplate.cloneNode(true);

  const cloneName = listClone.querySelector(".box_list-name");
  const cloneAuthor = listClone.querySelector(".box_list-author");
  const clonePrice = listClone.querySelector(".box_list-price");
  const cloneDate = listClone.querySelector(".box_list-date");
  const cloneBtnUpdate = listClone.querySelector(".btn-update");
  const cloneBtnDelete = listClone.querySelector(".btn-delete");

  cloneName.textContent = book.book_name;
  cloneAuthor.textContent = book.author;
  clonePrice.textContent = book.price;
  cloneName.dataset.id = book.id;
  cloneAuthor.dataset.id = book.id;
  clonePrice.dataset.id = book.id;
  cloneDate.textContent = `${new Date(+book.created_at).getDate()}.${
    new Date(+book.created_at).getMonth() + 1
  }.${new Date(+book.created_at).getFullYear()}`;
  cloneBtnUpdate.dataset.id = book.id;
  cloneBtnDelete.dataset.id = book.id;

  newFragmentList.appendChild(listClone);

  cloneBtnUpdate.addEventListener("click", modalClose);
  cloneBtnDelete.addEventListener("click", deletedList);
};

const modalClose = (evt) => {
  modal.classList.add("modal-active");

  id = +evt.target.dataset.id;

  document.querySelectorAll(".box_list-name").forEach((list) => {
    if (list.dataset.id == id) {
      inputName.value = list.textContent;
    }
  });
  document.querySelectorAll(".box_list-author").forEach((list) => {
    if (list.dataset.id == id) {
      inputAuthor.value = list.textContent;
    }
  });
  document.querySelectorAll(".box_list-price").forEach((list) => {
    if (list.dataset.id == id) {
      inputPrice.value = list.textContent;
    }
  });

  formUpdate.addEventListener("submit", bookUpdate);
};

const bookUpdate = (e) => {
  e.preventDefault();

  grphqlPut(id, inputName.value, inputAuthor.value, inputPrice.value);

  inputName.value = "";
  inputAuthor.value = "";
  inputPrice.value = "";

  modal.classList.remove("modal-active");
};
const deletedList = (evt) => {
  id = +evt.target.dataset.id;
  grphqlDelete(id);
};

const createdBook = (evt) => {
  evt.preventDefault();

  grphqlPost(
    inputNameCreated.value,
    inputAuthorCreated.value,
    inputPriceCreated.value
  );

  inputNameCreated.value = "";
  inputAuthorCreated.value = "";
  inputPriceCreated.value = "";
};

const modalExit = (evt) => {
  if (evt.target === modal || evt.target === modalX) {
    modal.classList.remove("modal-active");
  }
};
formCreated.addEventListener("submit", createdBook);
modal.addEventListener("click", modalExit);
grphql();
