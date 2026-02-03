# Guia de Deploy em VPS (DigitalOcean, AWS, etc.)

Este guia vai te ensinar a colocar sua aplicação "Prova Foco" no ar usando uma VPS (Virtual Private Server) e Docker.

## Pré-requisitos

1.  **Uma VPS**: Recomendo DigitalOcean (Droplet) ou AWS (EC2).
    *   Sistema Operacional: **Ubuntu 22.04 LTS** (ou 24.04).
    *   Memória: Pelo menos 1GB (2GB é recomendado).
2.  **Domínio**: Um endereço registrado (ex: `seusite.com.br`) apontando para o IP da sua VPS.

---

## Passo 1: Acessar a VPS

Use o terminal (PowerShell ou CMD no Windows) para acessar seu servidor via SSH:

```bash
ssh root@SEU_IP_DA_VPS
```

(Você precisará da senha ou chave SSH que criou ao contratar a VPS).

---

## Passo 2: Instalar Docker e Git

Já no terminal da VPS, execute os comandos abaixo para instalar o Docker:

```bash
# Atualizar lista de pacotes
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verificar se instalou
docker --version
docker compose version
```

Agora instale o Git:

```bash
apt install git -y
```

---

## Passo 3: Baixar o Projeto

Clone seu repositório (substitua pelo seu link do GitHub):

```bash
git clone https://github.com/ejssilva/provaFoco.git
cd provaFoco
```

---

## Passo 4: Configurar e Rodar

1.  **Verifique os arquivos**: Certifique-se de que `Dockerfile` e `docker-compose.yml` estão na pasta.

2.  **Edite o docker-compose (Opcional)**:
    Se quiser mudar a senha secreta ou porta, edite o arquivo:
    ```bash
    nano docker-compose.yml
    ```
    (Use `Ctrl+X`, depois `Y` e `Enter` para salvar e sair).

3.  **Inicie a aplicação**:
    Este comando vai construir a imagem e iniciar o servidor em segundo plano.

    ```bash
    docker compose up -d --build
    ```

    *   `up`: sobe os serviços.
    *   `-d`: detached (roda em segundo plano).
    *   `--build`: força a construção da imagem na primeira vez.

---

## Passo 5: Verificar se está rodando

Execute:
```bash
docker compose ps
```
Você deve ver o status "Up".

Agora, acesse o IP da sua VPS no navegador: `http://SEU_IP_DA_VPS`.
Se tudo deu certo, sua aplicação vai abrir!

---

## Manutenção

### Ver logs
```bash
docker compose logs -f
```

### Atualizar o site
Quando você fizer alterações no código e subir para o GitHub, faça o seguinte na VPS:

```bash
# Baixar novidades
git pull

# Reiniciar aplicação com novo código
docker compose up -d --build
```

### Onde está o Banco de Dados?
O banco de dados SQLite é salvo na pasta `data` dentro da pasta do projeto na VPS (`~/provaFoco/data`). Isso garante que, mesmo reiniciando o Docker, seus dados não somem.
