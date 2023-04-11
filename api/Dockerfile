FROM node:18-alpine As development

WORKDIR /nestjs-app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /nestjs-app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /nestjs-app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]