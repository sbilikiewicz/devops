# 1 Wybieramy obraz bazowy
FROM alpine:latest

# 2 Instalujemy w nim zaleznosci niezbedne do uruchomienia procesu glownego 
RUN apk add --update redis
# tego nie robic na ogol
RUN apk add --update nginx

RUN echo "hello"

# 3 Ustawienie procesu glownego
CMD redis-server