using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly StockService _stockService;

    public StockController(StockService stockService)
    {
        _stockService = stockService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Stock>>> GetStock()
    {
        var stock = await _stockService.GetAllAsync();

        return Ok(stock);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Stock>> GetStockById(string id)
    {
        var stock = await _stockService.GetByIdAsync(id);

        if (stock is null)
        {
            return NotFound(new
            {
                message = "Stock record not found."
            });
        }

        return Ok(stock);
    }

    [HttpGet("drink/{drinkId}")]
    public async Task<ActionResult<Stock>> GetStockByDrinkId(
        string drinkId
    )
    {
        var stock = await _stockService.GetByDrinkIdAsync(drinkId);

        if (stock is null)
        {
            return NotFound(new
            {
                message = "Stock record not found for this drink."
            });
        }

        return Ok(stock);
    }

    [HttpPost]
    public async Task<ActionResult<Stock>> CreateStock(
        CreateStockDto dto
    )
    {
        var result = await _stockService.CreateAsync(dto);

        if (!result.Success || result.Stock is null)
        {
            if (result.Message.Contains("already"))
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetStockById),
            new { id = result.Stock.Id },
            result.Stock
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(
        string id,
        UpdateStockDto dto
    )
    {
        var result = await _stockService.UpdateAsync(id, dto);

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
    public async Task<IActionResult> DeleteStock(string id)
    {
        var result = await _stockService.DeleteAsync(id);

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