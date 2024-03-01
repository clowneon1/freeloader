
#multi-stage build.
#stage 1
FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/frontend

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm" "build"]

# stage 2
FROM node:alpine as PROD_IMAGE


WORKDIR /app/frontend

COPY --from=BUILD_IMAGE app/frontend/dist/ /app/frontend/dist/

COPY package.json .

COPY vite.config.js .

RUN npm install

EXPOSE 8080

#to run npm commands as: npm run preview
CMD ["npm", "run", "preview"]
