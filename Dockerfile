FROM --platform=linux/amd64 oven/bun:alpine as builder
WORKDIR /app
COPY package.json ./
COPY bun.lockb ./
COPY src src
RUN bun install --frozen-lockfile
RUN bun run build

FROM --platform=linux/amd64 oven/bun:alpine
RUN apk add --no-cache tini
COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json .

CMD ["/sbin/tini", "--", "bun", "run", "start"]
