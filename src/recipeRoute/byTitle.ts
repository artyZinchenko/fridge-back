/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import { ResultArr, NewRecipe } from '../../types';
import { formatRecipes } from '../utils/formating';
import { headers } from '../utils/headers';

const route = express.Router();

export default route.post(`/`, async (req, res) => {
  console.log('bytitle');
  const title: string = req.body.item.title;
  const id: number | null = req.body.item.id;
  console.log(title, id);

  let responseArr: NewRecipe[] = [];
  let tries = 3;
  let arg = title;
  let gotData = false;

  async function makeApiCall() {
    const { data }: { data: ResultArr } = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?query=${arg}&number=10`,
      { headers: headers }
    );
    if (data.results.length === 0) {
      tries--;
      arg =
        arg.split(' ').length > 1
          ? arg
              .split(' ')
              .slice(0, arg.split(' ').length - 1)
              .join(' ')
          : arg.slice(0, -1);
    } else {
      gotData = true;
      return data;
    }
  }

  async function makeApiCallWithRetries(tries: number): Promise<ResultArr> {
    const data = await makeApiCall();
    if (!gotData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (tries - 1 < 1) throw new Error('No results');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await makeApiCallWithRetries(tries - 1);
    }
    if (!data) throw new Error('No results');
    return data;
  }

  try {
    const data = await makeApiCallWithRetries(tries);
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const ids = data.results.map((el) => el.id).toString();

      const bulkResponse = await axios.get(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}`,
        {
          headers: headers,
        }
      );

      const recipes = await formatRecipes(bulkResponse.data);

      responseArr = responseArr.concat(recipes);
    }
  } catch (err) {
    if (err instanceof Error) console.log(err.message);
  }

  if (id) {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        headers: headers,
      }
    );

    const firstRecipe = await formatRecipes([response.data]);

    responseArr.unshift(firstRecipe[0]);
  }

  res.send(responseArr);

  return;
});
