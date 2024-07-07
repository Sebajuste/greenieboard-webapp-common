const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
require('dotenv').config();

const config = {
  user: `${process.env.DEPLOY_FTP_USER}`,
  // Password optional, prompted if none given
  password: `${process.env.DEPLOY_FTP_PASS}`,
  host: `${process.env.DEPLOY_FTP_HOST}`,
  port: process.env.DEPLOY_FTP_PORT,
  localRoot: __dirname + "/build",
  remoteRoot: "/",
  include: ["*", "**/*"],      // this would upload everything except dot files
  // include: ["build/*"],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [
    "dist/**/*.map",
    "node_modules/**",
    "node_modules/**/.*",
    ".git/**",
  ],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: true,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: true,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log("finished:", res))
  .catch((err) => console.log(err));