FROM node:20.12.0-alpine3.19

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "dist/index.js"]