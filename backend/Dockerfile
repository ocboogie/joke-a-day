FROM node:15.4.0-alpine3.10 

ARG PORT=4000
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /code

COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
RUN rm -rf node_modules
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn install --frozen-lockfile \
    && apk del .gyp

COPY . /code

CMD [ "yarn", "run", "dev" ]


