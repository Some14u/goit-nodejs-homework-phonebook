FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./app ./app
EXPOSE 3000
CMD ["npm", "start"]