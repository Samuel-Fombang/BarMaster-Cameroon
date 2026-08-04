using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class LocationService
{
    private readonly LocationRepository _repository;

    public LocationService(LocationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Location>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Location?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<
        (bool Success, string Message, Location? Location)
    > CreateAsync(CreateLocationDto dto)
    {
        var trimmedName = dto.Name.Trim();

        var existingLocation =
            await _repository.GetByNameAsync(trimmedName);

        if (existingLocation is not null)
        {
            return (
                false,
                "Location already exists.",
                null
            );
        }

        var location = new Location
        {
            Name = trimmedName,
            Type = dto.Type.Trim(),
            Address = dto.Address.Trim(),
            Description = dto.Description.Trim(),
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.CreateAsync(location);

        return (
            true,
            "Location created successfully.",
            location
        );
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateLocationDto dto
    )
    {
        var existingLocation =
            await _repository.GetByIdAsync(id);

        if (existingLocation is null)
        {
            return (
                false,
                "Location not found."
            );
        }

        var trimmedName = dto.Name.Trim();

        var duplicateLocation =
            await _repository.GetByNameAsync(trimmedName);

        if (
            duplicateLocation is not null &&
            duplicateLocation.Id != id
        )
        {
            return (
                false,
                "Another location already uses this name."
            );
        }

        existingLocation.Name = trimmedName;
        existingLocation.Type = dto.Type.Trim();
        existingLocation.Address = dto.Address.Trim();
        existingLocation.Description =
            dto.Description.Trim();
        existingLocation.IsActive = dto.IsActive;
        existingLocation.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            id,
            existingLocation
        );

        return (
            true,
            "Location updated successfully."
        );
    }

    public async Task<(bool Success, string Message)> DeleteAsync(
        string id
    )
    {
        var existingLocation =
            await _repository.GetByIdAsync(id);

        if (existingLocation is null)
        {
            return (
                false,
                "Location not found."
            );
        }

        await _repository.DeleteAsync(id);

        return (
            true,
            "Location deleted successfully."
        );
    }
}