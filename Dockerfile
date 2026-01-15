FROM node:22-alpine

WORKDIR /usr/src/app

# 1. On copie SEULEMENT les fichiers de dépendances
COPY package*.json ./

# 2. On installe PROPREMENT dans l'environnement Linux de Docker
RUN npm install

# 3. On copie le dossier prisma AVANT le reste pour générer le client
COPY prisma ./prisma/

# 4. On génère le client Prisma
RUN npx prisma generate

# 5. MAINTENANT on copie le reste du code
COPY . .

RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start:prod"]