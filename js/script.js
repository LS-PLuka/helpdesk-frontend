// =============================================
// HELPDESK — iDeal Grupo
// Integração com a API REST (Spring Boot)
// Base URL da API
// =============================================

const API_BASE = "http://localhost:8080/api/chamados";

// =============================================
// NAVEGAÇÃO ENTRE ABAS
// =============================================

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    // Remove estado ativo de todas as abas e painéis
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

    // Ativa a aba clicada
    tab.classList.add("active");
    const painel = document.getElementById("tab-" + tab.dataset.tab);
    if (painel) painel.classList.add("active");
  });
});

// =============================================
// EXIBIR RESPOSTA DA API NO PAINEL INFERIOR
// =============================================

function exibirResposta(dados) {
  const area = document.getElementById("response-area");
  const conteudo = document.getElementById("response-content");
  area.style.display = "block";
  conteudo.textContent = JSON.stringify(dados, null, 2);
  // Scroll suave até a área de resposta
  area.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Fechar o painel de resposta
document.getElementById("btn-fechar-resposta").addEventListener("click", () => {
  document.getElementById("response-area").style.display = "none";
});

// =============================================
// RENDERIZAR CARD DE CHAMADO
// =============================================

function renderChamado(c) {
  return `
    <div class="chamado-card">
      <div class="chamado-header">
        <span class="chamado-titulo">${c.titulo}</span>
        <span class="chamado-id">#${c.id}</span>
      </div>
      <div class="chamado-meta">
        <span class="badge badge-status-${c.status}">${c.status.replace("_", " ")}</span>
        <span class="badge badge-categoria">${c.categoria}</span>
      </div>
      <div class="chamado-descricao">${c.descricao}</div>
      <div class="chamado-extra">
        ${c.setor   ? `<span>📍 ${c.setor}</span>`          : ""}
        ${c.colaborador    ? `<span>👤 ${c.colaborador}</span>`     : ""}
        ${c.emailColaborador ? `<span>✉ ${c.emailColaborador}</span>` : ""}
        ${c.solucao ? `<span>✅ Solução: ${c.solucao}</span>` : ""}
      </div>
    </div>
  `;
}

// =============================================
// ABRIR CHAMADO — POST /api/chamados
// =============================================

document.getElementById("form-criar").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Monta o payload com os campos do formulário
  const payload = {
    titulo:           document.getElementById("titulo").value.trim(),
    descricao:        document.getElementById("descricao").value.trim(),
    setor:            document.getElementById("setor").value.trim(),
    colaborador:      document.getElementById("colaborador").value.trim() || null,
    emailColaborador: document.getElementById("emailColaborador").value.trim() || null,
    categoria:        document.getElementById("categoria").value || null,
    solucao:          document.getElementById("solucao").value.trim() || null,
    observacao:       document.getElementById("observacao").value.trim() || null,
    status:           null
  };

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const dados = await res.json();
    exibirResposta(dados);

    if (res.ok) {
      // Limpa o formulário após sucesso
      document.getElementById("form-criar").reset();
      alert(`✅ Chamado #${dados.id} aberto com sucesso!`);
    } else {
      alert("❌ Erro ao abrir chamado. Verifique os campos obrigatórios.");
    }
  } catch (err) {
    // Erro de conexão com a API
    exibirResposta({ erro: "Não foi possível conectar à API", detalhe: err.message });
    alert("❌ Erro de conexão com a API. Verifique se o servidor está rodando.");
  }
});

// =============================================
// LISTAR CHAMADOS — GET /api/chamados/list
// =============================================

document.getElementById("btn-listar").addEventListener("click", async () => {
  const container = document.getElementById("lista-chamados");
  container.innerHTML = '<div class="msg msg-empty">Carregando...</div>';

  try {
    const res = await fetch(`${API_BASE}/list`);
    const dados = await res.json();
    exibirResposta(dados);

    if (!res.ok) {
      container.innerHTML = `<div class="msg msg-error">Erro ao buscar chamados.</div>`;
      return;
    }

    if (dados.length === 0) {
      container.innerHTML = `<div class="msg msg-empty">Nenhum chamado registrado.</div>`;
      return;
    }

    // Renderiza cada chamado como um card
    container.innerHTML = dados.map(renderChamado).join("");
  } catch (err) {
    container.innerHTML = `<div class="msg msg-error">Erro de conexão com a API.</div>`;
    exibirResposta({ erro: err.message });
  }
});

// =============================================
// BUSCAR POR ID — GET /api/chamados/get/{id}
// =============================================

document.getElementById("btn-buscar").addEventListener("click", async () => {
  const id = document.getElementById("busca-id").value.trim();
  const container = document.getElementById("resultado-busca");

  if (!id) {
    container.innerHTML = `<div class="msg msg-error">Informe um ID válido.</div>`;
    return;
  }

  container.innerHTML = '<div class="msg msg-empty">Buscando...</div>';

  try {
    const res = await fetch(`${API_BASE}/get/${id}`);
    const dados = await res.json();
    exibirResposta(dados);

    if (res.status === 404) {
      container.innerHTML = `<div class="msg msg-error">Chamado #${id} não encontrado.</div>`;
      return;
    }

    if (!res.ok) {
      container.innerHTML = `<div class="msg msg-error">Erro ao buscar chamado.</div>`;
      return;
    }

    // Exibe o chamado encontrado
    container.innerHTML = renderChamado(dados);
  } catch (err) {
    container.innerHTML = `<div class="msg msg-error">Erro de conexão com a API.</div>`;
    exibirResposta({ erro: err.message });
  }
});

// =============================================
// DELETAR CHAMADO — DELETE /api/chamados/{id}
// =============================================

document.getElementById("btn-deletar").addEventListener("click", async () => {
  const id = document.getElementById("deletar-id").value.trim();
  const container = document.getElementById("resultado-deletar");

  if (!id) {
    container.innerHTML = `<div class="msg msg-error">Informe um ID válido.</div>`;
    return;
  }

  // Confirmação antes de deletar
  const confirmado = confirm(`Tem certeza que deseja deletar o chamado #${id}?`);
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

    if (res.status === 204) {
      // Sucesso — sem corpo na resposta (204 No Content)
      container.innerHTML = `<div class="msg msg-success">Chamado #${id} deletado com sucesso.</div>`;
      exibirResposta({ mensagem: `Chamado #${id} deletado com sucesso.`, status: 204 });
    } else if (res.status === 404) {
      container.innerHTML = `<div class="msg msg-error">Chamado #${id} não encontrado.</div>`;
      const dados = await res.json();
      exibirResposta(dados);
    } else {
      const dados = await res.json().catch(() => ({}));
      container.innerHTML = `<div class="msg msg-error">Erro ao deletar chamado.</div>`;
      exibirResposta(dados);
    }
  } catch (err) {
    container.innerHTML = `<div class="msg msg-error">Erro de conexão com a API.</div>`;
    exibirResposta({ erro: err.message });
  }
});

// =============================================
// CARREGAR LISTA AO ENTRAR NA ABA "LISTAR"
// =============================================

document.querySelector('[data-tab="listar"]').addEventListener("click", () => {
  // Dispara o botão de listar automaticamente ao abrir a aba
  setTimeout(() => document.getElementById("btn-listar").click(), 100);
});
