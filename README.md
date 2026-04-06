# helpdesk-frontend — Interface Web

Interface web simples para consumir a API do sistema de chamados de TI.

---

## Sobre

Frontend minimalista desenvolvido com HTML, CSS e JavaScript puro,
sem frameworks. Criado para uso pessoal no dia a dia de suporte de TI,
consumindo diretamente os endpoints da [helpdesk-api](https://github.com/LS-PLuka/helpdesk-api).

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura da página |
| CSS3 | Estilização e responsividade |
| JavaScript | Integração com a API via fetch |
| nginx | Servidor web para servir os arquivos estáticos |
| Docker | Containerização da aplicação |

---

## Funcionalidades

- Abrir novo chamado
- Listar todos os chamados registrados
- Buscar chamado por ID
- Atualizar status do chamado
- Deletar chamado
- Exibição da resposta da API em tempo real

---

## Docker Hub

A imagem do frontend está publicada no Docker Hub:

[pedroluka/helpdesk-frontend](https://hub.docker.com/r/pedroluka/helpdesk-frontend)

---

## Como rodar

A forma recomendada é via Docker Compose junto com o backend.
Consulte o repositório [helpdesk-api](https://github.com/LS-PLuka/helpdesk-api) para instruções completas.

Ou abra o `index.html` diretamente no navegador com o backend rodando em `http://localhost:8080`.

---

## Estrutura
```
helpdesk-frontend/
├── index.html    # Estrutura da interface
├── style.css     # Estilos e paleta de cores
├── script.js     # Integração com a API
├── logo.png      # Logo da empresa
├── Dockerfile    # Containerização via nginx
└── nginx.conf    # Configuração do servidor web
```
