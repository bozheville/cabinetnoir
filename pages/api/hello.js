// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parseText } from '@math/parser';

export default (req, res) => {
  res.status(200).json(
    parseText()
  );
}
