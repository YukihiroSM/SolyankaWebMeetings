FROM python:3.9

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONUNBUFFERED 1
ARG STATIC_URL
ENV STATIC_URL ${STATIC_URL:-/static/}
# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app
RUN pip install -r requirements.txt

# copy project
COPY ./web_platform /usr/src/app

EXPOSE 8000
