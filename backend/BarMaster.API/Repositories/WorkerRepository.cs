using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class WorkerRepository
{
    private readonly MongoDbContext _context;

    public WorkerRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Worker>> GetAllAsync()
    {
        return await _context.Workers
            .Find(_ => true)
            .SortBy(worker => worker.FirstName)
            .ThenBy(worker => worker.LastName)
            .ToListAsync();
    }

    public async Task<Worker?> GetByIdAsync(string id)
    {
        return await _context.Workers
            .Find(worker => worker.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Worker?> GetByUsernameAsync(
        string username
    )
    {
        var normalizedUsername =
            username.Trim().ToLower();

        return await _context.Workers
            .Find(worker =>
                worker.Username.ToLower() ==
                normalizedUsername
            )
            .FirstOrDefaultAsync();
    }

    public async Task<Worker?> GetByEmailAsync(
        string email
    )
    {
        var normalizedEmail =
            email.Trim().ToLower();

        return await _context.Workers
            .Find(worker =>
                worker.Email.ToLower() ==
                normalizedEmail
            )
            .FirstOrDefaultAsync();
    }

    public async Task<Worker?> GetByUsernameOrEmailAsync(
        string usernameOrEmail
    )
    {
        var normalizedValue =
            usernameOrEmail.Trim().ToLower();

        return await _context.Workers
            .Find(worker =>
                worker.Username.ToLower() ==
                    normalizedValue ||
                worker.Email.ToLower() ==
                    normalizedValue
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Worker worker)
    {
        await _context.Workers.InsertOneAsync(worker);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Worker updatedWorker
    )
    {
        var result = await _context.Workers
            .ReplaceOneAsync(
                worker => worker.Id == id,
                updatedWorker
            );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Workers
            .DeleteOneAsync(
                worker => worker.Id == id
            );

        return result.DeletedCount > 0;
    }
}