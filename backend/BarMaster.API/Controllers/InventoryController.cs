using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _inventoryService;

    public InventoryController(InventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Inventory>>> GetInventory()
    {
        var inventory = await _inventoryService.GetAllAsync();

        return Ok(inventory);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Inventory>> GetInventoryById(string id)
    {
        var inventory = await _inventoryService.GetByIdAsync(id);

        if (inventory is null)
        {
            return NotFound(new
            {
                message = "Inventory record not found."
            });
        }

        return Ok(inventory);
    }

    [HttpGet("location/{locationId}")]
    public async Task<ActionResult<List<Inventory>>> GetByLocation(
        string locationId
    )
    {
        var inventory =
            await _inventoryService.GetByLocationIdAsync(locationId);

        return Ok(inventory);
    }

    [HttpGet("drink/{drinkId}")]
    public async Task<ActionResult<List<Inventory>>> GetByDrink(
        string drinkId
    )
    {
        var inventory =
            await _inventoryService.GetByDrinkIdAsync(drinkId);

        return Ok(inventory);
    }

    [HttpGet("location/{locationId}/drink/{drinkId}")]
    public async Task<ActionResult<Inventory>> GetByDrinkAndLocation(
        string locationId,
        string drinkId
    )
    {
        var inventory =
            await _inventoryService.GetByDrinkAndLocationAsync(
                drinkId,
                locationId
            );

        if (inventory is null)
        {
            return NotFound(new
            {
                message = "Inventory record not found for this drink and location."
            });
        }

        return Ok(inventory);
    }

    [HttpPost]
    public async Task<ActionResult<Inventory>> CreateInventory(
        CreateInventoryDto dto
    )
    {
        var result = await _inventoryService.CreateAsync(dto);

        if (!result.Success || result.Inventory is null)
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
            nameof(GetInventoryById),
            new { id = result.Inventory.Id },
            result.Inventory
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInventory(
        string id,
        UpdateInventoryDto dto
    )
    {
        var result =
            await _inventoryService.UpdateAsync(id, dto);

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
    public async Task<IActionResult> DeleteInventory(string id)
    {
        var result =
            await _inventoryService.DeleteAsync(id);

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