### SendEml

Send raw eml files to SMTP server specified via env vars or .env file

### Install

sudo npm i -g @aibulat/sendeml

### Use

create .env file:

```bash
SMTP_HOST="smtp-server"
SMTP_PORT="25"
SMTP_USER=""
SMTP_PASS=""

LOG_DIR="./log"
LOG_LEVEL="info"
```

sendeml hsenddir -d ./queue/haraka --max 2 --moveDest ./queue/moved
