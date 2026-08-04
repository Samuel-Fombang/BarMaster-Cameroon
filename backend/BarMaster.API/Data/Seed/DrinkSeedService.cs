using BarMaster.API.Models;
using BarMaster.API.Repositories;

namespace BarMaster.API.Data.Seed;

public class DrinkSeedService
{
    private readonly DrinkRepository _drinkRepository;

    public DrinkSeedService(
        DrinkRepository drinkRepository
    )
    {
        _drinkRepository = drinkRepository;
    }

    public async Task SeedAsync()
    {
        var existingDrinks =
            await _drinkRepository.GetAllAsync();

        var existingKeys = existingDrinks
            .Select(drink =>
                CreateKey(
                    drink.Name,
                    drink.BottleSize
                )
            )
            .ToHashSet();

        foreach (var drink in GetDrinkList())
        {
            var key = CreateKey(
                drink.Name,
                drink.BottleSize
            );

            if (existingKeys.Contains(key))
            {
                continue;
            }

            await _drinkRepository.CreateAsync(
                drink
            );

            existingKeys.Add(key);
        }
    }

    private static string CreateKey(
        string name,
        string bottleSize
    )
    {
        return
            $"{name.Trim().ToLowerInvariant()}|" +
            $"{bottleSize.Trim().ToLowerInvariant()}";
    }

