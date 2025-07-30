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

## Configuring Individual Containers

### Docker Network

- create a docker network so that the containers can communicate with each other via this network.
- This docker acts as a bridge
- command to create a docker network  
  `docker network create <network name>`

```bash
docker network create my-network
```

- running an individual postgres container

```bash
docker run -d -p 5432:5432 --name test-postgres --network my-network -e POSTGRES_PASSWORD=password -e POSTGRES_USER=admin postgres
```

- open a default postgres database within the container

```bash
docker exec -it test-postgres psql -U admin -d postgres
```

We are now in the PostgreSQL server terminal within the process running inside the container

```bash
psql (17.5 (Debian 17.5-1.pgdg120+1))
Type "help" for help.

$namaste-meethai-db=# \c
You are now connected to database "namaste-meethai-db" as user "admin".

$namaste-meethai-db=# \dt
Did not find any relations.
```

- `\c` is the command to get the connected database and user
- `\dt` is get all the tables inside the current connected database

```bash
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

using the `;` is necessary else the cli will show `namaste-meethai-db(=#` everywhere, see it has a `(`, for multiline commands
after completing the statement, ensure to use `;` to tell the postgres current query statement is completed

Insert dummy data into the DB

```bash
INSERT INTO users (name, email, password) VALUES ('Aarav Sharma', 'aarav.sharma@example.com', 'pass123');
INSERT INTO users (name, email, password) VALUES ('Aditi Singh', 'aditi.singh@example.com', 'pass456');
INSERT INTO users (name, email, password) VALUES ('Rohan Kumar', 'rohan.kumar@example.com', 'securepass');
INSERT INTO users (name, email, password) VALUES ('Priya Devi', 'priya.devi@example.com', 'mysecret');
```

- I made some changes and added a simple GET `/users` route to return the user's details saved within the DB

- DB configuration and connection

```ts
// db/pg.ts
import { Pool, PoolClient } from "pg";

const pgConfig = {
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DATABASE || "my-database",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: parseInt(process.env.POSTGRES_PORT || "") || 5432,
};

const pool = new Pool(pgConfig);

async function connectToDB() {
  try {
    const client: PoolClient = await pool.connect();
    console.log(`Connected to PostgreSQL DB successfully`);
    client.release();
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`DATABASE_CONNECTION_ERROR: `, err.stack);
    }
    return false;
  }
}

export { pool, connectToDB };
```

- User Controller

```ts
// controllers/user.controller.ts
const getUsers = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email FROM users LIMIT 100`
    );
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(result.rows));
  } catch (err) {
    // error handling
  }
};
```

- Connecting the DB, Defining the route and calling the controller

```ts
// index.ts
connectToDB().then((success) => {
  if (success) {
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  } else {
    console.error("Failed to connect to the database. Server will not start.");
    process.exit(1);
  }
});

const server: http.Server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    if (req.url === "/") {
      // some routes
    } else if (req.url === "/users" && req.method === "GET") {
      // calling the getUsers user controller
      userController.getUsers(req, res);
    } else {
      // other routes
    }
  }
);
```

- build the new image

```bash
docker build -t pg-ts-server .
```

- run the container with required configurations
  - networking
  - port binding
  - env variables
  - container name
  - image to run

```bash
docker run -it \
  --network my-network \
  -p 4040:4040 \
  -e PORT=4040 \
  -e POSTGRES_HOST=test-postgres \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DATABASE="namaste-meethai-db" \
  -e POSTGRES_PASSWORD=password \
  --name pg-ts-test-server \
  ps-ts-node-server
```
