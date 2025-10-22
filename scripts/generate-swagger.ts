import { writeFile } from 'fs/promises';
import path from 'path';
import { swaggerSpec } from '../src/docs/swagger';

const outputPath = path.resolve(__dirname, '../docs/swagger.json');

const run = async () => {
  await writeFile(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
  console.log(`Swagger spec generado en ${outputPath}`);
};

run().catch((error) => {
  console.error('No se pudo generar el swagger', error);
  process.exit(1);
});
