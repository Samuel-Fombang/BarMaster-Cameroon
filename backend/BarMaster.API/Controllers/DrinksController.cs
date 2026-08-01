using BarMaster.API.Data;
using BarMaster.API.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BarMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DrinksController : ControllerBase
{
    private readonly MongoDbContext _context;

    public DrinksController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Drink>>> GetDrinks()
    {
        var drinks = await _context.Drinks
            .Find(_ => true)
            .ToListAsync();

        return Ok(drinks);
    }

    [HttpPost]
    public async Task<ActionResult<Drink>> CreateDrink(Drink drink)
    {
        drink.Id = null;

        await _context.Drinks.InsertOneAsync(drink);

        return CreatedAtAction(
            nameof(GetDrinkById),
            new { id = drink.Id },
            drink
        );
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Drink>> GetDrinkById(string id)
    {
        var drink = await _context.Drinks
            .Find(item => item.Id == id)
            .FirstOrDefaultAsync();

        if (drink is null)
        {
            return NotFound(new
            {
                message = "Drink not found"
            });
        }

        return Ok(drink);
    }
}