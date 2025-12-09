import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/users/services/user.service';
import { seedAdmin } from './admin.seeder';
import { PageService } from 'src/modules/page/services/page.service';
import { seedPages } from './pages.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const pageService = app.get(PageService);

  await seedAdmin(userService);
  await seedPages(pageService);
  await app.close();
}
bootstrap();