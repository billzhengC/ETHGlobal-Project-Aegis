import { DateTime } from "luxon";
import { NextApiRequest } from "next";

/**
 * Api request
 */
export interface ApiRequest<T, U> extends NextApiRequest {
  params: T; // formatted query
  data: U; // formatted body
  user: TokenPayload; // user info in token
  token: string; // token
}

/**
 * JWT Payload
 */
export interface TokenPayload {
  mid?: string; // user id
  wallet_pub?: string; // wallet public key
  wallet_type?: string; // wallet type
  twitter?: string; // twitter
  email?: string; //email
  uname?: string; // name
  face?: string; // avatar
  gender?: number; // gender 0 secret 1 female 2 male
  meta?: string; // temp use for minting related info
  last_login_time?: string; // last login time
}

/**
 * Cron JWT Payload
 */
export interface CronTokenPayload {
  source?: string; // source
  type?: string; // job type
  name?: string; // job name
}

/**
 * XmtpMessage
 */
export interface XmtpMessage {
  id: string; // message id
  from: string; // sender address
  title: string; // title of the message
  content: string; // content of the message
  timestamp: DateTime; // send time of the message
}
