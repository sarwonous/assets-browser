FROM node:16-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn start