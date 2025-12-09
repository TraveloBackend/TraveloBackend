import { UserService } from '../modules/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../database/user.schema';

export async function seedAdmin(userService: UserService) {
  const adminExists = await userService.findByEmail('admin@example.com');
  if (!adminExists) {
    const password = await bcrypt.hash('admin123', 10);
    await userService.createAdmin({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password,
      phone_number:"12345678",
      role: UserRole.ADMIN,
      is_verified:true
    });
    console.log('✅ Admin seeded');
  }
}
