# BlankOn Linux Installer

[![Build Status](https://api.travis-ci.org/BlankOn/blankon-installer.svg?branch=master)](https://travis-ci.org/BlankOn/blankon-installer)

## Debugging

What you get for using `DEBUG=1` environment variable :

- Right click and inspect element enabled.
- `/sbin/b-i-cleanup` wouldn't get executed, leave `/target` mounted for investigation.

## Packaging

Provide custom `/etc/default/blankon-installer` to modify the behaviour of Blankon Installer.
Customization is provided by setting variables as follows:

* `BI_CUSTOM_GROUPS`. Set this variable to a new group so the created user will join this group. These groups will be created by Blankon Installer during installation.
