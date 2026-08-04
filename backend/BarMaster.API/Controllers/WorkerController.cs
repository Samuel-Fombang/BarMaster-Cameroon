using BarMaster.API.DTOs;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WorkerController : ControllerBase
{
    private readonly WorkerService _workerService;

    public WorkerController(WorkerService workerService)
    {
        _workerService = workerService;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkerResponseDto>>> GetWorkers()
    {
        var workers = await _workerService.GetAllAsync();

        return Ok(workers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkerResponseDto>> GetWorkerById(
        string id
    )
    {
        var worker = await _workerService.GetByIdAsync(id);

        if (worker is null)
        {
            return NotFound(new
            {
                message = "Worker not found."
            });
        }

        return Ok(worker);
    }

    [HttpPost]
    public async Task<ActionResult<WorkerResponseDto>> CreateWorker(
        CreateWorkerDto dto
    )
    {
        var result = await _workerService.CreateAsync(dto);

        if (!result.Success || result.Worker is null)
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
            nameof(GetWorkerById),
            new { id = result.Worker.Id },
            result.Worker
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorker(
        string id,
        UpdateWorkerDto dto
    )
    {
        var result = await _workerService.UpdateAsync(
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
    public async Task<IActionResult> DeleteWorker(string id)
    {
        var result = await _workerService.DeleteAsync(id);

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