using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;
using Microsoft.AspNetCore.Identity;

namespace BarMaster.API.Services;

public class WorkerService
{
    private readonly WorkerRepository _workerRepository;
    private readonly PasswordHasher<Worker> _passwordHasher;

    public WorkerService(
        WorkerRepository workerRepository
    )
    {
        _workerRepository = workerRepository;
        _passwordHasher = new PasswordHasher<Worker>();
    }

    public async Task<List<WorkerResponseDto>> GetAllAsync()
    {
        var workers = await _workerRepository.GetAllAsync();

        return workers
            .Select(ToResponseDto)
            .ToList();
    }

    public async Task<WorkerResponseDto?> GetByIdAsync(
        string id
    )
    {
        var worker = await _workerRepository.GetByIdAsync(id);

        return worker is null
            ? null
            : ToResponseDto(worker);
    }

    public async Task<
        (bool Success, string Message, WorkerResponseDto? Worker)
    > CreateAsync(CreateWorkerDto dto)
    {
        var firstName = dto.FirstName.Trim();
        var lastName = dto.LastName.Trim();
        var username = dto.Username.Trim();
        var email = dto.Email.Trim();
        var role = dto.Role.Trim();

        if (string.IsNullOrWhiteSpace(firstName))
        {
            return (false, "First name is required.", null);
        }

        if (string.IsNullOrWhiteSpace(lastName))
        {
            return (false, "Last name is required.", null);
        }

        if (string.IsNullOrWhiteSpace(username))
        {
            return (false, "Username is required.", null);
        }

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return (false, "Password is required.", null);
        }

        if (dto.Password.Length < 8)
        {
            return (
                false,
                "Password must contain at least 8 characters.",
                null
            );
        }

        if (string.IsNullOrWhiteSpace(role))
        {
            return (false, "Role is required.", null);
        }

        var existingUsername =
            await _workerRepository.GetByUsernameAsync(username);

        if (existingUsername is not null)
        {
            return (false, "Username already exists.", null);
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            var existingEmail =
                await _workerRepository.GetByEmailAsync(email);

            if (existingEmail is not null)
            {
                return (false, "Email already exists.", null);
            }
        }

        var worker = new Worker
        {
            WorkerNumber = GenerateWorkerNumber(),
            FirstName = firstName,
            LastName = lastName,
            Phone = dto.Phone.Trim(),
            Email = email,
            Role = role,
            Username = username,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        worker.PasswordHash =
            _passwordHasher.HashPassword(
                worker,
                dto.Password
            );

        await _workerRepository.CreateAsync(worker);

        return (
            true,
            "Worker created successfully.",
            ToResponseDto(worker)
        );
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateWorkerDto dto
    )
    {
        var existingWorker =
            await _workerRepository.GetByIdAsync(id);

        if (existingWorker is null)
        {
            return (false, "Worker not found.");
        }

        var username = dto.Username.Trim();
        var email = dto.Email.Trim();

        var workerWithUsername =
            await _workerRepository.GetByUsernameAsync(username);

        if (
            workerWithUsername is not null &&
            workerWithUsername.Id != id
        )
        {
            return (
                false,
                "Another worker already uses this username."
            );
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            var workerWithEmail =
                await _workerRepository.GetByEmailAsync(email);

            if (
                workerWithEmail is not null &&
                workerWithEmail.Id != id
            )
            {
                return (
                    false,
                    "Another worker already uses this email."
                );
            }
        }

        existingWorker.FirstName = dto.FirstName.Trim();
        existingWorker.LastName = dto.LastName.Trim();
        existingWorker.Phone = dto.Phone.Trim();
        existingWorker.Email = email;
        existingWorker.Role = dto.Role.Trim();
        existingWorker.Username = username;
        existingWorker.IsActive = dto.IsActive;
        existingWorker.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            if (dto.Password.Length < 8)
            {
                return (
                    false,
                    "Password must contain at least 8 characters."
                );
            }

            existingWorker.PasswordHash =
                _passwordHasher.HashPassword(
                    existingWorker,
                    dto.Password
                );
        }

        await _workerRepository.UpdateAsync(
            id,
            existingWorker
        );

        return (true, "Worker updated successfully.");
    }

    public async Task<(bool Success, string Message)> DeleteAsync(
        string id
    )
    {
        var existingWorker =
            await _workerRepository.GetByIdAsync(id);

        if (existingWorker is null)
        {
            return (false, "Worker not found.");
        }

        var deleted =
            await _workerRepository.DeleteAsync(id);

        if (!deleted)
        {
            return (false, "Worker could not be deleted.");
        }

        return (true, "Worker deleted successfully.");
    }

    private static WorkerResponseDto ToResponseDto(
        Worker worker
    )
    {
        return new WorkerResponseDto
        {
            Id = worker.Id,
            WorkerNumber = worker.WorkerNumber,
            FirstName = worker.FirstName,
            LastName = worker.LastName,
            Phone = worker.Phone,
            Email = worker.Email,
            Role = worker.Role,
            Username = worker.Username,
            IsActive = worker.IsActive,
            CreatedAt = worker.CreatedAt,
            UpdatedAt = worker.UpdatedAt
        };
    }

    private static string GenerateWorkerNumber()
    {
        return $"WRK-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}