
#!/bin/bash
openssl enc -d -aes-256-cbc -in .env.enc -out .env -k password
