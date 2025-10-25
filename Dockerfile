# Multi-stage Dockerfile for LG WebOS TV testing environment
# Stage 1: Build Node.js 0.12.2 and OpenSSL 1.0.2p
FROM ubuntu:14.04 AS base-runtime

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    wget \
    ca-certificates \
    curl \
    python \
    && rm -rf /var/lib/apt/lists/*

# Download and compile OpenSSL 1.0.2p from source (before Node.js)
RUN cd /tmp && \
    wget https://www.openssl.org/source/openssl-1.0.2p.tar.gz && \
    tar -xzf openssl-1.0.2p.tar.gz && \
    cd openssl-1.0.2p && \
    ./config --prefix=/usr/local/openssl-1.0.2p --openssldir=/usr/local/openssl-1.0.2p && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/openssl-1.0.2p*

# Install Node.js 0.12.2 from source (linked to custom OpenSSL)
RUN cd /tmp && \
    wget https://nodejs.org/dist/v0.12.2/node-v0.12.2.tar.gz && \
    tar -xzf node-v0.12.2.tar.gz && \
    cd node-v0.12.2 && \
    export LDFLAGS="-L/usr/local/openssl-1.0.2p/lib" && \
    export CPPFLAGS="-I/usr/local/openssl-1.0.2p/include" && \
    ./configure --openssl-libpath=/usr/local/openssl-1.0.2p/lib --openssl-includes=/usr/local/openssl-1.0.2p/include && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/node-v0.12.2*

# Set OpenSSL environment variables
ENV OPENSSL_CONF=/usr/local/openssl-1.0.2p/openssl.cnf
ENV LD_LIBRARY_PATH=/usr/local/openssl-1.0.2p/lib:$LD_LIBRARY_PATH

# Stage 2: Build with modern Node.js for TypeScript compilation
FROM node:24 AS builder

WORKDIR /app

# Copy test files
COPY test/ ./test/

# Install dependencies and compile TypeScript test file
RUN cd test && npm install && npm run build && echo "Files in test directory:" && ls -la && echo "Looking for JS file:" && find . -name "*.js"

# Stage 3: Final runtime with Node.js 0.12.2 and OpenSSL 1.0.2p
FROM base-runtime

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY tv-service/package*.json ./
RUN npm install --production

# Create test directory and copy built files from builder stage
RUN mkdir -p ./test
COPY --from=builder /app/test/*.js ./test/

# Copy other necessary files
COPY tv-service/services.json ./

# Expose port for testing
EXPOSE 3000

# Default command - run the simple network test
CMD ["node", "test/simple-network-test.js"]