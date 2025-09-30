
import { AppDataSource } from '../src/data-source';

describe('Database Connection', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should connect to the database', () => {
    expect(AppDataSource.isInitialized).toBe(true);
  });
});
