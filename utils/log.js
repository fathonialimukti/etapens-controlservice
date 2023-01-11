export const childProcessLog =
  process.env.NODE_ENV == "production" ? 'inherit' : 'ignore'