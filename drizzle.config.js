export default{
    dialect:'postgresql',
    schema:'./utils/schema.jsx',
    out:'./drizzle',
    dbCredentials:{
       // url: process.env.NEXT_PUBLIC_DATABASE_URL,
        //connectionStrings: process.env.NEXT_PUBLIC_DATABASE_URL,
        url: "postgresql://neondb_owner:npg_ENo6QK3xZGPM@ep-gentle-sun-a1t540lm-pooler.ap-southeast-1.aws.neon.tech/flow?sslmode=require",
        connectionStrings: "postgresql://neondb_owner:npg_ENo6QK3xZGPM@ep-gentle-sun-a1t540lm-pooler.ap-southeast-1.aws.neon.tech/flow?sslmode=require"
    },
};