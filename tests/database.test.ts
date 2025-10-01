import { AppDataSource } from '../src/data-source';

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    await AppDataSource.initialize();
    expect(AppDataSource.isInitialized).toBe(true);
    await AppDataSource.destroy();
  });
});