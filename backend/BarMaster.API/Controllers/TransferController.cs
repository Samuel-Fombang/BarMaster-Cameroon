using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransferController : ControllerBase
{
    private readonly TransferService _transferService;

    public TransferController(
        TransferService transferService
    )
    {
        _transferService = transferService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Transfer>>> GetTransfers()
    {
        var transfers =
            await _transferService.GetAllAsync();

        return Ok(transfers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transfer>> GetTransferById(
        string id
    )
    {
        var transfer =
            await _transferService.GetByIdAsync(id);

        if (transfer is null)
        {
            return NotFound(new
            {
                message = "Transfer not found."
            });
        }

        return Ok(transfer);
    }

    [HttpPost]
    public async Task<ActionResult<Transfer>> CreateTransfer(
        CreateTransferDto dto
    )
    {
        var result =
            await _transferService.CreateAsync(dto);

        if (!result.Success || result.Transfer is null)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetTransferById),
            new
            {
                id = result.Transfer.Id
            },
            result.Transfer
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransfer(
        string id,
        UpdateTransferDto dto
    )
    {
        var result =
            await _transferService.UpdateAsync(
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

        return Ok(new
        {
            message = result.Message
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransfer(
        string id
    )
    {
        var result =
            await _transferService.DeleteAsync(id);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }
}