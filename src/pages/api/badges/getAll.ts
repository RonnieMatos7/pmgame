import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


type Badge = {
  ref: {
      id: string;
  }
  data: {
    title: string,
    description: string,
    score: string,
    icon: number,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<Badge[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

    try {
      const badges = await authClient(process.env.FAUNA_GUEST_SECRET).query<Badge>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('allBadges'),
              
            )
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
      // ok
      res.status(200).json(badges.data);
      //console.log(players.data)
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
