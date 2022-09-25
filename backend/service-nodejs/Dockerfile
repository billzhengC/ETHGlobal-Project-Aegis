FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock prisma ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate && yarn build

FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

EXPOSE 8079

ENV PORT 8079

CMD ["node", "dist/index.js"]