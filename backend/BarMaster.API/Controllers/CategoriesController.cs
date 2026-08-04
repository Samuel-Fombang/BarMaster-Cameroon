using BarMaster.API.DTOs;
using BarMaster.API.Models;
using BarMaster.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarMaster.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetCategories()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategoryById(string id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(
        CreateCategoryDto dto
    )
    {
        var result = await _categoryService.CreateAsync(dto);

        if (!result.Success || result.Category is null)
        {
            return Conflict(new
            {
                message = result.Message
            });
        }

        return CreatedAtAction(
            nameof(GetCategoryById),
            new { id = result.Category.Id },
            result.Category
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(
        string id,
        UpdateCategoryDto dto
    )
    {
        var result = await _categoryService.UpdateAsync(id, dto);

        if (!result.Success)
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var result = await _categoryService.DeleteAsync(id);

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