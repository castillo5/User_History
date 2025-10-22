declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi: string;
    info: Record<string, unknown>;
    [key: string]: unknown;
  }

  interface Options {
    swaggerDefinition: SwaggerDefinition;
    apis: string[];
  }

  function swaggerJsdoc(options: Options): unknown;

  export default swaggerJsdoc;
}
