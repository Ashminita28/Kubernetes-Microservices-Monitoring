#Stage 1 : Build stage
 FROM node:18-alpine As builder

 RUN npm install -g pnpm

 WORKDIR /app

 COPY package*.json ./
 RUN pnpm install

 COPY . .

 RUN pnpm run build

 #Stage 2: Production
 FROM node:18-alpine

 RUN npm install -g pnpm

 WORKDIR /app

 COPY --from=builder /app/node_modules ./node_modules
 COPY --from=builder /app/dist ./dist
 COPY --from=builder /app/package*.json ./

 EXPOSE 3000

 CMD ["node","dist/server.js"]
