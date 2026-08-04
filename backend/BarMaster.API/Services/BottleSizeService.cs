using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class BottleSizeService
{
    private readonly BottleSizeRepository _repository;

    public BottleSizeService(
        BottleSizeRepository repository
    )
    {
        _repository = repository;
    }

    public async Task<List<BottleSize>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<BottleSize?> GetByIdAsync(
        string id
    )
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<(
        bool Success,
        string Message,
        BottleSize? BottleSize
    )> CreateAsync(
        CreateBottleSizeDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return (
                false,
                "Bottle size name is required.",
                null
            );
        }

        var existingBottleSize =
            await _repository.GetByNameAsync(
                dto.Name
            );

        if (existingBottleSize is not null)
        {
            return (
                false,
                "Bottle size already exists.",
                null
            );
        }

        var bottleSize = new BottleSize
        {
            Name = dto.Name.Trim(),
            IsActive = dto.IsActive
        };

        await _repository.CreateAsync(
            bottleSize
        );

        return (
            true,
            "Bottle size created successfully.",
            bottleSize
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateBottleSizeDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return (
                false,
                "Bottle size name is required."
            );
        }

        var existingBottleSize =
            await _repository.GetByIdAsync(id);

        if (existingBottleSize is null)
        {
            return (
                false,
                "Bottle size not found."
            );
        }

        var duplicateBottleSize =
            await _repository.GetByNameAsync(
                dto.Name
            );

        if (
            duplicateBottleSize is not null &&
            duplicateBottleSize.Id != id
        )
        {
            return (
                false,
                "Another bottle size already uses this name."
            );
        }

        existingBottleSize.Name =
            dto.Name.Trim();

        existingBottleSize.IsActive =
            dto.IsActive;

        var updated =
            await _repository.UpdateAsync(
                id,
                existingBottleSize
            );

        if (!updated)
        {
            return (
                false,
                "Bottle size could not be updated."
            );
        }

        return (
            true,
            "Bottle size updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingBottleSize =
            await _repository.GetByIdAsync(id);

        if (existingBottleSize is null)
        {
            return (
                false,
                "Bottle size not found."
            );
        }

        var deleted =
            await _repository.DeleteAsync(id);

        if (!deleted)
        {
            return (
                false,
                "Bottle size could not be deleted."
            );
        }

        return (
            true,
            "Bottle size deleted successfully."
        );
    }
}