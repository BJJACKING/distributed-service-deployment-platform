# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## SSH Servers (Added 2026-02-02)

### Aliyun Server
- **Host:** 182.92.31.155
- **Username:** root
- **Hostname:** alijack
- **Password:** $aliyunNihao8
- **Status:** Passwordless SSH configured

### Tencent Cloud Server
- **Host:** 152.136.16.77
- **Username:** ubuntu
- **Hostname:** tenjack
- **Password:** $tenxunyunNihao8
- **Status:** Passwordless SSH configured

### SSH Aliases (configured in ~/.ssh/config)
```
# Aliyun Server
Host alijack
    HostName 182.92.31.155
    User root
    IdentityFile ~/.ssh/id_rsa

# Tencent Cloud Server (ubuntu user)
Host tenjack
    HostName 152.136.16.77
    User ubuntu
    IdentityFile ~/.ssh/id_rsa

# Tencent Cloud Server (root user)
Host tenjack-root
    HostName 152.136.16.77
    User root
    IdentityFile ~/.ssh/id_rsa
```

### Quick Commands
```bash
# Connect to Aliyun using alias
ssh alijack

# Connect to Tencent using alias (ubuntu user)
ssh tenjack

# Connect to Tencent as root user
ssh tenjack-root

# Original commands (still work)
ssh root@182.92.31.155
ssh ubuntu@152.136.16.77
ssh root@152.136.16.77
```