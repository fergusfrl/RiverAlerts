FROM node:alpine as BUILD_IMAGE

WORKDIR /app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --frozen-lockfile

COPY . .

# set env args
ARG NEXT_PUBLIC_FIREBASE_API_KEY %NEXT_PUBLIC_FIREBASE_API_KEY%
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID %NEXT_PUBLIC_FIREBASE_PROJECT_ID%
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET %NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID %NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%
ARG NEXT_PUBLIC_FIREBASE_APP_ID %NEXT_PUBLIC_FIREBASE_APP_ID%
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID %NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID%

# build
RUN yarn build

# remove dev dependencies
RUN npm prune --production

FROM node:alpine

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public

EXPOSE 3000
CMD ["yarn", "start"]