    private static List<Drink> GetDrinkList()
    {
        return
        [
            // BOISSONS DU CAMEROUN

            CreateDrink(
                "Beaufort Lager",
                "Beer",
                "Beaufort Lager",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Beaufort Lager",
                "Beer",
                "Beaufort Lager",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Beaufort Light",
                "Beer",
                "Beaufort Light",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Beaufort Light",
                "Beer",
                "Beaufort Light",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "33 Export",
                "Beer",
                "33 Export",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "33 Export",
                "Beer",
                "33 Export",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Mützig",
                "Beer",
                "Mützig",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Mützig",
                "Beer",
                "Mützig",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Castel Beer",
                "Beer",
                "Castel Beer",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Castel Beer",
                "Beer",
                "Castel Beer",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Castle Milk Stout",
                "Stout Beer",
                "Castle Milk Stout",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Castle Milk Stout",
                "Stout Beer",
                "Castle Milk Stout",
                "60 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Doppel Munich",
                "Beer",
                "Doppel Munich",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Doppel Munich",
                "Beer",
                "Doppel Munich",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Isenbeck",
                "Beer",
                "Isenbeck",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Isenbeck",
                "Beer",
                "Isenbeck",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Manyan",
                "Beer",
                "Manyan",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Manyan",
                "Beer",
                "Manyan",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Magnan",
                "Beer",
                "Magnan",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Magnan",
                "Beer",
                "Magnan",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Chill",
                "Beer",
                "Chill",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Chill",
                "Beer",
                "Chill",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Booster Whisky Cola",
                "Alcohol Mix",
                "Booster Whisky Cola",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Booster Gin Tonic",
                "Alcohol Mix",
                "Booster Gin Tonic",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Booster Racines",
                "Alcohol Mix",
                "Booster Racines",
                "33 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Coca-Cola",
                "Soft Drinks",
                "Coca-Cola",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Coca-Cola",
                "Soft Drinks",
                "Coca-Cola",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Coca-Cola",
                "Soft Drinks",
                "Coca-Cola",
                "1 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Coca-Cola",
                "Soft Drinks",
                "Coca-Cola",
                "1.5 L",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Fanta Orange",
                "Soft Drinks",
                "Fanta Orange",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Fanta Orange",
                "Soft Drinks",
                "Fanta Orange",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Fanta Orange",
                "Soft Drinks",
                "Fanta Orange",
                "1 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Fanta Orange",
                "Soft Drinks",
                "Fanta Orange",
                "1.5 L",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Sprite",
                "Soft Drinks",
                "Sprite",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Sprite",
                "Soft Drinks",
                "Sprite",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Sprite",
                "Soft Drinks",
                "Sprite",
                "1 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Sprite",
                "Soft Drinks",
                "Sprite",
                "1.5 L",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Schweppes Tonic",
                "Soft Drinks",
                "Schweppes Tonic",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Schweppes Tonic",
                "Soft Drinks",
                "Schweppes Tonic",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Orangina",
                "Soft Drinks",
                "Orangina",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Orangina",
                "Soft Drinks",
                "Orangina",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "World Cola",
                "Soft Drinks",
                "World Cola",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "World Cola",
                "Soft Drinks",
                "World Cola",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "World Cola",
                "Soft Drinks",
                "World Cola",
                "1.5 L",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Vimto",
                "Soft Drinks",
                "Vimto",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Vimto",
                "Soft Drinks",
                "Vimto",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Djino Cocktail",
                "Soft Drinks",
                "Djino Cocktail",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Djino Cocktail",
                "Soft Drinks",
                "Djino Cocktail",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Top Orange",
                "Soft Drinks",
                "Top Orange",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Orange",
                "Soft Drinks",
                "Top Orange",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Ananas",
                "Soft Drinks",
                "Top Ananas",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Ananas",
                "Soft Drinks",
                "Top Ananas",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Grenadine",
                "Soft Drinks",
                "Top Grenadine",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Grenadine",
                "Soft Drinks",
                "Top Grenadine",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Pamplemousse",
                "Soft Drinks",
                "Top Pamplemousse",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Pamplemousse",
                "Soft Drinks",
                "Top Pamplemousse",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Citron",
                "Soft Drinks",
                "Top Citron",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Citron",
                "Soft Drinks",
                "Top Citron",
                "50 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Tonic",
                "Soft Drinks",
                "Top Tonic",
                "35 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Top Tonic",
                "Soft Drinks",
                "Top Tonic",
                "50 cl",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "Source Tangui",
                "Water",
                "Source Tangui",
                "0.5 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Source Tangui",
                "Water",
                "Source Tangui",
                "1 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Source Tangui",
                "Water",
                "Source Tangui",
                "1.5 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Aqua Belle",
                "Water",
                "Aqua Belle",
                "0.5 L",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Aqua Belle",
                "Water",
                "Aqua Belle",
                "1.5 L",
                "Boissons du Cameroun"
            ),

            CreateDrink(
                "XXL",
                "Energy Drink",
                "XXL",
                "25 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "XXL",
                "Energy Drink",
                "XXL",
                "33 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Black Power",
                "Energy Drink",
                "Black Power",
                "25 cl",
                "Boissons du Cameroun"
            ),
            CreateDrink(
                "Malta Tonic",
                "Malt Drink",
                "Malta Tonic",
                "33 cl",
                "Boissons du Cameroun"
            ),

            // GUINNESS CAMEROON

            CreateDrink(
                "Guinness Foreign Extra Stout",
                "Stout Beer",
                "Guinness Foreign Extra Stout",
                "33 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Guinness Foreign Extra Stout",
                "Stout Beer",
                "Guinness Foreign Extra Stout",
                "65 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Guinness Smooth",
                "Stout Beer",
                "Guinness Smooth",
                "50 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Harp Lager",
                "Lager Beer",
                "Harp Lager",
                "60 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Orijin Bitters",
                "Bitters",
                "Orijin Bitters",
                "65 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Ice Black",
                "RTD",
                "Ice Black",
                "33 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Ice Pineapple Punch",
                "RTD",
                "Ice Pineapple Punch",
                "33 cl",
                "Guinness Cameroon"
            ),
            CreateDrink(
                "Malta Guinness",
                "Malt Drink",
                "Malta Guinness",
                "33 cl",
                "Guinness Cameroon"
            ),

            // UCB - KADJI GROUP

            CreateDrink(
                "Kadji Beer Blonde",
                "Beer",
                "Kadji Beer Blonde",
                "33 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Kadji Beer Blonde",
                "Beer",
                "Kadji Beer Blonde",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Kadji Beer Blonde",
                "Beer",
                "Kadji Beer Blonde",
                "33 cl Can",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Kadji Beer Blonde",
                "Beer",
                "Kadji Beer Blonde",
                "50 cl Can",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Kadji Beer Brune",
                "Beer",
                "Kadji Beer Brune",
                "33 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Kadji Beer Brune",
                "Beer",
                "Kadji Beer Brune",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "King Beer",
                "Beer",
                "King Beer",
                "33 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "King Beer",
                "Beer",
                "King Beer",
                "60 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "K44 Beer",
                "Beer",
                "K44 Beer",
                "33 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "K44 Beer",
                "Beer",
                "K44 Beer",
                "60 cl",
                "UCB (Kadji Group)"
            ),

            CreateDrink(
                "Spécial Cola",
                "Soft Drinks",
                "Spécial Cola",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Cola",
                "Soft Drinks",
                "Spécial Cola",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Cola",
                "Soft Drinks",
                "Spécial Cola",
                "1.5 L",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Orange",
                "Soft Drinks",
                "Spécial Orange",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Orange",
                "Soft Drinks",
                "Spécial Orange",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Orange",
                "Soft Drinks",
                "Spécial Orange",
                "1.5 L",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Grenadine",
                "Soft Drinks",
                "Spécial Grenadine",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Grenadine",
                "Soft Drinks",
                "Spécial Grenadine",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Grenadine",
                "Soft Drinks",
                "Spécial Grenadine",
                "1.5 L",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Pamplemousse",
                "Soft Drinks",
                "Spécial Pamplemousse",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Pamplemousse",
                "Soft Drinks",
                "Spécial Pamplemousse",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Pamplemousse",
                "Soft Drinks",
                "Spécial Pamplemousse",
                "1.5 L",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Pamplemousse",
                "Soft Drinks",
                "Spécial Pamplemousse",
                "33 cl Can",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Limonade",
                "Soft Drinks",
                "Spécial Limonade",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Limonade",
                "Soft Drinks",
                "Spécial Limonade",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Limonade",
                "Soft Drinks",
                "Spécial Limonade",
                "1.5 L",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Orange Passion",
                "Soft Drinks",
                "Spécial Orange Passion",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Orange Passion",
                "Soft Drinks",
                "Spécial Orange Passion",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Cocktail",
                "Soft Drinks",
                "Spécial Cocktail",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Cocktail",
                "Soft Drinks",
                "Spécial Cocktail",
                "50 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Fruits Rouges",
                "Soft Drinks",
                "Spécial Fruits Rouges",
                "35 cl",
                "UCB (Kadji Group)"
            ),
            CreateDrink(
                "Spécial Fruits Rouges",
                "Soft Drinks",
                "Spécial Fruits Rouges",
                "50 cl",
                "UCB (Kadji Group)"
            ),

            // HEINEKEN AND IMPORTED DRINKS

            CreateDrink(
                "Heineken",
                "Premium Beer",
                "Heineken",
                "33 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Heineken",
                "Premium Beer",
                "Heineken",
                "65 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Heineken",
                "Premium Beer",
                "Heineken",
                "33 cl Can",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Heineken",
                "Premium Beer",
                "Heineken",
                "50 cl Can",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Skol",
                "Beer",
                "Skol",
                "33 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Skol",
                "Beer",
                "Skol",
                "50 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Kiss",
                "Beer",
                "Kiss",
                "33 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Bavaria Premium",
                "Beer",
                "Bavaria Premium",
                "33 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Bavaria Premium",
                "Beer",
                "Bavaria Premium",
                "50 cl Can",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Power Malt",
                "Malt Drink",
                "Power Malt",
                "33 cl",
                "Heineken Cameroon"
            ),
            CreateDrink(
                "Van Pur Malt",
                "Malt Drink",
                "Van Pur Malt",
                "33 cl",
                "Heineken Cameroon"
            ),

            // SUPERMONT

            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "33 cl",
                "Supermont"
            ),
            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "50 cl",
                "Supermont"
            ),
            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "1 L",
                "Supermont"
            ),
            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "1.5 L",
                "Supermont"
            ),
            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "5 L",
                "Supermont"
            ),
            CreateDrink(
                "Supermont",
                "Mineral Water",
                "Supermont",
                "10 L",
                "Supermont"
            )
        ];
    }

    private static Drink CreateDrink(
        string name,
        string category,
        string brand,
        string bottleSize,
        string supplier
    )
    {
        return new Drink
        {
            Name = name,
            Category = category,
            Brand = brand,
            BottleSize = bottleSize,
            Supplier = supplier,
            BuyingPrice = 0,
            SellingPrice = 0,
            CurrentStock = 0,
            MinimumStock = 0,
            IsActive = true
        };
    }
}