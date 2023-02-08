FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY ./public ./public
COPY ./.next ./.next
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]