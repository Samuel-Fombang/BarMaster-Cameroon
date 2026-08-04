using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class PasswordResetCodeRepository
{
    private readonly MongoDbContext _context;

    public PasswordResetCodeRepository(
        MongoDbContext context
    )
    {
        _context = context;
    }

    public async Task<PasswordResetCode?>
        GetLatestActiveByEmailAsync(string email)
    {
        return await _context.PasswordResetCodes
            .Find(item =>
                item.Email == email &&
                !item.IsUsed
            )
            .SortByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<PasswordResetCode?>
        GetByResetTokenHashAsync(
            string email,
            string resetTokenHash
        )
    {
        return await _context.PasswordResetCodes
            .Find(item =>
                item.Email == email &&
                item.ResetTokenHash == resetTokenHash &&
                item.IsVerified &&
                !item.IsUsed
            )
            .SortByDescending(item => item.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(
        PasswordResetCode resetCode
    )
    {
        await _context.PasswordResetCodes
            .InsertOneAsync(resetCode);
    }

    public async Task<bool> UpdateAsync(
        string id,
        PasswordResetCode resetCode
    )
    {
        var result =
            await _context.PasswordResetCodes
                .ReplaceOneAsync(
                    item => item.Id == id,
                    resetCode
                );

        return result.ModifiedCount > 0;
    }

    public async Task DeleteActiveByEmailAsync(
        string email
    )
    {
        await _context.PasswordResetCodes
            .DeleteManyAsync(item =>
                item.Email == email &&
                !item.IsUsed
            );
    }

    public async Task DeleteExpiredAsync()
    {
        var now = DateTime.UtcNow;

        await _context.PasswordResetCodes
            .DeleteManyAsync(item =>
                item.ExpiresAt < now &&
                (
                    item.ResetTokenExpiresAt == null ||
                    item.ResetTokenExpiresAt < now
                )
            );
    }
}