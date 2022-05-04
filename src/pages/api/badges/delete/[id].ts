import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../../utils/fauna-client";
import { getAuthCookie } from "../../../../utils/auth-cookies";



export default async (req: NextApiRequest, res: NextApiResponse<any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'DELETE'){

      
    const {query: { id },} = req;

    console.log(id)
    
    try {
      const deleteBadge = await authClient(process.env.FAUNA_GUEST_SECRET).query(
        q.Delete(
          q.Ref(
            q.Collection('Badge'), id
          )
        )
      );

      
      // ok
      res.status(200).end()
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'DELETE')
    res.status(405).end('Method not allowed')
}
};