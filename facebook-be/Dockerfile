FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]

# docker build -t nest-docker .
# docker run -p 3001:3001 nest-docker
