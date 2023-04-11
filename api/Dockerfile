FROM node:18-alpine

# Create app directory
WORKDIR /nestjs-app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run" , "start:prod" ]