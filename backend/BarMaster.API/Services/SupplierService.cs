using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Services;

public class SupplierService
{
    private readonly SupplierRepository _repository;

    public SupplierService(SupplierRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Supplier>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Supplier?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<(bool Success, string Message, Supplier? Supplier)> CreateAsync(
        CreateSupplierDto dto
    )
    {
        var existingSupplier = await _repository.GetByNameAsync(dto.Name);

        if (existingSupplier is not null)
        {
            return (false, "Supplier already exists.", null);
        }

        var supplier = new Supplier
        {
            Name = dto.Name.Trim(),
            ContactPerson = dto.ContactPerson.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            Address = dto.Address.Trim(),
            Notes = dto.Notes.Trim(),
            IsActive = dto.IsActive
        };

        await _repository.CreateAsync(supplier);

        return (true, "Supplier created successfully.", supplier);
    }

    public async Task<(bool Success, string Message)> UpdateAsync(
        string id,
        UpdateSupplierDto dto
    )
    {
        var existingSupplier = await _repository.GetByIdAsync(id);

        if (existingSupplier is null)
        {
            return (false, "Supplier not found.");
        }

        var duplicateSupplier = await _repository.GetByNameAsync(dto.Name);

        if (
            duplicateSupplier is not null &&
            duplicateSupplier.Id != id
        )
        {
            return (false, "Another supplier already uses this name.");
        }

        existingSupplier.Name = dto.Name.Trim();
        existingSupplier.ContactPerson = dto.ContactPerson.Trim();
        existingSupplier.Phone = dto.Phone.Trim();
        existingSupplier.Email = dto.Email.Trim();
        existingSupplier.Address = dto.Address.Trim();
        existingSupplier.Notes = dto.Notes.Trim();
        existingSupplier.IsActive = dto.IsActive;

        await _repository.UpdateAsync(id, existingSupplier);

        return (true, "Supplier updated successfully.");
    }

    public async Task<(bool Success, string Message)> DeleteAsync(string id)
    {
        var existingSupplier = await _repository.GetByIdAsync(id);

        if (existingSupplier is null)
        {
            return (false, "Supplier not found.");
        }

        await _repository.DeleteAsync(id);

        return (true, "Supplier deleted successfully.");
    }
}