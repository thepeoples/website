ARG BASE_IMAGE=registry.access.redhat.com/ubi9-micro
ARG BASE_IMAGE_TAG=latest
ARG DENO_VERSION=1.32.0
ARG DENO_IMAGE=docker.io/denoland/deno
ARG DENO_IMAGE_TAG=$DENO_VERSION

# Start the compile build step, which uses the official compiler image for the build process:
#   https://github.com/denoland/deno_docker#using-your-own-base-image
FROM $DENO_IMAGE:$DENO_IMAGE_TAG AS compile
WORKDIR /app
COPY . .
RUN deno install \
    --allow-all \
    --no-prompt \
    --reload \
    main.ts

# Start the release build step, which copies compiled assets from the previous step to a new base image
FROM $BASE_IMAGE:$BASE_IMAGE_TAG AS release
COPY --from=compile /usr/bin/deno /usr/bin/deno
COPY --from=compile /app /app
WORKDIR /app
RUN deno cache main.ts
EXPOSE 8000
CMD ["/usr/bin/deno", "run", "--allow-env", "--allow-net", "--allow-read", "--allow-run", "--allow-write", "--no-prompt", "main.ts"]
