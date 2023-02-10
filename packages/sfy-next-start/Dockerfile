FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY ./public ./root/public
COPY ./.next ./root/.next
COPY ../../node_modules ./root/node_modules
COPY ./package.json ./root/package.json

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]