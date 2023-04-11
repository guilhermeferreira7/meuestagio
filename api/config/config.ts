export default () => ({
  port: parseInt(process.env.PORT),
  dbPort: parseInt(process.env.DB_PORT),
  jwtSecret: process.env.JWT_SECRET,
});
