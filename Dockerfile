FROM node:20-alpine

WORKDIR usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ=Europe/Moscow
RUN apk add --no-cache tzdata \
	&& cp /usr/share/zoneinfo/$TZ /etc/localtime \
	&& echo $TZ > /etc/timezone

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]