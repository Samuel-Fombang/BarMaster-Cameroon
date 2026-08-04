using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class ExpenseService
{
    private readonly ExpenseRepository _expenseRepository;

    public ExpenseService(
        ExpenseRepository expenseRepository
    )
    {
        _expenseRepository = expenseRepository;
    }

    public async Task<List<Expense>> GetAllAsync()
    {
        return await _expenseRepository.GetAllAsync();
    }

    public async Task<Expense?> GetByIdAsync(string id)
    {
        return await _expenseRepository.GetByIdAsync(id);
    }

    public async Task<List<Expense>> GetByCategoryAsync(
        string category
    )
    {
        return await _expenseRepository.GetByCategoryAsync(
            category
        );
    }

    public async Task<
        (bool Success, string Message, Expense? Expense)
    > CreateAsync(CreateExpenseDto dto)
    {
        var expense = new Expense
        {
            ExpenseNumber = GenerateExpenseNumber(),
            Category = dto.Category.Trim(),
            Description = dto.Description.Trim(),
            Amount = dto.Amount,
            PaymentMethod = dto.PaymentMethod.Trim(),
            ReferenceNumber = dto.ReferenceNumber.Trim(),
            Notes = dto.Notes.Trim(),
            Status = "Completed",
            ExpenseDate =
                dto.ExpenseDate ?? DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _expenseRepository.CreateAsync(expense);

        return (
            true,
            "Expense created successfully.",
            expense
        );
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateExpenseDto dto
    )
    {
        var existingExpense =
            await _expenseRepository.GetByIdAsync(id);

        if (existingExpense is null)
        {
            return (
                false,
                "Expense not found."
            );
        }

        existingExpense.Category =
            dto.Category.Trim();

        existingExpense.Description =
            dto.Description.Trim();

        existingExpense.Amount =
            dto.Amount;

        existingExpense.PaymentMethod =
            dto.PaymentMethod.Trim();

        existingExpense.ReferenceNumber =
            dto.ReferenceNumber.Trim();

        existingExpense.Notes =
            dto.Notes.Trim();

        existingExpense.ExpenseDate =
            dto.ExpenseDate;

        existingExpense.UpdatedAt =
            DateTime.UtcNow;

        await _expenseRepository.UpdateAsync(
            id,
            existingExpense
        );

        return (
            true,
            "Expense updated successfully."
        );
    }

    public async Task<(bool Success, string Message)> DeleteAsync(
        string id
    )
    {
        var existingExpense =
            await _expenseRepository.GetByIdAsync(id);

        if (existingExpense is null)
        {
            return (
                false,
                "Expense not found."
            );
        }

        var deleted =
            await _expenseRepository.DeleteAsync(id);

        if (!deleted)
        {
            return (
                false,
                "Expense could not be deleted."
            );
        }

        return (
            true,
            "Expense deleted successfully."
        );
    }

    private static string GenerateExpenseNumber()
    {
        return $"EXP-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}