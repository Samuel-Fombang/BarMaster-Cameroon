using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class SaleController : ControllerBase
{
    private readonly SaleService _saleService;

    public SaleController(SaleService saleService)
    {
        _saleService = saleService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Sale>>> GetSales()
    {
        var sales = await _saleService.GetAllAsync();

        return Ok(sales);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Sale>> GetSaleById(string id)
    {
        var sale = await _saleService.GetByIdAsync(id);

        if (sale is null)
        {
            return NotFound(new
            {
                message = "Sale not found."
            });
        }

        return Ok(sale);
    }

    [HttpGet("location/{locationId}")]
    public async Task<ActionResult<List<Sale>>> GetByLocation(
        string locationId
    )
    {
        var sales = await _saleService.GetByLocationIdAsync(
            locationId
        );

        return Ok(sales);
    }

    [HttpPost]
    public async Task<ActionResult<Sale>> CreateSale(
        CreateSaleDto dto
    )
    {
        var result = await _saleService.CreateAsync(dto);

        if (!result.Success || result.Sale is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetSaleById),
            new { id = result.Sale.Id },
            result.Sale
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSale(
        string id,
        UpdateSaleDto dto
    )
    {
        var result = await _saleService.UpdateAsync(id, dto);

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
    public async Task<IActionResult> DeleteSale(string id)
    {
        var result = await _saleService.DeleteAsync(id);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }
}