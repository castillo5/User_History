import { connectDatabase } from '@config/database';
import { env } from '@config/env';
import { setupModelAssociations } from '@modules/setupModels';
import { app } from './app';

const bootstrap = async (): Promise<void> => {
  setupModelAssociations();
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`SportsLine API running on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap application', error);
  process.exit(1);
});
