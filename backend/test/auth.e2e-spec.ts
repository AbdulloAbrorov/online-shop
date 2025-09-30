import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppRole } from '../src/types';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { createTestApp } from './test.helper';

interface TestUser {
  email: string;
  password: string;
  name: string;
  role: AppRole;
}

const testUser: TestUser = {
  email: 'test@example.com',
  password: 'testPassword123',
  name: 'Test User',
  role: AppRole.USER,
};

const adminUser: TestUser = {
  email: 'admin@example.com',
  password: 'adminPassword123',
  name: 'Admin User',
  role: AppRole.ADMIN,
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body.user).toHaveProperty('email', testUser.email);
          expect(response.body.user).not.toHaveProperty('password');
        });
    });

    it('should not register with duplicate email', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('already in use');
        });
    });

    it('should login with correct credentials', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
        });
    });

    it('should not login with incorrect password', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
