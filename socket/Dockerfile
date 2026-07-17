FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev && npm cache clean --force
COPY server.js .
EXPOSE 3001
CMD ["node", "server.js"]
