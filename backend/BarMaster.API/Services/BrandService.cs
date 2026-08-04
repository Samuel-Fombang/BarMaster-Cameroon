using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class BrandService
{
    private readonly BrandRepository _repository;

    public BrandService(BrandRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Brand>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Brand?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<(
        bool Success,
        string Message,
        Brand? Brand
    )> CreateAsync(CreateBrandDto dto)
    {
        var existingBrand =
            await _repository.GetByNameAsync(dto.Name);

        if (existingBrand is not null)
        {
            return (
                false,
                "Brand already exists.",
                null
            );
        }

        var brand = new Brand
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.CreateAsync(brand);

        return (
            true,
            "Brand created successfully.",
            brand
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateBrandDto dto
    )
    {
        var existingBrand =
            await _repository.GetByIdAsync(id);

        if (existingBrand is null)
        {
            return (
                false,
                "Brand not found."
            );
        }

        var duplicateBrand =
            await _repository.GetByNameAsync(dto.Name);

        if (
            duplicateBrand is not null &&
            duplicateBrand.Id != id
        )
        {
            return (
                false,
                "Another brand already uses this name."
            );
        }

        existingBrand.Name = dto.Name.Trim();
        existingBrand.Description =
            dto.Description.Trim();
        existingBrand.IsActive = dto.IsActive;

        await _repository.UpdateAsync(
            id,
            existingBrand
        );

        return (
            true,
            "Brand updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingBrand =
            await _repository.GetByIdAsync(id);

        if (existingBrand is null)
        {
            return (
                false,
                "Brand not found."
            );
        }

        await _repository.DeleteAsync(id);

        return (
            true,
            "Brand deleted successfully."
        );
    }
}