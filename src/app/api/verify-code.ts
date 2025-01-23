import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { code } = req.body;

    // Validate the code against the secret
    if (code === process.env.SECRET_ACCESS_CODE) {
      return res
        .status(200)
        .json({ success: true, redirectTo: req.query.redirectTo || "/" });
    }

    return res.status(401).json({ success: false });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
