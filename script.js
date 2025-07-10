// script.js (completo com favoritos)

async function pesquisarCarro() {
  const campo = document.getElementById('campoPesquisa').value.trim().toLowerCase();
  const resultadoDiv = document.getElementById('resultado');

  if (!campo) {
    resultadoDiv.innerHTML = "<p class='error'>Digite algo para pesquisar.</p>";
    return;
  }

  try {
    resultadoDiv.innerHTML = "<p class='loading'>🔍 Buscando marca...</p>";

    const resposta = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
    const dados = await resposta.json();

    const marcas = dados.Results;

    const marcaEncontrada = marcas.find(marca => marca.Make_Name.toLowerCase() === campo);

    if (marcaEncontrada) {
      const marcaNome = marcaEncontrada.Make_Name;
      const logoUrl = `https://logo.clearbit.com/${marcaNome.replace(/ /g, '').toLowerCase()}.com`;

      resultadoDiv.innerHTML = `
        <h3>${marcaNome}</h3>
        <p class="success">✅ Marca encontrada na base oficial NHTSA!</p>
        <img src="${logoUrl}" alt="Logo da marca" onerror="this.style.display='none'" />
        <button onclick="favoritarMarca('${marcaNome}')" class="btn-favoritar">⭐ Favoritar</button>
      `;

      let historico = JSON.parse(localStorage.getItem('historicoNHTSA')) || [];
      if (!historico.includes(marcaNome)) {
        historico.unshift(marcaNome);
        if (historico.length > 10) historico.pop();
        localStorage.setItem('historicoNHTSA', JSON.stringify(historico));
      }
    } else {
      resultadoDiv.innerHTML = "<p class='error'>❌ Marca não encontrada.</p>";
    }
  } catch (erro) {
    resultadoDiv.innerHTML = "<p class='error'>⚠️ Erro ao buscar dados. Verifique sua conexão.</p>";
    console.error(erro);
  }
}

function favoritarModelo(nomeModelo, acao) {
  let favoritos = JSON.parse(localStorage.getItem("favoritosModelos")) || [];

  if (acao === "add") {
    if (!favoritos.includes(nomeModelo)) {
      favoritos.push(nomeModelo);
      alert(`⭐ Modelo "${nomeModelo}" adicionado aos favoritos!`);
    } else {
      alert(`⚠️ Modelo "${nomeModelo}" já está nos favoritos.`);
    }
  }

  localStorage.setItem("favoritosModelos", JSON.stringify(favoritos));
}

function carregarFavoritos() {
  const lista = document.getElementById("listaFavoritos");
  let favoritos = JSON.parse(localStorage.getItem("favoritosModelos")) || [];

  if (favoritos.length === 0) {
    lista.innerHTML = "<li>❌ Nenhum modelo favorito ainda.</li>";
    return;
  }

  lista.innerHTML = favoritos.map(modelo => `<li>${modelo}</li>`).join("");
}

function limparFavoritos() {
  localStorage.removeItem("favoritosModelos");
  carregarFavoritos();
}
function carregarHistorico() {
  const listaNHTSA = document.getElementById("listaHistoricoNHTSA");
  const listaFIPE = document.getElementById("listaHistoricoFIPE");

  // Carregar histórico NHTSA
  const historicoNHTSA = JSON.parse(localStorage.getItem("historicoNHTSA")) || [];
  if (listaNHTSA) {
    if (historicoNHTSA.length === 0) {
      listaNHTSA.innerHTML = "<li>❌ Nenhuma marca pesquisada.</li>";
    } else {
      listaNHTSA.innerHTML = historicoNHTSA.map(marca => `<li>${marca}</li>`).join("");
    }
  }

  // Carregar histórico FIPE
  const historicoFIPE = JSON.parse(localStorage.getItem("historicoFIPE")) || [];
  if (listaFIPE) {
    if (historicoFIPE.length === 0) {
      listaFIPE.innerHTML = "<li>❌ Nenhum modelo consultado.</li>";
    } else {
      listaFIPE.innerHTML = historicoFIPE.map(item => `
        <li>
          <strong>${item.modelo}</strong><br/>
          Valor: ${item.valor}<br/>
          Referência: ${item.referencia}
        </li>
      `).join("");
    }
  }
}

function limparHistorico() {
  localStorage.removeItem("historicoNHTSA");
  localStorage.removeItem("historicoFIPE");
  carregarHistorico();
}

// Só executa se estiver na página com histórico
if (
  document.getElementById("listaHistoricoNHTSA") ||
  document.getElementById("listaHistoricoFIPE")
) {
  window.addEventListener("load", carregarHistorico);
}
