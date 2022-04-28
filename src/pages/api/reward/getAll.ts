import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


type Reward = {
  ref: {
      id: string;
  }
  data: {
    name: string,
    role: string,
    image_url: string,
    score: number,
    score_extract:[]
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Reward[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

    try {
      const rewards = await authClient(process.env.FAUNA_GUEST_SECRET).query<Reward>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('allRewards'),
              
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
      // ok
      res.status(200).json(rewards.data);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
