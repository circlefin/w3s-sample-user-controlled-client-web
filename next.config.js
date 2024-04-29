/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/pw-user-controlled/foundational",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
