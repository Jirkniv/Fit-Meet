import authDocs from "./authSwagger.json";
import userDocs from "./userSwagger.json";
import activityDocs from "./actitivitySwagger.json";


const securedUserPaths = Object.entries(userDocs.paths).reduce((acc: { [key: string]: any }, [path, methods]) => {
  acc[path] = {
    ...methods,
    security: [{ bearerAuth: [] }]
  };
  return acc;
}, {});

const securedActivityPaths = Object.entries(activityDocs.paths).reduce((acc: { [key: string]: any }, [path, methods]) => {
  acc[path] = {
    ...methods,
    security: [{ bearerAuth: [] }]
  };
  return acc;
}, {});

export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "API BACKEND",
    description: "Documentação da API",
    version: "1.0.0"
  },
  paths: {
    ...authDocs.paths, 
    ...securedUserPaths,
    ...securedActivityPaths
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};


