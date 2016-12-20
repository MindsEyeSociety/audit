FROM node

RUN npm install -g nodemon

RUN npm install

WORKDIR /app

ENTRYPOINT nodemon app.js
