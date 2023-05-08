/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Fields,
  IngredFromApi,
  NewRecipe,
  Measures,
  MeasuresObj,
} from '../types';
import { optimizeImg } from './imageOptimization';

export const toNewRecipe = async ({
  id,
  readyInMinutes,
  sourceName,
  sourceUrl,
  aggregateLikes,
  healthScore,
  cheap,
  cuisines,
  dairyFree,
  glutenFree,
  vegan,
  veryHealthy,
  veryPopular,
  extendedIngredients,
  title,
  image,
  imageType,
  summary,
  creditsText,
  servings,
}: Fields): Promise<NewRecipe | null> => {
  try {
    const newRecipeInfo = {
      id: parseNumber('id', id),
      title: parseString('title', title),
      image: await parseImg(image),
      imageType: parseImageType(imageType),
      readyInMinutes: parseNumber('ready in minutes', readyInMinutes),
      sourceName: parseString('sourseName', sourceName),
      sourceUrl: parseString('sourceUrl', sourceUrl),
      servings: parseNumber('servings', servings),
      aggregateLikes: parseNumber('aggregateLikes', aggregateLikes),
      healthScore: parseNumber('healthScore', healthScore),
      cheap: parseBoolean('cheap', cheap),
      cuisines: parseCuisines('cuisines', cuisines),
      dairyFree: parseBoolean('dairyFree', dairyFree),
      glutenFree: parseBoolean('glutenFree', glutenFree),
      vegan: parseBoolean('vegan', vegan),
      veryHealthy: parseBoolean('veryHealthy', veryHealthy),
      veryPopular: parseBoolean('veryPopular', veryPopular),
      extendedIngredients: parseIngredsFromApi(
        'extended ingreds',
        extendedIngredients
      ),
      summary: parseString('summary', summary),
      creditsText: parseString('credits text', creditsText),
    };
    return newRecipeInfo;
  } catch (err) {
    console.log('problem with', id, title, err);
    return null;
  }
};

const parseImageType = (string: unknown): 'jpg' | 'JPG' | 'png' | 'PNG' => {
  if (!string || !isString(string))
    throw new Error('Missing or incorrect image type');
  if (
    string !== 'jpg' &&
    string !== 'JPG' &&
    string !== 'png' &&
    string !== 'PNG'
  )
    throw new Error(`Incorrect image type ${string}`);
  return string;
};

const parseCuisines = (label: string, arr: unknown): Array<string> => {
  if (!Array.isArray(arr)) throw new Error(`Missing ${label}`);
  return arr.map((el) => {
    return parseString('cuisine name', el);
  });
};

const parseIngredsFromApi = (label: string, arr: unknown): IngredFromApi[] => {
  if (!Array.isArray(arr)) throw new Error(`Missing ${label}`);

  const parsedArr: (IngredFromApi | null)[] = arr.map((el) => {
    try {
      return {
        image: parseString('ingred from Api image', el.image),
        aisle: parseString('ingred from Api aisle', el.aisle),
        name: parseString('ingred from Api name', el.name),
        id: parseNumber('ingred id', el.id),
        measures: parseMeasures(`Extended ingredients ${el.name}`, el.measures),
        amount: parseNumber('ingred from Api amount', el.amount),
      };
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
      return null;
    }
  });
  const correctArr: IngredFromApi[] = parsedArr
    .filter((val) => val !== null)
    .map((el) => el as IngredFromApi);

  return correctArr;
};

const parseImg = async (url: unknown): Promise<string> => {
  const urlString = parseString('parsing img', url);
  const newUrl = await optimizeImg(urlString);

  return parseString('parsing new img url', newUrl);
};

function isMeasures(measures: unknown): measures is Measures {
  return (
    typeof measures === 'object' &&
    measures !== null &&
    'metric' in measures &&
    'us' in measures
  );
}

function isMeasuresObj(obj: unknown): obj is MeasuresObj {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'amount' in obj &&
    'unitLong' in obj
  );
}

const parseMeasures = (label: string, measures: unknown): Measures => {
  if (isMeasures(measures)) {
    try {
      return {
        us: parseMeasuresObj(measures.us, label),
        metric: parseMeasuresObj(measures.metric, label),
      };
    } catch (err) {
      throw new Error(`Unable to parse measures of ingred object ${label}`);
    }
  } else {
    throw new Error(`Unable to parse measures of ingred object ${label}`);
  }
};

const parseMeasuresObj = (obj: unknown, label: string): MeasuresObj => {
  if (isMeasuresObj(obj)) {
    return {
      amount: parseNumber(`ingredient amount ${label}`, obj.amount),
      unitLong: parseString(`ingredient unit amount ${label}`, obj.unitLong),
    };
  } else {
    throw new Error(`Unable to parse measure of ingred object ${label}`);
  }
};

const parseNumber = (label: string, number: unknown): number => {
  if (isNaN(Number(number))) throw new Error(`Incorrect or missing ${label}`);
  return Number(number);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (label: string, text: unknown): string => {
  if (!isString(text)) {
    throw new Error(`Incorrect or missing ${label}`);
  }
  return text;
};

const parseBoolean = (label: string, bool: unknown): boolean => {
  if (typeof bool !== 'boolean') {
    throw new Error(`Incorrect or missing ${label}`);
  }
  return bool;
};
