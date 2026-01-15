FROM node:22-alpine

# On installe les libs nécessaires pour les binaires natifs
RUN apk add --no-cache openssl libc6-compat libstdc++

WORKDIR /usr/src/app

# On copie les fichiers de dépendances
COPY package*.json ./

# On installe TOUT (y compris Prisma)
RUN npm install

# On copie le dossier prisma
COPY prisma ./prisma/

# On génère le client (Le moteur binaire sera téléchargé ici grâce au schema.prisma)
RUN npx prisma generate

# On copie le reste du code
COPY . .

RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start:prod"]