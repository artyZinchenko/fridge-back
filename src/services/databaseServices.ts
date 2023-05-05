/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NewRecipe, IngredFromApi } from '../../types';
import Ingredient from '../models/ingredient';
import Recipe from '../models/recipes';
import { Types as mongooseTypes } from 'mongoose';

export const saveIngredientsToDB = async (
  recipes: NewRecipe[]
): Promise<void> => {
  try {
    // extract ingredients from all recipes into a flat array
    const allIngreds: IngredFromApi[] = recipes.flatMap(
      (el) => el.extendedIngredients
    );
    const uniqueIngreds = Array.from(new Set(allIngreds));

    // for each ingredient check if its already in db
    // if it isn't save it to a new mongo doc
    const promises = uniqueIngreds.map(async (ingred) => {
      const exists: boolean = await Ingredient.exists({ id: ingred.id }).then(
        (result) => !!result
      );

      if (!exists) {
        const newIngred = new Ingredient({
          aisle: ingred.aisle,
          name: ingred.name,
          id: ingred.id,
          measures: ingred.measures,
          image: ingred.image,
        });

        await newIngred.save();
      }
    });

    await Promise.all(promises);
  } catch (exception: unknown) {
    let errorMessage = 'Something went wrong';
    if (exception instanceof Error) {
      errorMessage += ' Error: ' + exception.message;
      console.log(errorMessage);
    }
  }
};

export const saveRecipesToDB = async (recipes: NewRecipe[]): Promise<void> => {
  try {
    const promises = recipes.map(async (recipe) => {
      const exists: boolean = await Recipe.exists({ id: recipe.id }).then(
        (result) => !!result
      );

      // forming an array of refs to Ingredient(mongoose schema)
      // for each ingredient: find if its in db
      // if it is will extract its _id and push it into refs arr
      // if its not - something went wrng lol
      const pushIngredients = async (
        ingredients: IngredFromApi[]
      ): Promise<Array<mongooseTypes.ObjectId | null>> => {
        const arr: Array<mongooseTypes.ObjectId | null> = [];

        const promises = ingredients.map(async (ingredient) => {
          const foundIngred = await Ingredient.findOne(
            { id: ingredient.id },
            '_id'
          ).exec();

          if (foundIngred && foundIngred._id) {
            arr.push(foundIngred._id);
          } else {
            console.log(`ingred not found ${ingredient.name}`);
          }
        });

        await Promise.all(promises);

        return arr;
      };

      if (!exists) {
        const newRecipe = new Recipe({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          imageType: recipe.imageType,
          readyInMinutes: recipe.readyInMinutes,
          sourceName: recipe.sourceName,
          sourceUrl: recipe.sourceUrl,
          aggregateLikes: recipe.aggregateLikes,
          healthScore: recipe.healthScore,
          cheap: recipe.cheap,
          servings: recipe.servings,
          cuisines: recipe.cuisines,
          dairyFree: recipe.dairyFree,
          glutenFree: recipe.glutenFree,
          vegan: recipe.vegan,
          veryHealthy: recipe.veryHealthy,
          veryPopular: recipe.veryPopular,
          extendedIngredients: await pushIngredients(
            recipe.extendedIngredients
          ),
          summary: recipe.summary,
          creditsText: recipe.creditsText,
        });

        await newRecipe.save();
      }
    });

    await Promise.all(promises);
  } catch (exception: unknown) {
    let errorMessage = 'Something went wrong';
    if (exception instanceof Error) {
      errorMessage += ' Error: ' + exception.message;
      console.log(errorMessage);
    }
  }
};
