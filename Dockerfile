FROM node

RUN npm install

RUN npm install -g nodemon knex

EXPOSE 3000
EXPOSE 1010

WORKDIR /app

CMD ./init.sh
