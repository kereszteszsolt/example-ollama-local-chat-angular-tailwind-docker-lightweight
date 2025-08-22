FROM node:22-alpine

WORKDIR /app

RUN npm install -g @angular/cli@latest

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4201

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4201"]
