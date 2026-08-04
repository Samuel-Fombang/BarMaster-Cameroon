using BarMaster.API.Data;
using BarMaster.API.Models;
using MongoDB.Driver;

namespace BarMaster.API.Repositories;

public class ExpenseRepository
{
    private readonly MongoDbContext _context;

    public ExpenseRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Expense>> GetAllAsync()
    {
        return await _context.Expenses
            .Find(_ => true)
            .SortByDescending(expense => expense.ExpenseDate)
            .ToListAsync();
    }

    public async Task<Expense?> GetByIdAsync(string id)
    {
        return await _context.Expenses
            .Find(expense => expense.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Expense?> GetByExpenseNumberAsync(
        string expenseNumber
    )
    {
        return await _context.Expenses
            .Find(expense =>
                expense.ExpenseNumber == expenseNumber
            )
            .FirstOrDefaultAsync();
    }

    public async Task<List<Expense>> GetByCategoryAsync(
        string category
    )
    {
        return await _context.Expenses
            .Find(expense =>
                expense.Category == category
            )
            .SortByDescending(expense => expense.ExpenseDate)
            .ToListAsync();
    }

    public async Task CreateAsync(Expense expense)
    {
        await _context.Expenses.InsertOneAsync(expense);
    }

    public async Task<bool> UpdateAsync(
        string id,
        Expense updatedExpense
    )
    {
        var result = await _context.Expenses.ReplaceOneAsync(
            expense => expense.Id == id,
            updatedExpense
        );

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _context.Expenses.DeleteOneAsync(
            expense => expense.Id == id
        );

        return result.DeletedCount > 0;
    }
}