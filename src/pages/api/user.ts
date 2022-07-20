import { query as q } from 'faunadb';
import { authClient } from '../../utils/fauna-client';
import { getAuthCookie } from '../../utils/auth-cookies';
import { format } from 'date-fns';

interface authQueryProps {
  ref: any;
  data: any;
}

export default async function user(req, res) {
  const token = getAuthCookie(req);

  if (!token) {
    return res.status(401).send('Auth cookie not found');
  }

  try {
    const { ref, data }: authQueryProps  = await authClient(token).query(
      q.Get(q.CurrentIdentity())
    );

    /* const registerLoginLog = await authClient(process.env.FAUNA_GUEST_SECRET).query(
      q.Create(q.Collection('LoginLog'), {
        data: {
          player: data,
          login: new Date(),
        },
      })
    ); */


    res.status(200).json({ ...data, id: ref.id });
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}