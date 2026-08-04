using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class CategoryService
{
    private readonly CategoryRepository _repository;

    public CategoryService(CategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<(
        bool Success,
        string Message,
        Category? Category
    )> CreateAsync(CreateCategoryDto dto)
    {
        var existingCategory =
            await _repository.GetByNameAsync(dto.Name);

        if (existingCategory is not null)
        {
            return (
                false,
                "Category already exists.",
                null
            );
        }

        var category = new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.CreateAsync(category);

        return (
            true,
            "Category created successfully.",
            category
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateCategoryDto dto
    )
    {
        var existingCategory =
            await _repository.GetByIdAsync(id);

        if (existingCategory is null)
        {
            return (
                false,
                "Category not found."
            );
        }

        existingCategory.Name = dto.Name.Trim();
        existingCategory.Description =
            dto.Description.Trim();
        existingCategory.IsActive = dto.IsActive;

        await _repository.UpdateAsync(
            id,
            existingCategory
        );

        return (
            true,
            "Category updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(string id)
    {
        var existingCategory =
            await _repository.GetByIdAsync(id);

        if (existingCategory is null)
        {
            return (
                false,
                "Category not found."
            );
        }

        await _repository.DeleteAsync(id);

        return (
            true,
            "Category deleted successfully."
        );
    }
}