FROM node:16
WORKDIR /app
ADD package*.json ./

ADD . .

RUN npm install

EXPOSE 9990
CMD [ "node", "index.js" ]