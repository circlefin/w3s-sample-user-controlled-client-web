/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: rework when i have existing session i still get directed to signin page
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
