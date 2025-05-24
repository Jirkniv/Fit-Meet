FROM node:22.12.0

WORKDIR /app

COPY package*.json .

RUN npm i
COPY . .


COPY assets ./dist/assets

RUN npx prisma generate

RUN npm run build
 
EXPOSE 7777
 
CMD [ "npm", "start" ]