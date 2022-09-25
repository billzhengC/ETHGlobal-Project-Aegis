FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock prisma ./
RUN yarn install --frozen-lockfile

FROM node:16-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate && yarn build

FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 aegis
RUN adduser --system --uid 1001 aegis

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./dist/generated
COPY --from=builder /app/node_modules ./node_modules

USER aegis
EXPOSE 8079

ENV PORT 8079

CMD ["node", "dist/index.js"]