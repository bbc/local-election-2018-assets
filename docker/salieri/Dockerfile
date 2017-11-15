FROM centos:centos7

# There's no place like home
RUN localedef -c -i en_GB -f UTF-8 en_GB.UTF-8
ENV LANG en_GB.UTF-8
ENV LANGUAGE en_GB.UTF-8

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs

RUN npm install -g salieri nodemon

EXPOSE 3000

CMD nodemon --watch /app/salieri -e html,json --exec 'salieri -c /app/salieri/config.json -t /app/salieri/template.html'
