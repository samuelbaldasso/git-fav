async function getUserData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message);
    }
    return {
      avatar: data.avatar_url,
      name: data.name || "Sem nome",
      username: data.login,
      repos: data.public_repos,
      followers: data.followers,
    };
  } catch (error) {
    alert(`Erro ao obter dados. Erro: ${error.message}`);
  }
}

function addUser() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (username) {
    getUserData(username).then((dataLS) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userFiltered = users.some(
        (user) => user.username === dataLS.username
        );
        if (!userFiltered) {
          users.push(dataLS);
          localStorage.setItem("users", JSON.stringify(users));
          insertUserToTable(dataLS);
      }
      checkTableEmpty();
    });
  }
}

function removeRow(button) {
  const row = button.parentNode.parentNode;
  const usernameElem = row.querySelector(".data p:last-child");
  const username = usernameElem.innerText.slice(1); // to remove the '/' prefix

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const updatedUsers = users.filter((user) => user.username !== username);

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  row.parentNode.removeChild(row);
  checkTableEmpty();
}

function checkTableEmpty() {
  const emptyDiv = document.querySelector(".empty-state");
  const dataLS = JSON.parse(localStorage.getItem("users") || "[]");
  if (dataLS.length === 0) {
    emptyDiv.classList.remove("hide");
  } else {
    emptyDiv.classList.add("hide");
  }
}

function insertUserToTable(user) {
  const table = document.getElementById("userTable");
  const row = table.insertRow();

  row.insertCell(
    0
  ).innerHTML = `<div class="user"><img src=${user.avatar}><div class="data"><p>${user.name}</p><p>/${user.username}</p></div></div>`;
  row.insertCell(1).innerHTML = user.repos;
  row.insertCell(2).innerHTML = user.followers;
  row.insertCell(
    3
  ).innerHTML = `<a class="remove" onclick="removeRow(this)">Remover</a>`;
}

function populateTable() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (Array.isArray(users)) {
    users.forEach((user) => {
      insertUserToTable(user);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  populateTable();
  checkTableEmpty();
});
