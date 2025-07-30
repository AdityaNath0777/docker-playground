create a basic node server

create a Docker file

```Dockerfile
#1 choose base image
FROM ubuntu

# update the OS
RUN apt-get update

# install curl to make API request from terminal
# (basically CLI postman)
RUN apt-get install -y curl

# download node for debian based linux distro
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# upgrade the distro
RUN apt-get upgrade -y

# install the nodejs that we had just downloaded
RUN apt-get install -y nodejs


# copy the files & folders from current directory from my machine into the docker image (ubuntu)
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY src src

# install the required packages
RUN npm install

# command to run the script
ENTRYPOINT [ "npm", "run", "dev" ]
```

- Note: `ensure you are logged-in in Docker Desktop`

- build the image using

```bash
docker build -t ts-node-server .

# docker build -t (tag flag) <image-name> src-of-Dockerfile-config
```

- run the docker image

```bash
docker run -it ts-node-server
```

- it won't work as we haven't done port-mapping
- port mapping

```bash
docker run -it -p 8000:8000 ts-node-server

# docker run -it -p <system-port>:<container-port> ts-node-server
```

- passing env variables to the container

```bash
docker run -it -e PORT=4000 -p 4000:4000 ts-node-server
```

- accessing the bash terminal of ubuntu running within the container

```bash
docker exec -it 823462317f
# docker exec -it <container-id>
# container-id either can be full or just few letters from the start (preferred one)

# for e.g. if container-id: 87dh23w3v4r2342fty33264763gfe3ts34tbr734t673tdys34t6743tr83trs6235ge63truy3gtf73etf

# then only this much is more than enough in 99.999999999% of cases
# 87dh23w3v4r2
```

### Caching the Layers (Layer Caching)

- It caches the layers from Dockerfile
- only starts running from the layer in which we have done some changes

- so the layers which are common should be kept at the top
- as if any changes done in above layer
- makes all the layers from that layer to run
- this might cause running too many layers which does not need to run

for e.g. adding the README.md in the config

```Dockerfile
# from starting same as before

# copy the files & folders from current directory from my machine into the docker image (ubuntu)
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

# **** here making the change ****
COPY README.md README.md
COPY src src

# install the required packages
RUN npm install

# command to run the script
ENTRYPOINT [ "npm", "run", "dev" ]
```

now when we build it again

```bash
docker build -t ts-node-server .
```

we get this cached messages

```bash
[+] Building 10.6s (18/18) FINISHED docker:desktop-linuxnternal] load metadata for docker.io/  5.1s
 => [internal] load build definition from D  0.2s
 => => transferring dockerfile: 450B         0.1s
 => [internal] load metadata for docker.io/  5.1s
 => [auth] library/ubuntu:pull token for re  0.0s
 => [internal] load .dockerignore            0.1s
 => => transferring context: 2B              0.0s
 => [internal] load build context            0.2s
 => => transferring context: 2.41kB          0.0s
 => [ 1/12] FROM docker.io/library/ubuntu:l  0.0s
 => CACHED [ 2/12] RUN apt-get update        0.0s
 => CACHED [ 3/12] RUN apt-get install -y c  0.0s
 => CACHED [ 4/12] RUN curl -fsSL https://d  0.0s
 => CACHED [ 5/12] RUN apt-get upgrade -y    0.0s
 => CACHED [ 6/12] RUN apt-get install -y n  0.0s
 => CACHED [ 7/12] COPY package.json packag  0.0s
 => CACHED [ 8/12] COPY package-lock.json p  0.0s
 => CACHED [ 9/12] COPY tsconfig.json tscon  0.0s
 => [10/12] COPY README.md README.md         0.4s
 => [11/12] COPY src src                     0.8s
 => [12/12] RUN npm install                  3.4s
 => exporting to image                       0.2s
 => => exporting layers                      0.2s
 => => writing image sha256:693273374915cd5  0.0s
 => => naming to docker.io/library/ts-node-  0.0s
```

## Docker compose file

`docker-compose.yml`

```yml
version: "0.1"

services:
  postgres:
    image: postgres
    ports:
      - "5432:5432"
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: ts-node-test
      POSTGRES_PASSWORD: password
  redis:
    image: redis
    ports:
      - "6379:6379"
```

- to run this file

```bash
docker compose up
```

- to run it silently in background
```bash
docker compose up -d
```
d flag is for dettached mode - to detach the task and run it in bg

- to close the docker containers made from this docker compose
```bash
docker compose down
```
