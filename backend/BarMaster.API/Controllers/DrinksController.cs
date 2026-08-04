using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DrinksController : ControllerBase
{
    private readonly DrinkService _drinkService;

    public DrinksController(DrinkService drinkService)
    {
        _drinkService = drinkService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Drink>>> GetDrinks()
    {
        var drinks = await _drinkService.GetAllAsync();

        return Ok(drinks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Drink>> GetDrinkById(string id)
    {
        var drink = await _drinkService.GetByIdAsync(id);

        if (drink is null)
        {
            return NotFound(new
            {
                message = "Drink not found"
            });
        }

        return Ok(drink);
    }

    [HttpPost]
    public async Task<ActionResult<Drink>> CreateDrink(CreateDrinkDto dto)
    {
        var drink = await _drinkService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetDrinkById),
            new { id = drink.Id },
            drink
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDrink(
        string id,
        UpdateDrinkDto dto
    )
    {
        var updated = await _drinkService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Drink not found"
            });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDrink(string id)
    {
        var deleted = await _drinkService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Drink not found"
            });
        }

        return NoContent();
    }
}