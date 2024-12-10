/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/livros_list';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.livros.forEach(livro => insertList(livro.nome, livro.autor, livro.quantidade, livro.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputBook, inputAuthor, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputBook);
  formData.append('autor', inputAuthor);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/livro_adiciona';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um livro da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('booksTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeLivro = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeLivro)
        alert("Livro Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/livro_del?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para tratamento de erros no nome do livro.
  --------------------------------------------------------------------------------------
*/
const isValidName = (name) => {
  const trimmedName = name.trim();

  // Regra 1: Comprimento mínimo e máximo
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return false;
  }

  // Regra 2: Permitir apenas letras, espaços, e alguns caracteres comuns
  const validNameRegex = /^[a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ\s\-'\.]+$/;
  if (!validNameRegex.test(trimmedName)) {
    return false;
  }

  // Regra 3: Não permitir nomes compostos apenas por espaços ou caracteres repetitivos
  const uniqueChars = new Set(trimmedName);
  if (uniqueChars.size <= 1) {
    return false;
  }

  // Regra 4: Nomes não podem conter números
  if (/\d/.test(trimmedName)) {
    return false;
  }

  return true;
};

/*
  -----------------------------------------------------------------------------
  Função para adicionar livro, autor, quantidade e preço
  -----------------------------------------------------------------------------
*/
const newItem = () => {
  let inputBook = document.getElementById("newBook").value;
  let inputAuthor = document.getElementById("newAuthor").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  // Validação de nomes
  if (!isValidName(inputBook)) {
    alert("Nome do livro inválido! Certifique-se de que ele é válido.");
    return;
  }
  if (!isValidName(inputAuthor)) {
    alert("Nome do autor inválido! Certifique-se de que ele é válido.");
    return;
  }

  if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    // Verifica duplicatas (como no código anterior)
    const table = document.getElementById('booksTable');
    let isDuplicate = false;

    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const existingBook = row.cells[0].textContent;

      if (existingBook.trim().toLowerCase() === inputBook.trim().toLowerCase()) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      alert("Este livro já está cadastrado na lista!");
    } else {
      insertList(inputBook, inputAuthor, inputQuantity, inputPrice);
      postItem(inputBook, inputAuthor, inputQuantity, inputPrice);
      alert("Livro adicionado!");
    }
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameBook, author, quantity, price) => {
  var item = [nameBook, author, quantity, price]
  var table = document.getElementById('booksTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newBook").value = "";
  document.getElementById("newAuthor").value="";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}