FROM node:16
WORKDIR /
COPY package*.json ./
RUN npm install
COPY /pages/sender_api.js /
EXPOSE 3000
CMD ["node", "sender_api.js"]