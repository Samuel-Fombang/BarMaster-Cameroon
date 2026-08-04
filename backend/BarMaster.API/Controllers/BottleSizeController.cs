using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BottleSizeController : ControllerBase
{
    private readonly BottleSizeService _service;

    public BottleSizeController(
        BottleSizeService service
    )
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<BottleSize>>> GetAll()
    {
        var bottleSizes =
            await _service.GetAllAsync();

        return Ok(bottleSizes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BottleSize>> GetById(
        string id
    )
    {
        var bottleSize =
            await _service.GetByIdAsync(id);

        if (bottleSize is null)
        {
            return NotFound(new
            {
                message = "Bottle size not found."
            });
        }

        return Ok(bottleSize);
    }

    [HttpPost]
    public async Task<ActionResult<BottleSize>> Create(
        CreateBottleSizeDto dto
    )
    {
        var result =
            await _service.CreateAsync(dto);

        if (
            !result.Success ||
            result.BottleSize is null
        )
        {
            if (
                result.Message.Contains(
                    "already exists",
                    StringComparison.OrdinalIgnoreCase
                )
            )
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
            nameof(GetById),
            new
            {
                id = result.BottleSize.Id
            },
            result.BottleSize
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        UpdateBottleSizeDto dto
    )
    {
        var result =
            await _service.UpdateAsync(
                id,
                dto
            );

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        string id
    )
    {
        var result =
            await _service.DeleteAsync(id);

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