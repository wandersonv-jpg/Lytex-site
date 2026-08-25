# Publicação gratuita no GitHub Pages

Esta versão é a migração simples da vitrine pública da Lytex. Ela não depende do servidor, banco de dados ou cobrança do WebDev. O editor `/admin` não faz parte desta versão estática; para alterar fotos e legendas, edite `client/src/pages/Home.tsx` e gere um novo build.

## Publicação recomendada

Crie um repositório público no GitHub, por exemplo `lytex-site`, e envie todos os arquivos deste projeto. Depois, abra **Settings → Pages** e selecione **GitHub Actions** como origem. O workflow `.github/workflows/deploy-pages.yml` fará o build e a publicação automaticamente a cada atualização na branch `main`.

O comando local equivalente é:

```bash
pnpm install
pnpm build:github
```

O resultado será gerado em `dist/public`. O endereço padrão será `https://SEU-USUARIO.github.io/lytex-site/`. O `base` relativo já está configurado para funcionar tanto em um repositório de projeto quanto em um domínio próprio.

## Atualização do conteúdo

A vitrine mantém o catálogo no código para permanecer simples e gratuita. Para trocar uma legenda, título ou imagem, altere o array `gallery` em `client/src/pages/Home.tsx`, substitua o asset correspondente em `github-pages/assets` e envie um novo commit para `main`.

O telefone oficial configurado é **(19) 99622-0753**. Os botões de WhatsApp usam o destino `https://wa.me/5519996220753`. O QR Code do WhatsApp permanece independente do endereço do site.

## Observação sobre o QR Code do site

O QR Code específico do site só deve ser impresso depois que o novo endereço do GitHub Pages estiver confirmado, porque o endereço padrão depende do seu nome de usuário e do nome escolhido para o repositório. Após a publicação, gere um novo QR Code com a URL final, ou solicite uma atualização deste pacote informando a URL definitiva.
