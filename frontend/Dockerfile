FROM node:15.4.0-alpine3.10 as development

ENV CI=true
ENV PORT=8080

WORKDIR /code
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile
COPY . /code

CMD [ "yarn", "run", "serve" ]

