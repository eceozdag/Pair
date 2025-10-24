import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  it('should get all wines', async () => {
    const response = await request(app).get('/api/wines');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should add a new wine', async () => {
    const newWine = {
      name: 'Test Wine',
      type: 'Red',
      year: 2020,
      region: 'Test Region',
    };
    const response = await request(app).post('/api/wines').send(newWine);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newWine.name);
  });

  it('should get pairings for a specific wine', async () => {
    const wineId = '1'; // Replace with a valid wine ID
    const response = await request(app).get(`/api/pairings/${wineId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should add user feedback', async () => {
    const feedback = {
      wineId: '1', // Replace with a valid wine ID
      rating: 5,
      comment: 'Excellent pairing!',
    };
    const response = await request(app).post('/api/feedback').send(feedback);
    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(feedback.rating);
  });
});