using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PurchaseController : ControllerBase
{
    private readonly PurchaseService _purchaseService;

    public PurchaseController(PurchaseService purchaseService)
    {
        _purchaseService = purchaseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Purchase>>> GetPurchases()
    {
        var purchases = await _purchaseService.GetAllAsync();

        return Ok(purchases);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Purchase>> GetPurchaseById(
        string id
    )
    {
        var purchase = await _purchaseService.GetByIdAsync(id);

        if (purchase is null)
        {
            return NotFound(new
            {
                message = "Purchase not found."
            });
        }

        return Ok(purchase);
    }

    [HttpGet("supplier/{supplierId}")]
    public async Task<ActionResult<List<Purchase>>> GetBySupplier(
        string supplierId
    )
    {
        var purchases =
            await _purchaseService.GetBySupplierIdAsync(
                supplierId
            );

        return Ok(purchases);
    }

    [HttpPost]
    public async Task<ActionResult<Purchase>> CreatePurchase(
        CreatePurchaseDto dto
    )
    {
        var result = await _purchaseService.CreateAsync(dto);

        if (!result.Success || result.Purchase is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetPurchaseById),
            new { id = result.Purchase.Id },
            result.Purchase
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePurchase(
        string id,
        UpdatePurchaseDto dto
    )
    {
        var result = await _purchaseService.UpdateAsync(id, dto);

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
    public async Task<IActionResult> DeletePurchase(string id)
    {
        var result = await _purchaseService.DeleteAsync(id);

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