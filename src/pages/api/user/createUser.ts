import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";


type Player = {

  name: string,
  role: string,
  image_url: string,
  department: string,
  password: string,
  created_at: Date
  
}

export default async (req: NextApiRequest, res: NextApiResponse<Player[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'POST'){

    
    const { name, role, department, image_url, password, created_at } = req.body.user;
    
    
    try {
      const createUser = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
        q.Create(q.Collection('User'), {
          credentials: { password },
          data: {
            name,
            role,
            department,
            image_url,
            created_at,
          },
        })
      );

      
      // ok
      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};