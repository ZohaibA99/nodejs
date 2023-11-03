FROM node:18-alpine
ENV PORT=5050
COPY . .
RUN npm install --production
CMD ["node", "server.js"]
EXPOSE 5050