const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Base Configuration Tests', () => {
  test('MongoDB Connection', async () => {
    const connection = mongoose.connection.readyState;
    expect(connection).toBe(1); // 1 means connected
  });

  test('MongoDB CRUD Operations', async () => {
    const testCollection = mongoose.connection.collection('test');
    
    // Create
    const insertResult = await testCollection.insertOne({ test: 'data' });
    expect(insertResult.acknowledged).toBeTruthy();
    
    // Read
    const document = await testCollection.findOne({ test: 'data' });
    expect(document).toHaveProperty('test', 'data');
    
    // Update
    const updateResult = await testCollection.updateOne(
      { test: 'data' },
      { $set: { test: 'updated' } }
    );
    expect(updateResult.modifiedCount).toBe(1);
    
    // Delete
    const deleteResult = await testCollection.deleteOne({ test: 'updated' });
    expect(deleteResult.deletedCount).toBe(1);
  });
});