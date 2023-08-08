FROM node:18

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3121

CMD ["node", "dist/src/main.js"]