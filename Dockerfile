# On utilise Node 22 pour la stabilité en conteneur
FROM node:22-alpine

WORKDIR /usr/src/app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Génération du client Prisma (Crucial avant le build)
RUN npx prisma generate

# Build de l'application NestJS
RUN npm run build

# Exposition du port
EXPOSE 4000

# Lancement de l'app
CMD ["npm", "run", "start:prod"]