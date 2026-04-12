# PostgreSQL Setup Guide for HRM Node

## Installation Steps

### 1. Install Required Packages

Run the following command in your terminal:

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config class-validator class-transformer
npm install --save-dev @types/node
```

### 2. Environment Setup

The `.env` file has been created with the following structure:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=hrm_db
DB_DRIVER=postgres
PORT=3456
NODE_ENV=development
```

**Important:** Update `.env` with your actual PostgreSQL credentials.

### 3. PostgreSQL Connection

The database connection is configured in:
- `src/database/database.module.ts` - Main database module
- `src/config/configuration.ts` - Configuration factory
- `src/app.module.ts` - Updated to use ConfigModule and DatabaseModule

### 4. Create Your First Entity

Create a new file `src/users/entities/user.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### 5. Create Users Module

Create `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### 6. Update App Module

Add UsersModule to your `src/app.module.ts` imports array.

### 7. Run the Application

```bash
npm run start:dev
```

The application will automatically create the database tables if they don't exist (in development mode).

## Testing the Connection

You can test your connection by checking if the application starts without errors and if the database tables are created in your PostgreSQL database.

## Troubleshooting

- **Connection refused**: Make sure PostgreSQL is running and credentials are correct
- **Database doesn't exist**: The database will be created automatically if you have proper permissions
- **Table sync issues**: Check that `synchronize: true` is enabled in development mode
