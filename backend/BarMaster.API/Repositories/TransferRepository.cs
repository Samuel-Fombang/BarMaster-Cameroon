using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class TransferRepository
{
    private readonly MongoDbContext _context;

    public TransferRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Transfer>> GetAllAsync()
    {
        return await _context.Transfers
            .Find(_ => true)
            .SortByDescending(transfer => transfer.TransferDate)
            .ToListAsync();
    }

    public async Task<Transfer?> GetByIdAsync(string id)
    {
        return await _context.Transfers
            .Find(transfer => transfer.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Transfer?> GetByTransferNumberAsync(
        string transferNumber
    )
    {
        return await _context.Transfers
            .Find(transfer =>
                transfer.TransferNumber == transferNumber
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Transfer transfer)
    {
        await _context.Transfers.InsertOneAsync(transfer);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Transfer updatedTransfer
    )
    {
        var result =
            await _context.Transfers.ReplaceOneAsync(
                transfer => transfer.Id == id,
                updatedTransfer
            );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result =
            await _context.Transfers.DeleteOneAsync(
                transfer => transfer.Id == id
            );

        return result.DeletedCount > 0;
    }
}