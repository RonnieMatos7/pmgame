import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { authClient, guestClient } from "../../../utils/fauna-client";
import { getAuthCookie } from "../../../utils/auth-cookies";
import { format } from "date-fns";


type Player = {

  name: string,
  role: string,
  image_url: string,
  department: string,
  password: string,
  created_at: string
  
}

export default async (req: NextApiRequest, res: NextApiResponse<Player[] | any >) => {
  const token = getAuthCookie(req);
  
  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }
  
  if(req.method === 'POST'){

    
    const { name, email, role, department, image_url, password, created_at } = req.body.user;
    const lowerCaseEmail = email.toLowerCase();
    
    try {
      const createUser = await authClient(process.env.FAUNA_GUEST_SECRET).query<Player>(
        q.Create(q.Collection('User'), {
          credentials: { password },
          data: {
            name,
            role,
            email: lowerCaseEmail,
            department,
            image_url,
            created_at:format(new Date(), 'dd/MM/yyyy'),
            position: 0,
            score: 0,
            old_position: 0,
            rewards: [],
            tasks: [],
            badges: [],
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