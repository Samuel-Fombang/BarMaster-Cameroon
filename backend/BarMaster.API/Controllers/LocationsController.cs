using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly LocationService _locationService;

    public LocationsController(LocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Location>>> GetLocations()
    {
        var locations = await _locationService.GetAllAsync();

        return Ok(locations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Location>> GetLocationById(string id)
    {
        var location = await _locationService.GetByIdAsync(id);

        if (location is null)
        {
            return NotFound(new
            {
                message = "Location not found."
            });
        }

        return Ok(location);
    }

    [HttpPost]
    public async Task<ActionResult<Location>> CreateLocation(
        CreateLocationDto dto
    )
    {
        var result = await _locationService.CreateAsync(dto);

        if (!result.Success || result.Location is null)
        {
            return Conflict(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetLocationById),
            new { id = result.Location.Id },
            result.Location
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLocation(
        string id,
        UpdateLocationDto dto
    )
    {
        var result = await _locationService.UpdateAsync(id, dto);

        if (!result.Success)
        {
            if (result.Message.Contains("already"))
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return NotFound(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLocation(string id)
    {
        var result = await _locationService.DeleteAsync(id);

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