using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
    private readonly SupplierService _supplierService;

    public SuppliersController(SupplierService supplierService)
    {
        _supplierService = supplierService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Supplier>>> GetSuppliers()
    {
        var suppliers = await _supplierService.GetAllAsync();

        return Ok(suppliers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Supplier>> GetSupplierById(string id)
    {
        var supplier = await _supplierService.GetByIdAsync(id);

        if (supplier is null)
        {
            return NotFound(new
            {
                message = "Supplier not found."
            });
        }

        return Ok(supplier);
    }

    [HttpPost]
    public async Task<ActionResult<Supplier>> CreateSupplier(
        CreateSupplierDto dto
    )
    {
        var result = await _supplierService.CreateAsync(dto);

        if (!result.Success || result.Supplier is null)
        {
            return Conflict(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetSupplierById),
            new { id = result.Supplier.Id },
            result.Supplier
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(
        string id,
        UpdateSupplierDto dto
    )
    {
        var result = await _supplierService.UpdateAsync(id, dto);

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
    public async Task<IActionResult> DeleteSupplier(string id)
    {
        var result = await _supplierService.DeleteAsync(id);

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