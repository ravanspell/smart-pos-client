import { NextApiRequest, NextApiResponse } from 'next';
import HTTPMethod from 'http-method-enum';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === HTTPMethod.GET) {
    return res.status(200).json({
      status: 'SUCCESS',
      data: {
        scopes: ['VIEW:USERS', 'EDIT:USERS', 'ADD:USERS'],
      },
    });
  }

  // If not POST, return method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}