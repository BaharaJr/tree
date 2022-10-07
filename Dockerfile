FROM node:14.16.1-alpine3.12
RUN apk add --no-cache tzdata
RUN apk add --no-cache --virtual .gyp python3 make gcc g++
RUN apk add --update --no-cache zip curl 
ENV TZ Africa/Dar_es_Salaam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir /home/app
WORKDIR /home/app
RUN addgroup -S tree && adduser -S -G tree tree \
    && chown -R tree:tree /home/tree \
    && chown -R tree:tree /home/app
COPY ["package.json","tsconfig.json","tsconfig.build.json","./"]
RUN npm install && apk del .gyp
RUN mkdir -p /run/postgresql
COPY ["src","./src"]
USER tree
CMD npm run start