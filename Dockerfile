FROM node:12.14.0
MAINTAINER littledian 1197434548@qq.com

WORKDIR /app
COPY . .

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install --production

CMD ["npm", "start"]

EXPOSE 3000
