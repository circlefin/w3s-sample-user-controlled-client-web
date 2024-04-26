/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/pw-user-controlled/foundational",
  async redirects() {
    return [
      {
        // if user visits sample-app.circle.com/ or /signin
        // redirect to basePath
        source: "/(signin)",
        destination: "/pw-user-controlled/foundational",
        permanent: true,
        basePath: false,
      },
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
