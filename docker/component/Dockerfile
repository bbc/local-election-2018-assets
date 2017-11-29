FROM centos:centos7

# There's no place like home
RUN localedef -c -i en_GB -f UTF-8 en_GB.UTF-8
ENV LANG en_GB.UTF-8
ENV LANGUAGE en_GB.UTF-8

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs

EXPOSE 8080

WORKDIR /app

CMD npm run rebuild-if-needed && npm run dev
