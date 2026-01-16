FROM node:24-alpine

# Installation des dépendances système
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du schéma Prisma et génération du client
COPY prisma ./prisma/
RUN npx prisma generate

# Copie de tout le code source
COPY . .

# CRUCIAL : On lance le build NestJS ici
RUN npm run build

# VÉRIFICATION : On liste le dossier dist pour être sûr que main.js est là
RUN ls -la dist/

EXPOSE 4000

# Commande de lancement (on vise le fichier généré par le build)
CMD ["node", "dist/src/main.js"]