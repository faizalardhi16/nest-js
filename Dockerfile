FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN set NODE_ENV=production && pnpm run build

EXPOSE 3121

# RUN npx prisma migrate dev --name migrate_database

CMD ["node", "dist/src/main.js"]