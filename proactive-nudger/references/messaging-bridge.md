# Messaging Bridge Protocol (WhatsApp)

The `proactive-nudger` uses the OpenClaw internal messaging bridge to communicate with the user.

## Interface
The bridge is accessed via the `openclaw message send` CLI command.

## Parameters
- **Target Number**: `+447533464436` (Must be in E.164 format).
- **Gateway Token**: Required for authentication with the AWS/Twilio endpoint.
- **Message Content**: Conversational, non-automated tone.

## Example Command
```bash
/Users/igorsilva/.nvm/versions/node/v22.16.0/bin/node \
  /Users/igorsilva/.nvm/versions/node/v22.16.0/bin/openclaw \
  message send \
  +447533464436 \
  "Hey Igor, checking in on [Skill]..." \
  --token [GATEWAY_TOKEN]
```

## Security
Transactional tokens are stored in `assets/sentinel-config.yaml` or as environment variables.
Avoid logging the plain-text token to terminal output.
