FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN chmod +x docker-entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["./docker-entrypoint.sh"]