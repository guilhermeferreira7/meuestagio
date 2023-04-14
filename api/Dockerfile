FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY webpack-hmr.config.js ./webpack-hmr.config.js
COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run" , "start:dev" ]