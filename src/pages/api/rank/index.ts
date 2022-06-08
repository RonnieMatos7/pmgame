import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


type Player = {
  ref: {
    ['@ref']: {
      id: string;
    }
  }
  data: {
    name: string,
    role: string,
    department: string,
    position: string,
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
      const players = await guestClient.query<Player[] | any>(
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

      const playersRank = players?.data?.map((player:Player) => {
        return {
          name: player.data.name,
          department: player.data.department,
          position: player.data.position,
        };
      })

      playersRank.sort((a,b) => (a.position > b.position) ? 1 : -1)
      // ok
      res.status(200).json(players.data);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
