#1 choose base image

FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY README.md README.md
COPY src src

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]