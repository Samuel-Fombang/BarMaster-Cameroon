using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class SupplierService
{
    private readonly SupplierRepository _repository;

    public SupplierService(
        SupplierRepository repository
    )
    {
        _repository = repository;
    }

    public async Task<List<Supplier>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Supplier?> GetByIdAsync(
        string id
    )
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<(
        bool Success,
        string Message,
        Supplier? Supplier
    )> CreateAsync(
        CreateSupplierDto dto
    )
    {
        var name =
            (dto.Name ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            return (
                false,
                "Supplier name is required.",
                null
            );
        }

        var existingSupplier =
            await _repository.GetByNameAsync(name);

        if (existingSupplier is not null)
        {
            return (
                false,
                "A supplier with this name already exists.",
                null
            );
        }

        var supplier =
            new Supplier
            {
                Name = name,

                ContactPerson =
                    (dto.ContactPerson ?? string.Empty)
                        .Trim(),

                Phone =
                    (dto.Phone ?? string.Empty)
                        .Trim(),

                Email =
                    (dto.Email ?? string.Empty)
                        .Trim(),

                Address =
                    (dto.Address ?? string.Empty)
                        .Trim(),

                Notes =
                    (dto.Notes ?? string.Empty)
                        .Trim(),

                IsActive =
                    dto.IsActive
            };

        await _repository.CreateAsync(
            supplier
        );

        return (
            true,
            "Supplier created successfully.",
            supplier
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> UpdateAsync(
        string id,
        UpdateSupplierDto dto
    )
    {
        var existingSupplier =
            await _repository.GetByIdAsync(id);

        if (existingSupplier is null)
        {
            return (
                false,
                "Supplier not found."
            );
        }

        var name =
            (dto.Name ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            return (
                false,
                "Supplier name is required."
            );
        }

        var duplicateSupplier =
            await _repository.GetByNameAsync(name);

        if (
            duplicateSupplier is not null &&
            duplicateSupplier.Id != id
        )
        {
            return (
                false,
                "Another supplier already uses this name."
            );
        }

        existingSupplier.Name =
            name;

        existingSupplier.ContactPerson =
            (dto.ContactPerson ?? string.Empty)
                .Trim();

        existingSupplier.Phone =
            (dto.Phone ?? string.Empty)
                .Trim();

        existingSupplier.Email =
            (dto.Email ?? string.Empty)
                .Trim();

        existingSupplier.Address =
            (dto.Address ?? string.Empty)
                .Trim();

        existingSupplier.Notes =
            (dto.Notes ?? string.Empty)
                .Trim();

        existingSupplier.IsActive =
            dto.IsActive;

        var updated =
            await _repository.UpdateAsync(
                id,
                existingSupplier
            );

        if (!updated)
        {
            return (
                false,
                "Supplier could not be updated."
            );
        }

        return (
            true,
            "Supplier updated successfully."
        );
    }

    public async Task<(
        bool Success,
        string Message
    )> DeleteAsync(
        string id
    )
    {
        var existingSupplier =
            await _repository.GetByIdAsync(id);

        if (existingSupplier is null)
        {
            return (
                false,
                "Supplier not found."
            );
        }

        var deleted =
            await _repository.DeleteAsync(id);

        if (!deleted)
        {
            return (
                false,
                "Supplier could not be deleted."
            );
        }

        return (
            true,
            "Supplier deleted successfully."
        );
    }
}