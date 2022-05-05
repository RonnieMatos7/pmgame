import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../utils/fauna-client";
import { getAuthCookie } from "../../utils/auth-cookies";


type Player = {
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

export default async (req: NextApiRequest, res: NextApiResponse<Player[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

    try {
      const players = await guestClient.query<Player>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('all_players'),
              'Jogador'
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
      // ok
      res.status(200).json(players.data);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
