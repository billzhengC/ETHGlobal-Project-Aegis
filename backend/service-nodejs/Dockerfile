FROM node:16

WORKDIR /usr/src/app
COPY . .
RUN yarn --production && npx prisma generate && yarn build
EXPOSE 8079
CMD [ "yarn", "start" ]
