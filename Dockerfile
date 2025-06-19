FROM --platform=linux/amd64 oven/bun:1.1.16-alpine as builder
WORKDIR /app
COPY package.json ./
COPY bun.lockb ./
COPY src src
COPY tsconfig.json ./
RUN bun install --frozen-lockfile
RUN bun run build

FROM --platform=linux/amd64 oven/bun:1.1.16-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json .
COPY drizzle /app/drizzle
RUN bun install --frozen-lockfile --production
RUN mkdir /app/data

CMD ["/sbin/tini", "--", "bun", "."]
