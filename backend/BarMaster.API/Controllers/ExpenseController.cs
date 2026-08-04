using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly ExpenseService _expenseService;

    public ExpenseController(ExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Expense>>> GetExpenses()
    {
        var expenses = await _expenseService.GetAllAsync();

        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetExpenseById(
        string id
    )
    {
        var expense = await _expenseService.GetByIdAsync(id);

        if (expense is null)
        {
            return NotFound(new
            {
                message = "Expense not found."
            });
        }

        return Ok(expense);
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<Expense>>> GetByCategory(
        string category
    )
    {
        var expenses =
            await _expenseService.GetByCategoryAsync(category);

        return Ok(expenses);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(
        CreateExpenseDto dto
    )
    {
        var result = await _expenseService.CreateAsync(dto);

        if (!result.Success || result.Expense is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetExpenseById),
            new { id = result.Expense.Id },
            result.Expense
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(
        string id,
        UpdateExpenseDto dto
    )
    {
        var result =
            await _expenseService.UpdateAsync(id, dto);

        if (!result.Success)
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(
        string id
    )
    {
        var result =
            await _expenseService.DeleteAsync(id);

        if (!result.Success)
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }
}