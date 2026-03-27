/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {},
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig