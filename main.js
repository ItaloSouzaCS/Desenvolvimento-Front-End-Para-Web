// ======================== Menu Colapsible ===============================

document.querySelectorAll('.nav__toggler').forEach(toggler => {
  toggler.addEventListener('click', function (e) {
    const collapsible = this.closest('.collapsible');
    if (!collapsible) return;
    collapsible.classList.toggle('collapsible--expanded');
  });
});

// ======================== Botão cadastro na página Início e Projetos ============================
document.addEventListener('click', function (e) {
  if (e.target && e.target.matches('.btn-link-cadastro')) {
    window.location.hash = '#/cadastro';
  }

});

// ======================== Botão next plan ============================
let htmlPlanList = [];
let planAtual = 0;
let voluntarios = []

document.addEventListener('click', function (e) {
  
  if (e.target && e.target.matches('.btn--next-plan')) {
    const tabelaContainer = document.querySelectorAll('.tabelaVoluntarios');
    if (!tabelaContainer) return;

    showNextPlan();
  }
});

function showNextPlan() {
  if (htmlPlanList.length === 0) return;
  const tabelaContainer = document.querySelector('.tabelaVoluntarios');
  if (planAtual >= htmlPlanList.length) planAtual = 0;
  tabelaContainer.innerHTML = htmlPlanList[planAtual];
  planAtual++;
}

// ==================== ROTAS ====================
const routes = {
  '/': 'pages/home.html',
  '/projetos': 'pages/projetos.html',
  '/cadastro': 'pages/cadastro.html'
};

// ==================== FUNÇÃO DE ROTEAMENTO ====================
async function loadRoute() {
  const path = location.hash.replace('#', '') || '/';
  const route = routes[path];
  const app = document.getElementById('app');

  if (!route) {
    app.innerHTML = '<h2>Página não encontrada :(</h2>';
    return;
  }

  try {
    const response = await fetch(route);
    const html = await response.text();
    app.innerHTML = html;

    // Adiciona listener do formulário se estiver na rota de cadastro
    const form = document.getElementById('formularioVoluntariado');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  } catch (err) {
    app.innerHTML = `<p>Erro ao carregar página: ${err.message}</p>`;
  }
}

window.addEventListener('hashchange', loadRoute);
window.addEventListener('load', loadRoute);

// ==================== Cadastr0 =================
function handleSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('formularioVoluntariado');
  const tabelaContainer = document.querySelector('.tabelaVoluntarios');
  if (!form || !tabelaContainer) return;

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();

  if (!nome || !email) {
    alert('Por favor, preencha os campos Nome e Email.');
    return;
  }

  if (!tabelaContainer) return;

  const formData = {
    nome,
    email,
    telefone: form.telefone.value.trim(),
    idade: form.idade.value.trim(),
    disponibilidade: form.disponibilidade.value.trim(),
    areaInteresse: form['area-interesse'].value.trim(),
    experiencia: form.experiencia.value.trim(),
    motivacao: form.motivacao.value.trim(),
    dataCadastro: new Date().toLocaleString()
  };

  // Exibir resultado na tela
  const htmlCard = `
    <div class="card card--secondary">
      <header class="card__header">
        <h3 class="plan__name">${formData.nome}</h3>
      </header>
      <div class="card__body">
        <ul class="list list--tick">
          <li>Email: ${formData.email}</li>
          <li>Telefone: ${formData.telefone}</li>
          <li>Idade: ${formData.idade}</li>
          <li>Disponibilidade: ${formData.disponibilidade}</li>
          <li>Área de Interesse: ${formData.areaInteresse}</li>
          <li>Data de Cadastro: ${formData.dataCadastro}</li>
          <button class="btn btn--outline btn--block btn--next-plan">Próximo</button>
        </ul>
      </div>
    </div>
  `;

  htmlPlanList.push(htmlCard);

  tabelaContainer.innerHTML =  htmlPlanList[htmlPlanList.length - 1];
  
  // Limpa formulário após 2 segundos
  setTimeout(() => form.reset(), 2000);

  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => (msg.style.display = 'none'), 3000);
  }
}