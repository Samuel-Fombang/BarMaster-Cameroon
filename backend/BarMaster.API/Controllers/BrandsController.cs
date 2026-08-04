using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly BrandService _brandService;

    public BrandsController(BrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Brand>>> GetBrands()
    {
        var brands = await _brandService.GetAllAsync();

        return Ok(brands);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Brand>> GetBrandById(
        string id
    )
    {
        var brand = await _brandService.GetByIdAsync(id);

        if (brand is null)
        {
            return NotFound(new
            {
                message = "Brand not found."
            });
        }

        return Ok(brand);
    }

    [HttpPost]
    public async Task<ActionResult<Brand>> CreateBrand(
        CreateBrandDto dto
    )
    {
        var result = await _brandService.CreateAsync(dto);

        if (!result.Success || result.Brand is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetBrandById),
            new { id = result.Brand.Id },
            result.Brand
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBrand(
        string id,
        UpdateBrandDto dto
    )
    {
        var result = await _brandService.UpdateAsync(
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
    public async Task<IActionResult> DeleteBrand(
        string id
    )
    {
        var result = await _brandService.DeleteAsync(id);

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