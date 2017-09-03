FROM node:alpine
RUN apk add --no-cache libc6-compat curl

EXPOSE 3000

COPY ./package.json /backend/
COPY ./app/*.mjs /backend/app/
COPY ./.env /backend/.env

WORKDIR backend

RUN npm install --only=production
CMD ["npm", "start"]