import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


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

    try {
      const solicitations = await authClient(process.env.FAUNA_GUEST_SECRET).query<Solicitation>(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('solicitation_by_status'),
              "Aguardando aprovação"
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
      res.status(200).json(solicitations.data);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
};
