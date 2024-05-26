FROM denoland/deno

WORKDIR /app

COPY ./src/ /app/

CMD ["deno", "run", "-A", "index.ts"]