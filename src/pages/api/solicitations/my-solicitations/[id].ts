import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";


type Solicitation = {
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

export default async (req: NextApiRequest, res: NextApiResponse<Solicitation[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

  const {
    query: { id },
  } = req;

    try {
      const mySolicitations = await authClient(process.env.FAUNA_GUEST_SECRET).query<Solicitation>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('solicitations_by_player_id'),
              id
            ),
            {size: 2000}
          ),
          q.Lambda("X",
          q.Get(
            q.Var("X")
          ))
        )
      );
      // ok
      res.status(200).json(mySolicitations.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
