# telebomb
> Collects telegram users and channels which are stored in a sqlite3 database. Can send mass scheduled invites to scraped users for a specific channel in organic pattern.


## Instructions
1. Install - `npm install`
2. Start - `pm2 start npm -- start` (or `npm start` without pm2)
3. Import Seeds (one time) - `./utils/db/accounts.csv` into the `accounts` table in `db.sqlite3` (hint: use `sqlite_web db.sqlite3`)


### Sending out invites
1. `npm run job -- --channel <ID> --users <USERS> --hours <HOURS>`

- `<ID>` = channel ID
- `<USERS>` = number of invitations send (1 per user)
- `HOURS` = total timespan the number of invitations should be spread over (in hours)

**note:** an account can only send invites to users of a channel it belongs to.


### Resetting accounts 
1. `npm run reset -- --reset all`


### Tips
- Use PM2 for continous uptime and monitoring.
- `users:hours` ratio should losely follow `300:1` - eg: every 300 users add 1 hour
- Run it for a few hours before sending out invites so that it can collect users.
- View the database in the web browser with `sqlite_web db.sqlite3`
- Seed the DB with `./utils/db/accounts.csv` (hint: use `sqlite_web db.sqlite3`)

### .env

```
COLLECT_ACCOUNT_INTERVAL= 24
COLLECT_CHANNEL_INTERVAL= 72
INVITE_ACCOUNT_INTERVAL= 12

LOGGING= 1
```

^ All intervals are tracked in hours. Turn off logging for less messages in console.
